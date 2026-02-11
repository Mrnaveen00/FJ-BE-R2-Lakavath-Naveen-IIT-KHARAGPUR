// ==========================================
// TRANSACTION ROUTES
// API endpoints for transaction operations
// ==========================================

const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transaction.controller');
const authMiddleware = require('../Middleware/auth.middleware');

// All transaction routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// TRANSACTION ROUTES
// ==========================================

// GET /api/transactions - Get all transactions with optional filters
router.get('/', transactionController.getTransactions);

// POST /api/transactions - Create new transaction
router.post('/', transactionController.createTransaction);

// GET /api/transactions/:id - Get specific transaction
router.get('/:id', transactionController.getTransactionById);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
