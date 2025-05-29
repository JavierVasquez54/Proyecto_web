// backend/src/controllers/report.controller.js
const { pool } = require('../config/db.config');

// Generate activity report for administrators
exports.getActivityReport = async (req, res, next) => {
  try {
    // Verify user is admin (additional check)
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Calculate date range for next 8 days
    const today = new Date();
    const reports = [];
    
    // Get all cinemas first
    const [cinemas] = await pool.query('SELECT * FROM cinemas');
    
    let totalReservedSeats = 0;
    let totalRevenue = 0;
    let totalEmptySeats = 0;
    let totalPotentialRevenue = 0;
    
    const seatPrice = 10; // $10 per seat
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toISOString().split('T')[0];
      
      let dailyReservedSeats = 0;
      let dailyEmptySeats = 0;
      let dailyTotalCapacity = 0;
      
      // Calculate for each cinema
      for (const cinema of cinemas) {
        const totalSeats = cinema.rows * cinema.columns;
        dailyTotalCapacity += totalSeats;
        
        // Count reserved seats for this cinema and date
        const [reservations] = await pool.query(
          'SELECT COUNT(*) as reserved FROM reservations WHERE cinema_id = ? AND reservation_date = ?',
          [cinema.id, formattedDate]
        );
        
        const reservedSeats = reservations[0].reserved || 0;
        const emptySeats = totalSeats - reservedSeats;
        
        dailyReservedSeats += reservedSeats;
        dailyEmptySeats += emptySeats;
      }
      
      // Add to totals
      totalReservedSeats += dailyReservedSeats;
      totalEmptySeats += dailyEmptySeats;
      totalRevenue += dailyReservedSeats * seatPrice;
      totalPotentialRevenue += dailyEmptySeats * seatPrice;
      
      reports.push({
        date: formattedDate,
        readable_date: date.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        reserved_seats: dailyReservedSeats,
        empty_seats: dailyEmptySeats,
        total_capacity: dailyTotalCapacity,
        daily_revenue: dailyReservedSeats * seatPrice,
        potential_lost_revenue: dailyEmptySeats * seatPrice,
        occupancy_rate: dailyTotalCapacity > 0 ? ((dailyReservedSeats / dailyTotalCapacity) * 100).toFixed(2) : 0
      });
    }
    
    // Summary data
    const summary = {
      total_reserved_seats_8_days: totalReservedSeats,
      total_revenue_8_days: totalRevenue,
      total_potential_lost_revenue_8_days: totalPotentialRevenue,
      average_daily_reserved_seats: (totalReservedSeats / 8).toFixed(2),
      average_daily_revenue: (totalRevenue / 8).toFixed(2),
      seat_price: seatPrice,
      report_generated_at: new Date().toISOString(),
      report_period: '8 days from today'
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        summary,
        daily_reports: reports,
        cinemas_info: cinemas.map(cinema => ({
          id: cinema.id,
          name: cinema.name,
          movie_title: cinema.movie_title,
          total_seats: cinema.rows * cinema.columns
        }))
      }
    });
  } catch (error) {
    console.error('Error generating activity report:', error);
    next(error);
  }
};