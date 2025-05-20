import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  Image as ImageIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import cinemaService from '../../services/cinema.service';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`edit-cinema-tabpanel-${index}`}
      aria-labelledby={`edit-cinema-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EditCinema = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [cinema, setCinema] = useState(null);
  const [movieFormData, setMovieFormData] = useState({
    name: '',
    movie_title: '',
    movie_poster: '',
  });
  const [capacityFormData, setCapacityFormData] = useState({
    seat_rows: 0,
    seat_columns: 0,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Fetch cinema details
  useEffect(() => {
    const fetchCinema = async () => {
      try {
        setLoading(true);
        const response = await cinemaService.getCinemaById(id);
        setCinema(response.data);
        
        // Set form data with cinema details
        setMovieFormData({
          name: response.data.name,
          movie_title: response.data.movie_title,
          movie_poster: response.data.movie_poster,
        });
        
        setCapacityFormData({
          seat_rows: response.data.seat_rows,
          seat_columns: response.data.seat_columns,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCinema();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMovieFormChange = (e) => {
    const { name, value } = e.target;
    setMovieFormData({ ...movieFormData, [name]: value });
  };
  
  const handleCapacityFormChange = (e) => {
    const { name, value } = e.target;
    setCapacityFormData({ ...capacityFormData, [name]: Number(value) });
  };
  
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!movieFormData.name || !movieFormData.movie_title || !movieFormData.movie_poster) {
      setError('All fields are required');
      return;
    }
    
    // Validate URL
    try {
      new URL(movieFormData.movie_poster);
    } catch (e) {
      setError('Please enter a valid URL for the movie poster');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setSubmitting(true);
      
      await cinemaService.updateCinemaMovie(id, movieFormData);
      
      setSuccess('Detalles de la película actualizados exitosamente');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    
    // Validation
    if (capacityFormData.seat_rows < 1 || capacityFormData.seat_rows > 20 || 
        capacityFormData.seat_columns < 1 || capacityFormData.seat_columns > 20) {
      setError('Las filas y columnas deben tener entre 1 y 20');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setSubmitting(true);
      
      await cinemaService.updateCinemaCapacity(id, capacityFormData);
      
      setSuccess('Capacidad de la sala actualizada con éxito');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!cinema) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
        Salas no encontradas
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Regresar a las pelicuals
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar sala
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Id de sala: {cinema.id}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="edit cinema tabs">
            <Tab label="Detalles de la pelicula" />
            <Tab label="capacidad de la Sala" />
          </Tabs>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
            {success}
          </Alert>
        )}
        
        {/* Movie Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleUpdateMovie}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Nombre de la sala"
                  fullWidth
                  value={movieFormData.name}
                  onChange={handleMovieFormChange}
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
                  value={movieFormData.movie_title}
                  onChange={handleMovieFormChange}
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
                  value={movieFormData.movie_poster}
                  onChange={handleMovieFormChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Actualizando...' : 'detalles de la pelicula actualizados'}
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Cinema Capacity Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleUpdateCapacity}>
            <Alert severity="info" sx={{ mb: 3 }}>
            La capacidad solo se puede actualizar si no hay reservas para este cine.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  name="rows"
                  label="Numero de filas"
                  type="number"
                  fullWidth
                  value={capacityFormData.seat_rows}
                  onChange={handleCapacityFormChange}
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
                  value={capacityFormData.seat_columns}
                  onChange={handleCapacityFormChange}
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
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Actualizando...' : 'Capacidad actualizada'}
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Regresar a las peliculas
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCinema;
