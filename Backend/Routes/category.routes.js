// ==========================================
// CATEGORY ROUTES
// API endpoints for category operations
// ==========================================

const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/category.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// All category routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// CATEGORY ROUTES
// ==========================================

// GET /api/categories - Get all categories for user
router.get('/', categoryController.getCategories);

// POST /api/categories/initialize - Initialize default categories
router.post('/initialize', categoryController.initializeCategories);

// POST /api/categories - Create custom category
router.post('/', categoryController.createCategory);

module.exports = router;
