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
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GroupDetail = () => {
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    fetchGroupAndStudents();
  }, [groupId]);

  const fetchGroupAndStudents = async () => {
    try {
      const [groupResponse, studentsResponse] = await Promise.all([
        axios.get(`/api/groups/${groupId}`),
        axios.get(`/api/groups/${groupId}/students`)
      ]);
      setGroup(groupResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      setError('Error al cargar la información del grupo');
    }
  };

  const handleCreateStudent = async () => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/students`, newStudent);
      setStudents([response.data, ...students]);
      setNewStudent({ name: '', email: '' });
      setOpenDialog(false);
    } catch (error) {
      setError('Error al crear el estudiante');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        await axios.delete(`/api/students/${studentId}`);
        setStudents(students.filter(student => student.id !== studentId));
      } catch (error) {
        setError('Error al eliminar el estudiante');
      }
    }
  };

  if (!group) {
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
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/course/${group.course_id}`)}
        >
          {group.course_name || 'Curso'}
        </Link>
        <Typography color="text.primary">{group.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {group.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {students.length} estudiantes registrados
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Agregar Estudiante
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {student.name}
                  </Box>
                </TableCell>
                <TableCell>{student.email || 'No especificado'}</TableCell>
                <TableCell>
                  {new Date(student.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteStudent(student.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {students.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay estudiantes registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega el primer estudiante para comenzar
          </Typography>
        </Box>
      )}

      {/* Create Student Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Estudiante</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            margin="normal"
            required
            placeholder="Ej: Juan Pérez"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            margin="normal"
            placeholder="juan.perez@email.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateStudent} 
            variant="contained"
            disabled={!newStudent.name.trim()}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetail; 