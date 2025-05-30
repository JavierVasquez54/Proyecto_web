import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CinemaList from './components/cinema/CinemaList';
import SeatSelection from './components/cinema/SeatSelection';
import CreateCinema from './components/admin/CreateCinema';
import EditCinema from './components/admin/EditCinema';
import UserManagement from './components/admin/UserManagement';
import UserReservations from './components/reservation/UserReservations';
import ManageCinemas from './components/admin/ManageCinemas';
import ActivityReport from './components/admin/ActivityReport';

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Navbar />
      <Container component="main" sx={{ py: 4, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<CinemaList />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected routes */}
          <Route 
            path="/cinema/:id/seats" 
            element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reservations" 
            element={
              <ProtectedRoute>
                <UserReservations />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/cinemas/create" 
            element={
              <ProtectedRoute roles={['admin']}>
                <CreateCinema />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cinemas" 
            element={
              <ProtectedRoute roles={['admin']}>
                <ManageCinemas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cinemas/:id/edit" 
            element={
              <ProtectedRoute roles={['admin']}>
                <EditCinema />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/report" 
            element={
              <ProtectedRoute roles={['admin']}>
                <ActivityReport />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;