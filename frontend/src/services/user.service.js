import api from '../utils/api';

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      return await api.get('/users');
    } catch (error) {
      throw error;
    }
  },
  
  // Toggle user status (admin only)
  toggleUserStatus: async (id, active) => {
    try {
      return await api.patch(`/users/${id}/status`, { active });
    } catch (error) {
      throw error;
    }
  }
};

export default userService;