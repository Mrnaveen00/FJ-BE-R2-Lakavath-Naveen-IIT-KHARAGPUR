// ==========================================
// BUDGET ROUTES
// API endpoints for budget operations
// ==========================================

const express = require('express');
const router = express.Router();
const budgetController = require('../Controllers/budget.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// All budget routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// BUDGET ROUTES
// ==========================================

// GET /api/budgets - Get all budgets for user
router.get('/', budgetController.getBudgets);

// POST /api/budgets - Create new budget
router.post('/', budgetController.createBudget);

// GET /api/budgets/:id - Get specific budget
router.get('/:id', budgetController.getBudgetById);

// PUT /api/budgets/:id - Update budget
router.put('/:id', budgetController.updateBudget);

// DELETE /api/budgets/:id - Delete budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
