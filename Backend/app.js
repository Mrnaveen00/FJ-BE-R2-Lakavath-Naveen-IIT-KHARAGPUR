const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('./Config/passport');
const logger = require('./Utils/logger');

// Create Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:5173', 'http://127.0.0.1:8000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Serve static files (uploaded receipts)
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', require('./Routes/auth.routes'));
app.use('/api/dashboard', require('./Routes/dashboard.routes'));
app.use('/api/categories', require('./Routes/category.routes'));
app.use('/api/transactions', require('./Routes/transaction.routes'));
app.use('/api/reports', require('./Routes/report.routes'));
app.use('/api/budgets', require('./Routes/budget.routes'));

// Error handler (will be added later)
app.use((err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = app;
