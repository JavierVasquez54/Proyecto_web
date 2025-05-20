const { pool } = require('../config/db.config');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, role, active, created_at, updated_at FROM users'
    );
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Disable/enable user (admin only)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    // Validate input
    if (active === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Active status is required'
      });
    }
    
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Prevent disabling the admin user
    if (users[0].role === 'admin' && !active) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot disable the admin user'
      });
    }
    
    // Update user status
    await pool.query(
      'UPDATE users SET active = ? WHERE id = ?',
      [active, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: `User ${active ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    next(error);
  }
};