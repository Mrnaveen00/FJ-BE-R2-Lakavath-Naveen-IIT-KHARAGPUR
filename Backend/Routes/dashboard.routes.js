// ==========================================
// DASHBOARD ROUTES
// API endpoints for dashboard operations
// ==========================================

const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboard.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// All dashboard routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// DASHBOARD ROUTES
// ==========================================

// GET /api/dashboard - Get dashboard overview
router.get('/', dashboardController.getDashboard);

// GET /api/dashboard/monthly - Get monthly summary
router.get('/monthly', dashboardController.getMonthlySummary);

module.exports = router;
