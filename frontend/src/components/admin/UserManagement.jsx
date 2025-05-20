import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';

const UserManagement = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processingToggle, setProcessingToggle] = useState(false);
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleToggleDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };
  
  const handleStatusToggle = async () => {
    if (!selectedUser) return;
    
    try {
      setProcessingToggle(true);
      
      // Call API to toggle user status
      await userService.toggleUserStatus(selectedUser.id, !selectedUser.active);
      
      // Update user in state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, active: !user.active };
        }
        return user;
      }));
      
      setSuccess(`Usuario ${selectedUser.username} ha sido ${!selectedUser.active ? 'activado' : 'desactivado'}`);
      
      // Close dialog
      handleDialogClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessingToggle(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
      Gestión de usuarios
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estatus</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                  No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        label={user.role}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.active ? <CheckCircleIcon /> : <BlockIcon />}
                        label={user.active ? 'Active' : 'Disabled'}
                        color={user.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.role !== 'admin' && (
                        <IconButton
                          color={user.active ? 'error' : 'success'}
                          onClick={() => handleToggleDialog(user)}
                        >
                          {user.active ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
        >
          Volver a Películas
        </Button>
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>
          {selectedUser?.active ? 'Deshabilitar cuenta de usuario' : 'Habilitar cuenta de usuario'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser?.active
              ? `¿Seguro que desea desactivar la cuenta de ${selectedUser?.username}? Ya no podrá iniciar sesión ni hacer reservas.`
              : `¿Seguro que desea habilitar la cuenta de ${selectedUser?.username}? Podrá iniciar sesión y hacer reservas de nuevo..`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={processingToggle}>
            Cancelar
          </Button>
          <Button 
            onClick={handleStatusToggle} 
            color={selectedUser?.active ? 'error' : 'success'} 
            autoFocus
            disabled={processingToggle}
            startIcon={processingToggle && <CircularProgress size={20} />}
          >
            {processingToggle
              ? 'Processing...'
              : selectedUser?.active
                ? 'Deshabilitar cuenta'
                : 'Habilitar cuenta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;