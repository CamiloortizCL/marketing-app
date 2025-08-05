import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      setError('Error al cargar los cursos');
    }
  };

  const handleCreateCourse = async () => {
    try {
      const response = await axios.post('/api/courses', newCourse);
      setCourses([response.data, ...courses]);
      setNewCourse({ name: '', description: '' });
      setOpenDialog(false);
    } catch (error) {
      setError('Error al crear el curso');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        setError('Error al eliminar el curso');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Marketing Digital Platform
        </Typography>
        <IconButton onClick={handleLogout} color="inherit">
          <LogoutIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Create Course Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Crear Nuevo Curso
        </Button>
      </Box>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {course.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description || 'Sin descripción'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Creado: {new Date(course.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/course/${course.id}`)}
                  startIcon={<PeopleIcon />}
                >
                  Gestionar Grupos
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate(`/report/${course.id}`)}
                  startIcon={<AssessmentIcon />}
                >
                  Ver Reporte
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Course Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Curso</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Curso"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateCourse} 
            variant="contained"
            disabled={!newCourse.name.trim()}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 