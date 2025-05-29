// frontend/src/components/admin/ActivityReport.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  AttachMoney as MoneyIcon,
  EventSeat as SeatIcon,
  TrendingUp as TrendIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/report.service';

const ActivityReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await reportService.getActivityReport();
        console.log('Report data:', response);
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error.message || 'Error al obtener el reporte');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleDownloadPDF = () => {
    // Esta función generará un PDF del reporte
    console.log('Generating PDF report...');
    // Aquí implementarías la lógica para generar y descargar el PDF
    alert('Funcionalidad de descarga PDF en desarrollo');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Volver al Inicio
        </Button>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No se pudo cargar el reporte
        </Alert>
      </Container>
    );
  }

  const { summary, daily_reports, cinemas_info } = reportData;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Reporte de Actividad
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análisis de los próximos 8 días
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          sx={{ height: 'fit-content' }}
        >
          Descargar PDF
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SeatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Butacas Reservadas</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {summary.total_reserved_seats_8_days}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Próximos 8 días
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Ingresos Totales</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ${summary.total_revenue_8_days}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Próximos 8 días
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Ingresos Perdidos</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                ${summary.total_potential_lost_revenue_8_days}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Butacas vacías
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReportIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Promedio Diario</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                ${summary.average_daily_revenue}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ingresos por día
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Report Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reporte Diario Detallado
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell align="center"><strong>Butacas Reservadas</strong></TableCell>
                  <TableCell align="center"><strong>Butacas Vacías</strong></TableCell>
                  <TableCell align="center"><strong>Ingresos</strong></TableCell>
                  <TableCell align="center"><strong>Ingresos Perdidos</strong></TableCell>
                  <TableCell align="center"><strong>% Ocupación</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {daily_reports.map((report, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {report.readable_date}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="primary">{report.reserved_seats}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="text.secondary">{report.empty_seats}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="success.main">${report.daily_revenue}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="warning.main">${report.potential_lost_revenue}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        color={parseFloat(report.occupancy_rate) > 50 ? "success.main" : "warning.main"}
                      >
                        {report.occupancy_rate}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Cinema Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Información de Salas
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {cinemas_info.map((cinema) => (
            <Grid item xs={12} sm={6} md={4} key={cinema.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cinema.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {cinema.movie_title}
                  </Typography>
                  <Typography variant="body2">
                    Capacidad: <strong>{cinema.total_seats} asientos</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Back Button */}
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default ActivityReport;