// src/components/admin/ManageCinemas.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import cinemaService from '../../services/cinema.service';

const ManageCinemas = () => {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        const response = await cinemaService.getAllCinemas();
        setCinemas(response.data || []);
      } catch (error) {
        setError(error.message || 'Error al obtener las salas de cine');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCinemas();
  }, []);
  
  const handleEditCinema = (id) => {
    navigate(`/admin/cinemas/${id}/edit`);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Administrar Salas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/cinemas/create')}
        >
          Crear Sala
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cinemas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron salas de cine
                </TableCell>
              </TableRow>
            ) : (
              cinemas.map((cinema) => (
                <TableRow key={cinema.id}>
                  <TableCell>{cinema.id}</TableCell>
                  <TableCell>{cinema.name}</TableCell>
                  <TableCell>{cinema.movie_title}</TableCell>
                  <TableCell>{`${cinema.rows} × ${cinema.columns} (${cinema.rows * cinema.columns} asientos)`}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditCinema(cinema.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageCinemas;