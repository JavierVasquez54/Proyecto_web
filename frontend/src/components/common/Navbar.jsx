// frontend/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MovieFilter as MovieIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Reserva de cine
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/');
                }}
              >
                <Typography textAlign="center">Peliculas</Typography>
              </MenuItem>
              
              {isAuthenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate('/reservations');
                  }}
                >
                  <Typography textAlign="center">Mis Reservaciones</Typography>
                </MenuItem>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                [
                  <MenuItem
                    key="create-cinema"
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/admin/cinemas/create');
                    }}
                  >
                    <Typography textAlign="center">Crear Sala</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="manage-cinemas"
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/admin/cinemas');
                    }}
                  >
                    <Typography textAlign="center">Administrar Salas</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="manage-users"
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/admin/users');
                    }}
                  >
                    <Typography textAlign="center">Administrar Usuarios</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="activity-report"
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/admin/report');
                    }}
                  >
                    <Typography textAlign="center">Reporte</Typography>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <MovieIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Reserva de cine
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => navigate('/')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Peliculas
            </Button>
            
            {isAuthenticated && (
              <Button
                onClick={() => navigate('/reservations')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Mis Reservaciones
              </Button>
            )}
            
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Button
                  onClick={() => navigate('/admin/cinemas/create')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Crear Sala
                </Button>
                <Button
                  onClick={() => navigate('/admin/cinemas')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Administrar Salas
                </Button>
                <Button
                  onClick={() => navigate('/admin/users')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Administrar Usuarios
                </Button>
                <Button
                  onClick={() => navigate('/admin/report')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Reporte
                </Button>
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, color: 'white' }}
                >
                  <AccountCircle />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {user?.username}
                  </Typography>
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      // Add profile page navigation if needed
                      // navigate('/profile');
                    }}
                  >
                    <Typography textAlign="center">Perfil</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate('/reservations');
                    }}
                  >
                    <Typography textAlign="center">Mis Reservaciones</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Salir</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="secondary"
              >
                Ingresar
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;