import React, { createContext, useContext, useState, useCallback } from 'react';
import reservationService from '../services/reservation.service';

// Create context
const ReservationContext = createContext();

export const useReservation = () => {
  return useContext(ReservationContext);
};

export const ReservationProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [currentCinema, setCurrentCinema] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Toggle seat selection
  const toggleSeatSelection = useCallback((seat_row, seat_column) => {
    setSelectedSeats(prevSeats => {
      const seatIndex = prevSeats.findIndex(
        (seat) => seat.seat_row === seat_row && seat.seat_column === seat_column
      );

      if (seatIndex === -1) {
        // Seat is not selected, add it
        return [...prevSeats, { seat_row, seat_column }];
      } else {
        // Seat is already selected, remove it
        return prevSeats.filter((_, index) => index !== seatIndex);
      }
    });
  }, []);

  // Check if a seat is selected
  const isSeatSelected = useCallback((seat_row, seat_column) => {
    return selectedSeats.some(
      (seat) => seat.seat_row === seat_row && seat.seat_column === seat_column
    );
  }, [selectedSeats]);

  // Check if a seat is reserved
  const isSeatReserved = useCallback((seat_row, seat_column) => {
    return reservedSeats.some(
      (seat) => seat.seat_row === seat_row && seat.seat_column === seat_column
    );
  }, [reservedSeats]);

  // Get reserved seats for a cinema and date
  const getReservedSeats = useCallback(async (cinemaId, date) => {
    try {
      const response = await reservationService.getCinemaReservationsByDate(cinemaId, date);
      const seatMap = response.data.seat_map;
      
      // Convert seatMap to array of reserved seats
      const reservedSeatsArray = [];
      for (let r = 0; r < seatMap.length; r++) {
        for (let c = 0; c < seatMap[r].length; c++) {
          if (seatMap[r][c]) {
            reservedSeatsArray.push({ seat_row: r + 1, seat_column: c + 1 });
          }
        }
      }
      
      setReservedSeats(reservedSeatsArray);
      return reservedSeatsArray;
    } catch (error) {
      console.error('Error fetching reserved seats:', error);
      return [];
    }
  }, []);

  // Create a reservation
 // En ReservationContext.jsx
const createReservation = async (cinemaId, date) => {
  if (selectedSeats.length === 0 || !date) {
    throw new Error('Por favor, selecciona asientos y una fecha para tu reservación');
  }

  console.log(`Creando reservación para cine ID ${cinemaId} en fecha ${date}`);
  console.log('Asientos seleccionados:', selectedSeats);

  try {
    const response = await reservationService.createReservation({
      cinema_id: cinemaId,
      seat_selections: selectedSeats,
      reservation_date: date
    });
    
    // Almacenar el código QR
    setQrCode(response.data.qr_code);
    
    // Limpiar selecciones
    setSelectedSeats([]);
    
    return response;
  } catch (error) {
    console.error('Error al crear la reservación:', error);
    throw error;
  }
};

  // Clear current reservation state
  const clearReservation = useCallback(() => {
    setSelectedSeats([]);
    setSelectedDate(null);
    setReservedSeats([]);
    setCurrentCinema(null);
    setQrCode(null);
  }, []);

  const value = {
    selectedSeats,
    selectedDate,
    reservedSeats,
    currentCinema,
    qrCode,
    setSelectedSeats,
    setSelectedDate,
    setReservedSeats,
    setCurrentCinema,
    setQrCode,
    toggleSeatSelection,
    isSeatSelected,
    isSeatReserved,
    getReservedSeats,
    createReservation,
    clearReservation
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};