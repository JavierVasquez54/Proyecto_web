const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const { pool } = require('../config/db.config');

const verifyToken = async (req, res, next) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }
    
    // Extract the token without the 'Bearer ' prefix
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Check if the user exists and is active
    const [users] = await pool.query(
      'SELECT id, username, email, role, active FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }
    
    const user = users[0];
    
    if (!user.active) {
      return res.status(401).json({
        status: 'error',
        message: 'User account is disabled'
      });
    }
    
    // Attach the user information to the request object
    req.user = user;
    
    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate'
    });
  }
};

module.exports = verifyToken;