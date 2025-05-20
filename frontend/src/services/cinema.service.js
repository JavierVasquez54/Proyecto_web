import api from '../utils/api';

const cinemaService = {
  // Get all cinemas
  getAllCinemas: async () => {
    try {
      return await api.get('/cinemas');
    } catch (error) {
      throw error;
    }
  },
  
  // Get cinema by ID
  getCinemaById: async (id) => {
    try {
      return await api.get(`/cinemas/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get cinema reservations by date
  getCinemaReservationsByDate: async (id, date) => {
    try {
      return await api.get(`/cinemas/${id}/reservations`, {
        params: { date }
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Create cinema (admin only)
  createCinema: async (cinemaData) => {
    try {
      console.log('Creating cinema with data:', cinemaData);
      const response = await api.post('/cinemas', cinemaData);
      console.log('Cinema created:', response);
      return response;
    } catch (error) {
      console.error('Error in createCinema service:', error);
      throw error;
    }
  },
  
  // Update cinema movie (admin only)
  updateCinemaMovie: async (id, movieData) => {
    try {
      return await api.patch(`/cinemas/${id}/movie`, movieData);
    } catch (error) {
      throw error;
    }
  },
  
  // Update cinema capacity (admin only)
  updateCinemaCapacity: async (id, capacityData) => {
    try {
      return await api.patch(`/cinemas/${id}/capacity`, capacityData);
    } catch (error) {
      throw error;
    }
  }
};

export default cinemaService;