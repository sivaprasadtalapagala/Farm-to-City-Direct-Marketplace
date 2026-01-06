const express = require('express');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorMiddleware');

const app = express();

// =====================
// Middleware
// =====================
app.use(express.json());

// =====================
// Routes
// =====================

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'OK' });
// });

// Product routes
app.use('/api/products', require('./routes/productRoutes'));

// Order routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Farmer routes
app.use('/api/farmer', require('./routes/farmerRoutes'));

// Payment routes
app.use('/api/payments', require('./routes/paymentRoutes'));

// =====================
// Health check
// =====================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// =====================
// Handle unknown routes
// =====================
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// =====================
// Global Error Handler
// =====================
app.use(globalErrorHandler);

module.exports = app;
