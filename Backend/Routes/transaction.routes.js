// ==========================================
// TRANSACTION ROUTES
// API endpoints for transaction operations
// ==========================================

const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transaction.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const upload = require('../Middleware/upload.middleware');

// All transaction routes require authentication
router.use(authMiddleware.verifyToken);

// ==========================================
// TRANSACTION ROUTES
// ==========================================

// GET /api/transactions - Get all transactions with optional filters
router.get('/', transactionController.getTransactions);

// POST /api/transactions - Create new transaction (with optional receipt)
router.post('/', upload.single('receipt'), transactionController.createTransaction);

// GET /api/transactions/:id - Get specific transaction
router.get('/:id', transactionController.getTransactionById);

// GET /api/transactions/:id/receipt - Download receipt
router.get('/:id/receipt', transactionController.downloadReceipt);

// PUT /api/transactions/:id - Update transaction (with optional receipt)
router.put('/:id', upload.single('receipt'), transactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
