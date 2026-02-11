// ==========================================
// REPORT ROUTES
// API endpoints for report operations
// ==========================================

const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/report.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// All report routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// REPORT ROUTES
// ==========================================

// GET /api/reports/monthly - Get monthly income vs expenses report
router.get('/monthly', reportController.getMonthlyReport);

// GET /api/reports/yearly - Get yearly summary
router.get('/yearly', reportController.getYearlyReport);

// GET /api/reports/category - Get category breakdown report
router.get('/category', reportController.getCategoryReport);

module.exports = router;
