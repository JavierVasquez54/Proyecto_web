import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  CircularProgress, 
  Box, 
  Alert 
} from '@mui/material';
import cinemaService from '../../services/cinema.service';
import CinemaCard from './CinemaCard';

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        const response = await cinemaService.getAllCinemas();
        setCinemas(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCinemas();
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (cinemas.length === 0) {
    return (
      <Container>
        <Box textAlign="center" mt={8}>
          <Typography variant="h5" gutterBottom>
          No hay cines disponibles en este momento
          </Typography>
          <Typography variant="body1" color="text.secondary">
          Vuelva a consultar más tarde o comuníquese con la administración.
          </Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom mt={4}>
      Películas disponibles
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {cinemas.map((cinema) => (
          <Grid item key={cinema.id} xs={12} sm={6} md={4}>
            <CinemaCard cinema={cinema} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CinemaList;