import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Divider,
  InputAdornment,
  CircularProgress, 
} from '@mui/material';
import { 
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  Image as ImageIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import cinemaService from '../../services/cinema.service';

const CreateCinema = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    movie_title: '',
    movie_poster: '',
    seat_rows: 8,
    seat_columns: 10,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que rows y columns sean números positivos
    if (name === 'Filas' || name === 'columnas') {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
        return; // No actualizar si no es un número válido
      }
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!formData.name || !formData.movie_title || !formData.movie_poster) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (formData.seat_rows < 1 || formData.seat_rows > 20 || formData.seat_columns < 1 || formData.seat_columns > 20) {
      setError('Las filas y columnas deben tener entre 1 y 20');
      return;
    }
    
    // Simple URL validation
    try {
      new URL(formData.movie_poster);
    } catch (e) {
      // Si no es una URL válida, usamos una imagen de placeholder
      formData.movie_poster = `https://placehold.co/400x600?text=${encodeURIComponent(formData.movie_title)}`;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await cinemaService.createCinema(formData);
      
      // Redirect to cinema list
      navigate('/');
    } catch (error) {
      console.error('Error al crear la sala:', error);
      setError(error.message || 'Error al crear la sala');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Sala
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre de la sala"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grand Theater"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TheatersIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="movie_title"
                label="Titulo de la pelicula"
                fullWidth
                value={formData.movie_title}
                onChange={handleChange}
                placeholder="e.g. The Marvel Universe"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MovieIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="movie_poster"
                label="Url del poster de la pelicula"
                fullWidth
                value={formData.movie_poster}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                required
                helperText="Si no tiene una URL, se generará un marcador de posición"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="rows"
                label="Numero de fila"
                type="number"
                fullWidth
                value={formData.seat_rows}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 20 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridViewIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="columns"
                label="Numero de columnas"
                type="number"
                fullWidth
                value={formData.seat_columns}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 20 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridViewIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              type="button"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Creando...' : 'Crear sala'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCinema;