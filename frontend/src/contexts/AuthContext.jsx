import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/auth.service';

// Create context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from token in local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token is expired, logout
          logout();
        } else {
          // Token is valid
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const { token, ...userData } = response.data;
      
      // Store token in local storage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, ...user } = response.data;
      
      // Store token in local storage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};