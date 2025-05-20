const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// Public routes
router.get('/', cinemaController.getAllCinemas);
router.get('/:id', cinemaController.getCinemaById);
router.get('/:id/reservations', cinemaController.getCinemaReservationsByDate);

// Admin routes
router.post('/', verifyToken, isAdmin, cinemaController.createCinema);
router.patch('/:id/movie', verifyToken, isAdmin, cinemaController.updateCinemaMovie);
router.patch('/:id/capacity', verifyToken, isAdmin, cinemaController.updateCinemaCapacity);

module.exports = router