const { pool } = require('../config/db.config');

// Create a new cinema (admin only)
exports.createCinema = async (req, res, next) => {
  try {
    const { name, movie_title, movie_poster, seat_rows, seat_columns } = req.body;
    
    // Validate input
    if (!name || !movie_title || !movie_poster || !seat_rows || !seat_columns) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required: name, movie_title, movie_poster, rows, columns'
      });
    }
    
    // Validate rows and columns
    if (seat_rows < 1 || seat_rows > 20 || seat_columns < 1 || seat_columns > 20) {
      return res.status(400).json({
        status: 'error',
        message: 'Rows and columns must be between 1 and 20'
      });
    }
    
    // Create new cinema
    const [result] = await pool.query(
      'INSERT INTO cinemas (name, movie_title, movie_poster, seat_rows, seat_columns) VALUES (?, ?, ?, ?, ?)',
      [name, movie_title, movie_poster, seat_rows, seat_columns]
    );
    
    // Return the created cinema
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [result.insertId]
    );
    
    res.status(201).json({
      status: 'success',
      data: cinemas[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all cinemas
// backend/src/controllers/cinema.controller.js
exports.getAllCinemas = async (req, res, next) => {
  try {
    // Get all cinemas
    const [cinemas] = await pool.query('SELECT * FROM cinemas');
    
    // For each cinema, count available seats for the next 8 days
    const today = new Date();
    const cinemasWithAvailability = await Promise.all(
      cinemas.map(async (cinema) => {
        const availabilityByDate = {};
        
        // Calculate availability for the next 8 days
        for (let i = 0; i < 8; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          
          // Count reservations for this date and cinema
          const [reservations] = await pool.query(
            'SELECT COUNT(*) as reserved FROM reservations WHERE cinema_id = ? AND reservation_date = ?',
            [cinema.id, formattedDate]
          );
          
          const totalSeats = cinema.rows * cinema.columns;
          // Ensure reserved seats is a number, default to 0 if not
          const reservedSeats = reservations[0].reserved || 0;
          const availableSeats = totalSeats - reservedSeats;
          
          // Store the number, not null
          availabilityByDate[formattedDate] = availableSeats;
        }
        
        return {
          ...cinema,
          availability: availabilityByDate
        };
      })
    );
    
    res.status(200).json({
      status: 'success',
      results: cinemasWithAvailability.length,
      data: cinemasWithAvailability
    });
  } catch (error) {
    next(error);
  }
};
// Get cinema by ID
exports.getCinemaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get cinema
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cinema not found'
      });
    }
    
    const cinema = cinemas[0];
    
    res.status(200).json({
      status: 'success',
      data: cinema
    });
  } catch (error) {
    next(error);
  }
};

// Update cinema movie (admin only)
exports.updateCinemaMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, movie_title, movie_poster } = req.body;
    
    // Validate input
    if (!name && !movie_title && !movie_poster) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one field must be provided: name, movie_title, movie_poster'
      });
    }
    
    // Check if cinema exists
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cinema not found'
      });
    }
    
    // Update fields
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (movie_title) {
      updateFields.push('movie_title = ?');
      updateValues.push(movie_title);
    }
    
    if (movie_poster) {
      updateFields.push('movie_poster = ?');
      updateValues.push(movie_poster);
    }
    
    // Add cinema ID to the update values
    updateValues.push(id);
    
    // Update cinema
    await pool.query(
      `UPDATE cinemas SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Return the updated cinema
    const [updatedCinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedCinemas[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update cinema capacity (admin only)
exports.updateCinemaCapacity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seat_rows, seat_columns } = req.body;
    
    // Validate input
    if (!seat_rows || !seat_columns) {
      return res.status(400).json({
        status: 'error',
        message: 'Rows and columns are required'
      });
    }
    
    // Validate rows and columns
    if (seat_rows < 1 || seat_rows > 20 || seat_columns < 1 || seat_columns > 20) {
      return res.status(400).json({
        status: 'error',
        message: 'Rows and columns must be between 1 and 20'
      });
    }
    
    // Check if cinema exists
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cinema not found'
      });
    }
    
    // Check if cinema has reservations
    const [reservations] = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE cinema_id = ?',
      [id]
    );
    
    if (reservations[0].count > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update capacity for a cinema with reservations'
      });
    }
    
    // Update cinema capacity
    await pool.query(
      'UPDATE cinemas SET rows = ?, columns = ? WHERE id = ?',
      [seat_rows, seat_columns, id]
    );
    
    // Return the updated cinema
    const [updatedCinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedCinemas[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get cinema reservations by date
exports.getCinemaReservationsByDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    // Validate date
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid date is required (YYYY-MM-DD)'
      });
    }
    
    // Check if cinema exists
    const [cinemas] = await pool.query(
      'SELECT * FROM cinemas WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cinema not found'
      });
    }
    
    const cinema = cinemas[0];
    
    // Get reservations for the cinema and date
    const [reservations] = await pool.query(
      'SELECT seat_row, seat_column FROM reservations WHERE cinema_id = ? AND reservation_date = ?',
      [id, date]
    );
    
    // Create a 2D array to represent the seat map
    const seatMap = Array(cinema.seat_rows).fill().map(() => Array(cinema.seat_columns).fill(false));
    
    // Mark reserved seats
    reservations.forEach(reservation => {
      seatMap[reservation.seat_row - 1][reservation.seat_column - 1] = true;
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        cinema,
        reservation_date: date,
        seat_map: seatMap
      }
    });
  } catch (error) {
    next(error);
  }
};