const express = require('express');
const reservationController = require('../controllers/reservation.controller');
const verifyToken = require('../middlewares/auth.middleware');

const router = express.Router();

// Protected routes
router.post('/', verifyToken, reservationController.createReservation);
router.get('/me', verifyToken, reservationController.getUserReservations);
router.delete('/:id', verifyToken, reservationController.cancelReservation);

module.exports = router;