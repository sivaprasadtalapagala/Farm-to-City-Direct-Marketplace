const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Product routes
app.use('/api/products', require('./routes/productRoutes'));

// Order routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Farmer routes
app.use('/api/farmer', require('./routes/farmerRoutes'));


module.exports = app;
