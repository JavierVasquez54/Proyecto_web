import api from '../utils/api';

const authService = {
  // Login
  login: async (username, password) => {
    try {
      return await api.post('/auth/login', { username, password });
    } catch (error) {
      throw error;
    }
  },
  
  // Register
  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      throw error;
    }
  }
};

export default authService;