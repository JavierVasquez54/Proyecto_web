const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id, username, and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  return jwt.sign(
    payload,
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  generateToken,
  verifyToken
};