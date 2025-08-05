const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createDefaultClasses } = require('./init-db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.tudominio.com', 'https://tudominio.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Conexión a la base de datos
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
  });
});

// Rutas de cursos
app.get('/api/courses', authenticateToken, (req, res) => {
  db.all('SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, courses) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(courses);
  });
});

app.post('/api/courses', authenticateToken, (req, res) => {
  const { name, description } = req.body;

  db.run('INSERT INTO courses (name, description, user_id) VALUES (?, ?, ?)', 
    [name, description, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el curso' });
    }

    const courseId = this.lastID;
    
    // Crear las 18 clases por defecto para este curso
    createDefaultClasses(courseId).then(() => {
      res.json({ id: courseId, name, description, user_id: req.user.id });
    }).catch(err => {
      console.error('Error creando clases por defecto:', err);
      res.json({ id: courseId, name, description, user_id: req.user.id });
    });
  });
});

// Rutas de grupos
app.get('/api/courses/:courseId/groups', authenticateToken, (req, res) => {
  const { courseId } = req.params;

  db.all(`
    SELECT g.*, COUNT(s.id) as student_count 
    FROM groups g 
    LEFT JOIN students s ON g.id = s.group_id 
    WHERE g.course_id = ? 
    GROUP BY g.id 
    ORDER BY g.created_at DESC
  `, [courseId], (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(groups);
  });
});

app.post('/api/courses/:courseId/groups', authenticateToken, (req, res) => {
  const { courseId } = req.params;
  const { name } = req.body;

  db.run('INSERT INTO groups (name, course_id) VALUES (?, ?)', [name, courseId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el grupo' });
    }
    res.json({ id: this.lastID, name, course_id: courseId });
  });
});

// Rutas de estudiantes
app.get('/api/groups/:groupId/students', authenticateToken, (req, res) => {
  const { groupId } = req.params;

  db.all('SELECT * FROM students WHERE group_id = ? ORDER BY name', [groupId], (err, students) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(students);
  });
});

app.post('/api/groups/:groupId/students', authenticateToken, (req, res) => {
  const { groupId } = req.params;
  const { name, email } = req.body;

  db.run('INSERT INTO students (name, email, group_id) VALUES (?, ?, ?)', 
    [name, email, groupId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el estudiante' });
    }
    res.json({ id: this.lastID, name, email, group_id: groupId });
  });
});

// Rutas de clases
app.get('/api/courses/:courseId/classes', authenticateToken, (req, res) => {
  const { courseId } = req.params;

  db.all('SELECT * FROM classes WHERE course_id = ? ORDER BY week_number', [courseId], (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(classes);
  });
});

// Rutas de asistencia
app.get('/api/classes/:classId/attendance', authenticateToken, (req, res) => {
  const { classId } = req.params;

  db.all(`
    SELECT a.*, s.name as student_name, s.id as student_id
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE a.class_id = ?
    ORDER BY s.name
  `, [classId], (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(attendance);
  });
});

app.post('/api/attendance', authenticateToken, (req, res) => {
  const { student_id, class_id, present, comments } = req.body;

  db.run(`
    INSERT OR REPLACE INTO attendance (student_id, class_id, present, comments)
    VALUES (?, ?, ?, ?)
  `, [student_id, class_id, present ? 1 : 0, comments], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar la asistencia' });
    }
    res.json({ id: this.lastID, student_id, class_id, present, comments });
  });
});

// Ruta para obtener reporte de asistencia por estudiante
app.get('/api/students/:studentId/attendance', authenticateToken, (req, res) => {
  const { studentId } = req.params;

  db.all(`
    SELECT a.*, c.week_number, c.title as class_title
    FROM attendance a
    JOIN classes c ON a.class_id = c.id
    WHERE a.student_id = ?
    ORDER BY c.week_number
  `, [studentId], (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(attendance);
  });
});

// Ruta para obtener reporte general de un curso
app.get('/api/courses/:courseId/report', authenticateToken, (req, res) => {
  const { courseId } = req.params;

  db.all(`
    SELECT 
      s.id as student_id,
      s.name as student_name,
      g.name as group_name,
      COUNT(a.id) as total_classes,
      SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) as present_count,
      ROUND(CAST(SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(a.id) * 100, 2) as attendance_percentage
    FROM students s
    JOIN groups g ON s.group_id = g.id
    LEFT JOIN attendance a ON s.id = a.student_id
    LEFT JOIN classes c ON a.class_id = c.id AND c.course_id = ?
    WHERE g.course_id = ?
    GROUP BY s.id, s.name, g.name
    ORDER BY g.name, s.name
  `, [courseId, courseId], (err, report) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(report);
  });
});

// Ruta para eliminar estudiantes
app.delete('/api/students/:studentId', authenticateToken, (req, res) => {
  const { studentId } = req.params;

  db.run('DELETE FROM students WHERE id = ?', [studentId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }
    res.json({ message: 'Estudiante eliminado correctamente' });
  });
});

// Ruta para eliminar grupos
app.delete('/api/groups/:groupId', authenticateToken, (req, res) => {
  const { groupId } = req.params;

  db.run('DELETE FROM groups WHERE id = ?', [groupId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
    res.json({ message: 'Grupo eliminado correctamente' });
  });
});

// Ruta para eliminar cursos
app.delete('/api/courses/:courseId', authenticateToken, (req, res) => {
  const { courseId } = req.params;

  db.run('DELETE FROM courses WHERE id = ?', [courseId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el curso' });
    }
    res.json({ message: 'Curso eliminado correctamente' });
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'API de Marketing Digital Platform' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}`);
}); 