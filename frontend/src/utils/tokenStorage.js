export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Get token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove token
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if token exists
  export const hasToken = () => {
    return !!getToken();
  };