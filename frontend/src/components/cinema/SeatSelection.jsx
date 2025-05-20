// src/components/cinema/SeatSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useReservation } from '../../contexts/ReservationContext';
import cinemaService from '../../services/cinema.service';
import SeatGrid from '../ui/SeatGrid';
import DateSelector from '../ui/DateSelector';
import PaymentModal from '../reservation/PaymentModal';
import { getNext8Days } from '../../utils/dateUtils';

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    selectedSeats,
    selectedDate,
    setSelectedDate,
    getReservedSeats,
    setCurrentCinema, 
    clearReservation
  } = useReservation();
  
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Set default selected date to today
  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = getNext8Days()[0].formattedDate;
    console.log("Fecha inicial seleccionada:", today);
    setSelectedDate(today);
    
    // Clean up reservation state when component unmounts
    return () => {
      clearReservation();
    };
  }, [clearReservation, setSelectedDate]);
  
// En SeatSelection.jsx, dentro del useEffect
useEffect(() => {
  // Obtener la fecha de mañana en formato YYYY-MM-DD
  const tomorrow = getNext8Days(1)[0].formattedDate;
  console.log("Fecha inicial seleccionada:", tomorrow);
  setSelectedDate(tomorrow);
  
  // Clean up reservation state when component unmounts
  return () => {
    clearReservation();
  };
}, [clearReservation, setSelectedDate]);

  // Fetch cinema details
  useEffect(() => {
    const fetchCinema = async () => {
      try {
        setLoading(true);
        const response = await cinemaService.getCinemaById(id);
        setCinema(response.data);
        setCurrentCinema(response.data);
      } catch (error) {
        setError(error.message || "Error al cargar la información del cine");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCinema();
  }, [id, setCurrentCinema]);
  
  // Fetch reserved seats when date changes
  useEffect(() => {
    if (cinema && selectedDate) {
      console.log(`Obteniendo asientos reservados para cine ${cinema.id} en fecha ${selectedDate}`);
      const fetchReservedSeats = async () => {
        try {
          await getReservedSeats(cinema.id, selectedDate);
        } catch (error) {
          console.error("Error al obtener asientos reservados:", error);
          setError("No se pudieron cargar los asientos reservados. Por favor, intenta de nuevo.");
        }
      };
      
      fetchReservedSeats();
    }
  }, [cinema, selectedDate]);
  
  const handleDateChange = (date) => {
    console.log("Cambiando fecha a:", date);
    setSelectedDate(date);
    setError(''); // Limpiar errores previos
  };
  
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Por favor, selecciona al menos un asiento');
      return;
    }
    
    setPaymentModalOpen(true);
  };
  
  // Manejador para errores de imagen
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x600?text=Pelicula';
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Volver a Películas
        </Button>
      </Container>
    );
  }
  
  if (!cinema) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Cine no encontrado
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver a Películas
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')} 
        sx={{ mt: 2, mb: 2 }}
      >
        Volver a Películas
      </Button>
      
      <Grid container spacing={4}>
        {/* Movie Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={cinema.movie_poster}
              alt={cinema.movie_title}
              sx={{ height: 400, objectFit: 'cover' }}
              onError={handleImageError}
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {cinema.movie_title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Cine: {cinema.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <DateSelector 
                selectedDate={selectedDate} 
                onDateChange={handleDateChange} 
              />
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2">
                  Asientos seleccionados: {selectedSeats.length}
                </Typography>
                <Typography variant="body2">
                  Precio total: ${selectedSeats.length * 10}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={selectedSeats.length === 0}
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleProceedToPayment}
                >
                  Proceder al Pago
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Seat Grid */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Selecciona tus Asientos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Haz clic en los asientos que deseas reservar. Puedes seleccionar varios asientos.
            </Typography>
            
            <SeatGrid seat_rows={cinema.seat_rows} columns={cinema.seat_columns} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cinema={cinema}
        selectedSeats={selectedSeats}
        selectedDate={selectedDate}
        totalPrice={selectedSeats.length * 10}
      />
    </Container>
  );
};

export default SeatSelection;