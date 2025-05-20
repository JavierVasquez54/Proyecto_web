// frontend/src/components/ui/SeatGrid.jsx
import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useReservation } from '../../contexts/ReservationContext';

// Styled components
const SeatButton = styled(Button)(({ theme, status }) => ({
  minWidth: 40,
  minHeight: 40,
  margin: 4,
  borderRadius: 4,
  backgroundColor: 
    status === 'reserved' 
      ? theme.palette.seat.reserved 
      : status === 'selected' 
        ? theme.palette.seat.selected 
        : theme.palette.seat.available,
  '&:hover': {
    backgroundColor: 
      status === 'reserved' 
        ? theme.palette.seat.reserved 
        : status === 'selected' 
          ? theme.palette.seat.selected 
          : theme.palette.primary.light,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.seat.reserved,
  },
}));

const Screen = styled(Paper)(({ theme }) => ({
  height: 20,
  backgroundColor: theme.palette.grey[800],  // Cambiado para mayor compatibilidad
  borderRadius: '50%',
  margin: '0 auto 30px auto',
  width: '80%',
  marginBottom: 30,
}));

const Legend = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: 16,
  marginTop: 24,
  marginBottom: 16,
  '& .legend-item': {
    display: 'flex',
    alignItems: 'center',
    '& .color-box': {
      width: 20,
      height: 20,
      borderRadius: 4,
      marginRight: 8,
    },
  },
}));

const SeatGrid = ({ seat_rows, seat_columns }) => {
  const { 
    reservedSeats, 
    selectedSeats, 
    toggleSeatSelection, 
    isSeatSelected, 
    isSeatReserved 
  } = useReservation();

  const handleSeatClick = (seat_row, seat_column) => {
    // Don't allow selection of reserved seats
    if (isSeatReserved(seat_row, seat_column)) return;
    
    toggleSeatSelection(seat_row, seat_column);
  };

  // Generate seat grid
  const renderSeats = () => {
    const seatsGrid = [];
    
    // Asegurémonos de que rows y columns son números
    const numRows = parseInt(seat_rows, 10) || 8;  // Valor por defecto si no es válido
    const numCols = parseInt(seat_columns, 10) || 10; // Valor por defecto si no es válido
    
    console.log(`Renderizando grid de ${numRows} filas x ${numCols} columnas`);
    
    for (let seat_row = 1; seat_row <= numRows; seat_row++) {
      const rowSeats = [];
      
      for (let col = 1; col <= numCols; col++) {
        const isReserved = isSeatReserved(seat_row, col);
        const isSelected = isSeatSelected(seat_row, col);
        
        rowSeats.push(
          <Grid item key={`seat-${seat_row}-${col}`}>
            <SeatButton
              variant="contained"
              disabled={isReserved}
              status={isReserved ? 'reserved' : isSelected ? 'selected' : 'available'}
              onClick={() => handleSeatClick(seat_row, col)}
            >
              {`${seat_row}-${col}`}
            </SeatButton>
          </Grid>
        );
      }
      
      seatsGrid.push(
        <Grid 
          container 
          item 
          key={`seat_row-${seat_row}`} 
          justifyContent="center"
          spacing={1}
        >
          {rowSeats}
        </Grid>
      );
    }
    
    return seatsGrid;
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Selecciona tus asientos
      </Typography>
      
      <Box sx={{ overflow: 'auto', maxWidth: '100%' }}>
        <Screen>
          <Typography variant="caption" color="white" align="center" component="div" sx={{ pt: 0.5 }}>
            Pantalla
          </Typography>
        </Screen>
        
        <Grid container direction="column" spacing={1}>
          {renderSeats()}
        </Grid>
      </Box>
      
      <Legend>
        <Box className="legend-item">
          <Box className="color-box" sx={{ bgcolor: 'primary.light' }} />
          <Typography variant="body2">Disponibles</Typography>
        </Box>
        <Box className="legend-item">
          <Box className="color-box" sx={{ bgcolor: 'secondary.light' }} />
          <Typography variant="body2">Seleccionados</Typography>
        </Box>
        <Box className="legend-item">
          <Box className="color-box" sx={{ bgcolor: 'grey.500' }} />
          <Typography variant="body2">Reservados</Typography>
        </Box>
      </Legend>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" align="center">
            Asientos seleccionados: {selectedSeats.length > 0 
            ? selectedSeats.map(seat => `${seat.seat_row}-${seat.seat_column}`).join(', ') 
            : 'Ninguno'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SeatGrid;