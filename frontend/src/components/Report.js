import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Report = () => {
  const [report, setReport] = useState([]);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    fetchReport();
  }, [courseId]);

  const fetchReport = async () => {
    try {
      const [reportResponse, courseResponse] = await Promise.all([
        axios.get(`/api/courses/${courseId}/report`),
        axios.get(`/api/courses/${courseId}`)
      ]);
      setReport(reportResponse.data);
      setCourse(courseResponse.data);
    } catch (error) {
      setError('Error al cargar el reporte');
    }
  };

  const getOverallStats = () => {
    if (report.length === 0) return { totalStudents: 0, avgAttendance: 0, totalClasses: 0 };
    
    const totalStudents = report.length;
    const avgAttendance = report.reduce((sum, item) => sum + (item.attendance_percentage || 0), 0) / totalStudents;
    const totalClasses = report[0]?.total_classes || 0;

    return { totalStudents, avgAttendance: Math.round(avgAttendance), totalClasses };
  };

  const getChartData = () => {
    return report.map(item => ({
      name: item.student_name,
      attendance: item.attendance_percentage || 0
    }));
  };

  const getAttendanceDistribution = () => {
    const excellent = report.filter(item => (item.attendance_percentage || 0) >= 90).length;
    const good = report.filter(item => (item.attendance_percentage || 0) >= 70 && (item.attendance_percentage || 0) < 90).length;
    const fair = report.filter(item => (item.attendance_percentage || 0) >= 50 && (item.attendance_percentage || 0) < 70).length;
    const poor = report.filter(item => (item.attendance_percentage || 0) < 50).length;

    return [
      { name: 'Excelente (90%+)', value: excellent, color: '#00C49F' },
      { name: 'Bueno (70-89%)', value: good, color: '#0088FE' },
      { name: 'Regular (50-69%)', value: fair, color: '#FFBB28' },
      { name: 'Bajo (<50%)', value: poor, color: '#FF8042' }
    ];
  };

  const stats = getOverallStats();
  const chartData = getChartData();
  const distributionData = getAttendanceDistribution();

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AssessmentIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Reporte de Asistencia
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {course.name} - {stats.totalStudents} estudiantes
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Estudiantes
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Asistencia Promedio
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {stats.avgAttendance}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Clases
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalClasses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Asistencia por Estudiante
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Asistencia
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Detalle por Estudiante
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Grupo</TableCell>
                <TableCell align="center">Clases Asistidas</TableCell>
                <TableCell align="center">Total Clases</TableCell>
                <TableCell align="center">Porcentaje</TableCell>
                <TableCell align="center">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.map((row) => (
                <TableRow key={row.student_id}>
                  <TableCell>{row.student_name}</TableCell>
                  <TableCell>{row.group_name}</TableCell>
                  <TableCell align="center">{row.present_count}</TableCell>
                  <TableCell align="center">{row.total_classes}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${row.attendance_percentage || 0}%`}
                      color={
                        (row.attendance_percentage || 0) >= 90 ? "success" :
                        (row.attendance_percentage || 0) >= 70 ? "primary" :
                        (row.attendance_percentage || 0) >= 50 ? "warning" : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(row.attendance_percentage || 0) >= 90 ? (
                      <Chip label="Excelente" color="success" size="small" />
                    ) : (row.attendance_percentage || 0) >= 70 ? (
                      <Chip label="Bueno" color="primary" size="small" />
                    ) : (row.attendance_percentage || 0) >= 50 ? (
                      <Chip label="Regular" color="warning" size="small" />
                    ) : (
                      <Chip label="Bajo" color="error" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Report; 