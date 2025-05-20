const { pool } = require('../config/db.config');
const QRCode = require('qrcode');

// Create a new reservation
exports.createReservation = async (req, res, next) => {
  try {
    const { cinema_id, seat_selections, reservation_date } = req.body;
    const user_id = req.user.id;
    
    // Validate input
    if (!cinema_id || !seat_selections || !reservation_date || !Array.isArray(seat_selections) || seat_selections.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cinema ID, seat selections array, and reservation date are required'
      });
    }
    
    // Validate date format
    if (!reservation_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    // Validate date range (must be within the next 8 days)
    const today = new Date();
today.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00

const reservationDate = new Date(reservation_date);
reservationDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00

// Calcular la diferencia en días
const daysDifference = Math.round((reservationDate - today) / (1000 * 60 * 60 * 24));

if (daysDifference < -1 || daysDifference > 7) {
  return res.status(400).json({
    status: 'error',
    message: 'La fecha de reserva debe ser dentro de los próximos 8 días (incluyendo hoy).'
  });
}
    
    // Check if cinema exists
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [cinema_id]
    );
    
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cinema not found'
      });
    }
    
    const cinema = cinemas[0];
    
    // Validate seat selections
    for (const seat of seat_selections) {
      if (!seat.seat_row || !seat.seat_column || 
          seat.seat_row < 1 || seat.seat_row > cinema.seat_rows || 
          seat.seat_column < 1 || seat.seat_column > cinema.seat_columns) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid seat selection: row ${seat.seat_row}, column ${seat.seat_column}`
        });
      }
    }
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Check if any of the selected seats are already reserved
      const seatChecks = seat_selections.map(seat => 
        `(seat_row = ${seat.seat_row} AND seat_column = ${seat.seat_column})`
      ).join(' OR ');
      
      const [existingReservations] = await connection.query(
        `SELECT seat_row, seat_column FROM reservations 
         WHERE cinema_id = ? AND reservation_date = ? AND (${seatChecks})`,
        [cinema_id, reservation_date]
      );
      
      if (existingReservations.length > 0) {
        const conflictingSeat = existingReservations[0];
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Seat at row ${conflictingSeat.row}, column ${conflictingSeat.column} is already reserved`
        });
      }
      
      // Create new reservations
      const reservations = [];
      
      for (const seat of seat_selections) {
        const [result] = await connection.query(
          'INSERT INTO reservations (user_id, cinema_id, seat_row, seat_column, reservation_date) VALUES (?, ?, ?, ?, ?)',
          [user_id, cinema_id, seat.seat_row, seat.seat_column, reservation_date]
        );
        
        reservations.push({
          id: result.insertId,
          user_id,
          cinema_id,
          seat_row: seat.row,
          seat_column: seat.column,
          reservation_date
        });
      }
      
      // Commit transaction
      await connection.commit();
      
      // Generate QR code with reservation information
      const reservationInfo = {
        cinema_name: cinema.name,
        movie_title: cinema.movie_title,
        reservation_date,
        seats: seat_selections.map(seat => `Row ${seat.seat_row}, Column ${seat.seat_column}`),
        user_id
      };
      
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(reservationInfo));
      
      res.status(201).json({
        status: 'success',
        data: {
          reservations,
          qr_code: qrCodeDataUrl
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Get user reservations
exports.getUserReservations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    
    // Get reservations for the user
    const [reservations] = await pool.query(
      `SELECT r.id, r.cinema_id, r.seat_row, r.seat_column, r.reservation_date, 
              c.name as cinema_name, c.movie_title, c.movie_poster
       FROM reservations r
       JOIN cinemas c ON r.cinema_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date DESC`,
      [user_id]
    );
    
    // Group reservations by cinema and date
    const groupedReservations = reservations.reduce((acc, reservation) => {
      const key = `${reservation.cinema_id}-${reservation.reservation_date}`;
      
      if (!acc[key]) {
        acc[key] = {
          cinema_id: reservation.cinema_id,
          cinema_name: reservation.cinema_name,
          movie_title: reservation.movie_title,
          movie_poster: reservation.movie_poster,
          reservation_date: reservation.reservation_date,
          seats: []
        };
      }
      
      acc[key].seats.push({
        id: reservation.id,
        seat_row: reservation.seat_row,
        seat_column: reservation.seat_column
      });
      
      return acc;
    }, {});
    
    res.status(200).json({
      status: 'success',
      data: Object.values(groupedReservations)
    });
  } catch (error) {
    next(error);
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    console.log(`Intento de cancelar reservación: ID=${id}, userID=${user_id}`);
    
    // Check if reservation exists and belongs to the user
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE id = ? LIMIT 1',
      [id]
    );
    
    console.log('Reservación encontrada:', reservations[0]);
    
    if (reservations.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }
    
    const reservation = reservations[0];
    
    // Check if reservation belongs to the user
    if (reservation.user_id !== user_id) {
      console.log(`Error: la reservación pertenece al usuario ${reservation.user_id}, no al usuario ${user_id}`);
      return res.status(403).json({
        status: 'error',
        message: 'Reservation does not belong to you'
      });
    }
    
    // Check if reservation is in the future
    const reservationDate = new Date(reservation.reservation_date);
    const today = new Date();
    
    if (reservationDate < today) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel past reservations'
      });
    }
    
    // Delete reservation
    await pool.query(
      'DELETE FROM reservations WHERE id = ?',
      [id]
    );
    
    console.log('Reservación cancelada exitosamente');
    
    res.status(200).json({
      status: 'success',
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Error al cancelar reservación:', error);
    next(error);
  }
};