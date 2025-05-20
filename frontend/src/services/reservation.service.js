// frontend/src/services/reservation.service.js
import api from '../utils/api';

const reservationService = {
  // Create reservation
  createReservation: async (reservationData) => {
    try {
      console.log('Creating reservation with data:', reservationData);
      return await api.post('/reservations', reservationData);
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  // Get user reservations
  getUserReservations: async () => {
    try {
      console.log('Fetching user reservations');
      return await api.get('/reservations/me');
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },
  
  // Cancel reservation
  cancelReservation: async (id) => {
    try {
      console.log('Cancelling reservation:', id);
      return await api.delete(`/reservations/${id}`);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  },
  
  // Get cinema reservations by date
  getCinemaReservationsByDate: async (cinemaId, date) => {
    try {
      console.log(`Fetching reservations for cinema ${cinemaId} on ${date}`);
      return await api.get(`/cinemas/${cinemaId}/reservations`, {
        params: { date }
      });
    } catch (error) {
      console.error('Error fetching cinema reservations:', error);
      throw error;
    }
  }
};

export default reservationService;