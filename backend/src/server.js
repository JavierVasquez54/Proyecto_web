const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import DB init/test functions
const { testConnection, initDatabase } = require('./config/db.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cinemaRoutes = require('./routes/cinema.routes');
const reservationRoutes = require('./routes/reservation.routes');
const reportRoutes = require('./routes/report.routes'); // 👈 AGREGAR ESTA LÍNEA

// Import error middleware
const errorMiddleware = require('./middlewares/error.middleware');

// Initialize Express app
const app = express();

// Set up middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin/report', reportRoutes); // 👈 AGREGAR ESTA LÍNEA

// Error handling middleware
app.use(errorMiddleware);

// Start server only if DB is ready
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await testConnection();         // Verifica conexión
    await initDatabase();          // Crea tablas y admin si es necesario
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});