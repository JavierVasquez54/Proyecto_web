const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db.config');
const jwtConfig = require('../config/jwt.config');

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }
    
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    const user = users[0];
    
    // Check if user is active
    if (!user.active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been disabled'
      });
    }
    
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    // Return user information and token
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email and password are required'
      });
    }
    
    // Check if username already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.username === username) {
        return res.status(400).json({
          status: 'error',
          message: 'Username already exists'
        });
      }
      
      if (existingUser.email === email) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already exists'
        });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'client']
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, username, role: 'client' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    // Return user information and token
    res.status(201).json({
      status: 'success',
      data: {
        id: result.insertId,
        username,
        email,
        role: 'client',
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user information
exports.getMe = async (req, res, next) => {
  try {
    // User information is already attached to the request object by the auth middleware
    res.status(200).json({
      status: 'success',
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};