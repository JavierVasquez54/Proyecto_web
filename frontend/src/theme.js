import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    seat: {
      available: '#90caf9',
      selected: '#f06292',
      reserved: '#9e9e9e',
      screen: '#212121'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      dark: '#303030',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h4: {
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    h5: {
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;