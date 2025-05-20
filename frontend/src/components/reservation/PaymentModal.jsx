// src/components/reservation/PaymentModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useReservation } from '../../contexts/ReservationContext';
import QRCode from './QRCode';
import { formatReadableDate } from '../../utils/dateUtils';
import { parseDateWithoutTimezone } from '../../utils/dateUtils'; 

const PaymentModal = ({ open, onClose, cinema, selectedSeats, selectedDate, totalPrice }) => {
  const navigate = useNavigate();
  const { createReservation, qrCode } = useReservation();
  
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success'
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async () => {
    // Simple validation
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      setError('Todos los campos son requeridos');
      return;
    }
    
    // Validate card number (should be 16 digits)
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      setError('El número de tarjeta debe tener 16 dígitos');
      return;
    }
    
    // Validate CVV (should be 3 digits)
    if (!/^\d{3}$/.test(formData.cvv)) {
      setError('El CVV debe tener 3 dígitos');
      return;
    }
    
    try {
      setError('');
      setPaymentStep('processing');
      
      console.log(`Creando reservación para cine ${cinema.id} en fecha ${selectedDate}`);
      console.log('Asientos seleccionados:', selectedSeats);
      
      // Simular el retraso del procesamiento del pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crear reservación
      await createReservation(cinema.id, selectedDate);
      
      // Mostrar éxito
      setPaymentStep('success');
    } catch (error) {
      console.error('Error en el pago:', error);
      setError(error.message || 'Error al procesar el pago');
      setPaymentStep('form');
    }
  };
  
  const handleClose = () => {
    if (paymentStep === 'success') {
      // Resetear formulario y cerrar
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
      });
      setPaymentStep('form');
      onClose();
      navigate('/');
    } else {
      onClose();
    }
  };
  
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  
  return (
    <Dialog
      open={open}
      onClose={paymentStep !== 'processing' ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {paymentStep === 'success' ? '¡Reservación Completada!' : 'Completa tu Reservación'}
      </DialogTitle>
      
      <DialogContent>
        {paymentStep === 'form' && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Reservación
              </Typography>
              <Typography variant="body1">
                Película: {cinema?.movie_title || ''}
              </Typography>
              <Typography variant="body1">
                Cine: {cinema?.name || ''}
              </Typography>
              <Typography variant="body1">
                Fecha: {selectedDate ? formatReadableDate(parseDateWithoutTimezone(selectedDate)) : ''}
              </Typography>
              <Typography variant="body1">
                Asientos: {selectedSeats.map(seat => `${seat.seat_row}-${seat.seat_column}`).join(', ')}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: Q{totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Detalles de Pago
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Número de Tarjeta"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nombre del Titular"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Juan Pérez"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Mes</InputLabel>
                  <Select
                    label="Mes"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                  >
                    {months.map(month => (
                      <MenuItem key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Año</InputLabel>
                  <Select
                    label="Año"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  fullWidth
                  type="password"
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
            </Grid>
          </>
        )}
        
        {paymentStep === 'processing' && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" flexDirection="column">
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">
              Procesando tu pago...
            </Typography>
          </Box>
        )}
        
        {paymentStep === 'success' && qrCode && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="success.main">
              ¡Tu reservación fue exitosa!
            </Typography>
            
            <QRCode qrCode={qrCode} />
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              Tus entradas han sido reservadas para <strong>{formatReadableDate(parseDateWithoutTimezone(selectedDate))}</strong>. 
              Por favor, muestra el código QR en la entrada del cine.
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Puedes descargar el código QR para tus registros.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        {paymentStep === 'form' && (
          <>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Pagar Q{totalPrice.toFixed(2)}
            </Button>
          </>
        )}
        
        {paymentStep === 'success' && (
          <Button onClick={handleClose} variant="contained">
            Finalizar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;