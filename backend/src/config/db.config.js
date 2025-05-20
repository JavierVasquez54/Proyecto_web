const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize database - create tables if they don't exist
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create cinemas table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cinemas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        movie_title VARCHAR(100) NOT NULL,
        movie_poster VARCHAR(255) NOT NULL,
        seat_rows INT NOT NULL,
        seat_columns INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create reservations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        cinema_id INT NOT NULL,
        seat_row INT NOT NULL,
        seat_column INT NOT NULL,
        reservation_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (cinema_id) REFERENCES cinemas(id),
        UNIQUE KEY unique_seat_reservation (cinema_id, seat_row, seat_column, reservation_date)
      )
    `);
    
    // Create default admin user if it doesn't exist
    const [admins] = await connection.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1', 
      ['admin']
    );
    
    if (admins.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@cinema.com', 'admin']
      );
      console.log('Default admin user created');
    }
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};