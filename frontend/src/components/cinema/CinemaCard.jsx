// src/components/cinema/CinemaCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { EventSeat as SeatIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getNext8Days } from '../../utils/dateUtils';

const CinemaCard = ({ cinema }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Asegúrate de que las propiedades existan con valores por defecto
  const { 
    id, 
    name = '', 
    movie_title = '', 
    movie_poster = '', 
    seat_rows = 0, 
    seat_columns = 0
  } = cinema || {};
  
  // Calcula el total de asientos - SIEMPRE USA ESTE VALOR
  const totalSeats = (seat_rows || 0) * (seat_columns || 0);
  
  // Usa directamente el total de asientos en lugar de la disponibilidad
  const availableSeats = totalSeats;
  
  console.log(`Cinema ${id} - ${name}: Total seats = ${totalSeats}`);
  
  const handleCardClick = () => {
    if (isAuthenticated) {
      navigate(`/cinema/${id}/seats`);
    } else {
      navigate('/login');
    }
  };
  
  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x600?text=Movie';
  };
  
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="220"
          image={movie_poster}
          alt={movie_title}
          onError={handleImageError}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {movie_title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {name}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Chip
              icon={<SeatIcon />}
              label={`${availableSeats} asientos disponibles`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CinemaCard;