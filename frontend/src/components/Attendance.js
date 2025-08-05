import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Attendance = () => {
  const [classInfo, setClassInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    fetchAttendance();
  }, [classId]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`/api/classes/${classId}/attendance`);
      setAttendance(response.data);
    } catch (error) {
      setError('Error al cargar la asistencia');
    }
  };

  const handleAttendanceChange = (studentId, present) => {
    setAttendance(prev => 
      prev.map(item => 
        item.student_id === studentId 
          ? { ...item, present: present ? 1 : 0 }
          : item
      )
    );
  };

  const handleCommentsChange = (studentId, comments) => {
    setAttendance(prev => 
      prev.map(item => 
        item.student_id === studentId 
          ? { ...item, comments }
          : item
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const promises = attendance.map(item =>
        axios.post('/api/attendance', {
          student_id: item.student_id,
          class_id: classId,
          present: item.present === 1,
          comments: item.comments || ''
        })
      );

      await Promise.all(promises);
      setSuccess('Asistencia guardada correctamente');
    } catch (error) {
      setError('Error al guardar la asistencia');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(item => item.present === 1).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  if (!attendance.length) {
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
        <Typography color="text.primary">
          Asistencia - Clase {attendance[0]?.class_title || classId}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Control de Asistencia
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Clase: {attendance[0]?.class_title || `Clase ${classId}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Asistencia'}
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={`Total: ${stats.total}`}
          color="primary"
          variant="outlined"
        />
        <Chip 
          label={`Presentes: ${stats.present}`}
          color="success"
          icon={<CheckCircleIcon />}
        />
        <Chip 
          label={`Ausentes: ${stats.absent}`}
          color="error"
          icon={<CancelIcon />}
        />
        <Chip 
          label={`Asistencia: ${stats.percentage}%`}
          color={stats.percentage >= 80 ? "success" : stats.percentage >= 60 ? "warning" : "error"}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell align="center">Asistencia</TableCell>
              <TableCell>Comentarios</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((item) => (
              <TableRow key={item.student_id}>
                <TableCell>
                  <Typography variant="body1">
                    {item.student_name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={item.present === 1}
                    onChange={(e) => handleAttendanceChange(item.student_id, e.target.checked)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Comentarios sobre el desempeño..."
                    value={item.comments || ''}
                    onChange={(e) => handleCommentsChange(item.student_id, e.target.value)}
                    multiline
                    rows={2}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance; 