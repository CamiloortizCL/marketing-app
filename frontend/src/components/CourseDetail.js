import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Alert,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    fetchCourseAndGroups();
  }, [courseId]);

  const fetchCourseAndGroups = async () => {
    try {
      const [courseResponse, groupsResponse] = await Promise.all([
        axios.get(`/api/courses/${courseId}`),
        axios.get(`/api/courses/${courseId}/groups`)
      ]);
      setCourse(courseResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      setError('Error al cargar la información del curso');
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/groups`, newGroup);
      setGroups([response.data, ...groups]);
      setNewGroup({ name: '' });
      setOpenDialog(false);
    } catch (error) {
      setError('Error al crear el grupo');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      try {
        await axios.delete(`/api/groups/${groupId}`);
        setGroups(groups.filter(group => group.id !== groupId));
      } catch (error) {
        setError('Error al eliminar el grupo');
      }
    }
  };

  if (!course) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          Cursos
        </Link>
        <Typography color="text.primary">{course.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {course.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {course.description || 'Sin descripción'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Crear Grupo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Groups Grid */}
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {group.name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`${group.student_count || 0} estudiantes`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Creado: {new Date(group.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/group/${group.id}`)}
                  startIcon={<AssignmentIcon />}
                >
                  Gestionar Estudiantes
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {groups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay grupos creados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea el primer grupo para comenzar a agregar estudiantes
          </Typography>
        </Box>
      )}

      {/* Create Group Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Grupo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Grupo"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            margin="normal"
            required
            placeholder="Ej: Grupo A, Equipo 1, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={!newGroup.name.trim()}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail; 