// src/components/ui/DateSelector.jsx
import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from '@mui/material';
import { getNext8Days } from '../../utils/dateUtils';

const DateSelector = ({ selectedDate, onDateChange }) => {
  // Obtener los próximos 8 días, empezando desde mañana
  const next8Days = getNext8Days(0); // Pasamos 1 para empezar desde mañana
  
  const handleChange = (event, newDate) => {
    if (newDate !== null) {
      onDateChange(newDate);
    }
  };
  
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Seleccionar Fecha
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1 }}>
        <ToggleButtonGroup
          value={selectedDate}
          exclusive
          onChange={handleChange}
          aria-label="date selection"
          sx={{ flexWrap: 'nowrap' }}
        >
          {next8Days.map((day) => (
            <ToggleButton
              key={day.formattedDate}
              value={day.formattedDate}
              aria-label={day.readableDate}
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: '100px',
                textTransform: 'none',
                overflow: 'hidden',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
              </Typography>
              <Typography variant="body2">
                {new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </Typography>
              {day.isToday && (
                <Typography variant="caption" color="primary.main">
                  Hoy
                </Typography>
              )}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default DateSelector;