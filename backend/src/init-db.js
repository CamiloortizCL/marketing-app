const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Crear tablas
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla de usuarios (profesores)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de cursos
      db.run(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          user_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Tabla de grupos
      db.run(`
        CREATE TABLE IF NOT EXISTS groups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          course_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id)
        )
      `);

      // Tabla de estudiantes
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          group_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (group_id) REFERENCES groups (id)
        )
      `);

      // Tabla de clases (18 clases por curso)
      db.run(`
        CREATE TABLE IF NOT EXISTS classes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          week_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          course_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id)
        )
      `);

      // Tabla de asistencia
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          class_id INTEGER NOT NULL,
          present BOOLEAN DEFAULT 0,
          comments TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students (id),
          FOREIGN KEY (class_id) REFERENCES classes (id),
          UNIQUE(student_id, class_id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

// Crear usuario administrador por defecto
const createDefaultUser = () => {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (username, password, name, email)
      VALUES (?, ?, ?, ?)
    `, ['admin', hashedPassword, 'Administrador', 'admin@marketing.com'], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Crear clases por defecto para un curso
const createDefaultClasses = (courseId) => {
  return new Promise((resolve, reject) => {
    const classes = [];
    for (let i = 1; i <= 18; i++) {
      classes.push([i, `Clase ${i}`, courseId]);
    }
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO classes (week_number, title, course_id)
      VALUES (?, ?, ?)
    `);
    
    classes.forEach(([week, title, courseId]) => {
      stmt.run(week, title, courseId);
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Función principal
const initDatabase = async () => {
  try {
    console.log('Inicializando base de datos...');
    await createTables();
    console.log('Tablas creadas exitosamente');
    
    await createDefaultUser();
    console.log('Usuario administrador creado:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    console.log('Base de datos inicializada correctamente');
    db.close();
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    db.close();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase, createDefaultClasses }; 