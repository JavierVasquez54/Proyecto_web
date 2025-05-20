// src/components/reservation/UserReservations.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Divider, 
  Button, 
  CircularProgress, 
  Alert,
  Snackbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Event as EventIcon } from '@mui/icons-material';
import reservationService from '../../services/reservation.service';

const UserReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reservationService.getUserReservations();
      console.log('Reservaciones obtenidas:', response);
      
      if (response && response.data) {
        setReservations(response.data);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Error al obtener reservaciones:', error);
      setError(error.message || 'Error al obtener tus reservaciones');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReservations();
  }, []);
  
  const handleCancelReservation = async (seatId) => {
    if (!seatId) {
      setError('No se pudo cancelar la reservación: ID no válido');
      return;
    }
    
    try {
      console.log(`Cancelando reservación para el asiento con ID: ${seatId}`);
      setError('');
      setSuccess('');
      
      await reservationService.cancelReservation(seatId);
      
      // Mostrar mensaje de éxito
      setSuccess('Reservación cancelada exitosamente');
      
      // Actualizar la lista de reservaciones
      fetchReservations();
    } catch (error) {
      console.error('Error al cancelar reservación:', error);
      setError(error.message || 'No se pudo cancelar la reservación');
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Reservaciones
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {reservations.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tienes reservaciones todavía
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Ver Películas
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reservations.map((reservation, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {reservation.movie_title || 'Película no especificada'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {reservation.cinema_name || 'Sala no especificada'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {new Date(reservation.reservation_date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" gutterBottom>
                    Asientos:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {reservation.seats && reservation.seats.map((seat) => (
                      <Chip 
                        key={`seat-${seat.row}-${seat.column}`}
                        label={`Fila ${seat.seat_row}, Columna ${seat.seat_column}`}
                        size="small"
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => {
                        // Verificar si hay seats y si el primer seat tiene un ID
                        if (reservation.seats && reservation.seats.length > 0) {
                          // Cancelar por el ID del asiento en lugar del ID de la reservación
                          const seatToCancel = reservation.seats[0];
                          console.log("Intentando cancelar asiento:", seatToCancel);
                          if (seatToCancel && seatToCancel.id) {
                            handleCancelReservation(seatToCancel.id);
                          } else {
                            setError("No se pudo encontrar el ID del asiento para cancelar");
                          }
                        } else {
                          setError("No hay asientos para cancelar en esta reservación");
                        }
                      }}
                    >
                      Cancelar Reservación
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserReservations;