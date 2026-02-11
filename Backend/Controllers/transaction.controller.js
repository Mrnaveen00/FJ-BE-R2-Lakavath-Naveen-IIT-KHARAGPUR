// ==========================================
// TRANSACTION CONTROLLER
// Handles transaction-related HTTP requests
// ==========================================

const transactionService = require('../Services/transaction.service');
const responseHandler = require('../Utils/responseHandler');

// ==========================================
// GET ALL TRANSACTIONS
// ==========================================
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, category_id, start_date, end_date, limit } = req.query;
        
        console.log('💳 Getting transactions for user:', userId);
        
        const filters = {};
        if (type) filters.type = type;
        if (category_id) filters.category_id = category_id;
        if (start_date) filters.start_date = start_date;
        if (end_date) filters.end_date = end_date;
        if (limit) filters.limit = parseInt(limit);
        
        const transactions = await transactionService.getUserTransactions(userId, filters);
        
        // Get summary
        const summary = await transactionService.getTransactionSummary(userId, filters);
        
        console.log(`✅ Retrieved ${transactions.length} transactions`);
        
        return responseHandler.success(
            res,
            {
                transactions,
                summary
            },
            'Transactions retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getTransactions:', error);
        return responseHandler.error(
            res,
            'Failed to load transactions',
            500
        );
    }
};

// ==========================================
// CREATE TRANSACTION
// ==========================================
const createTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, category_id, amount, transaction_date, description } = req.body;
        const receipt_path = req.file ? req.file.filename : null;
        
        console.log('📝 Create Transaction Request:', {
            userId,
            body: req.body,
            receipt: receipt_path
        });
        
        // Validation
        if (!type || !category_id || !amount || !transaction_date) {
            console.log('❌ Validation failed: Missing required fields');
            return responseHandler.error(
                res,
                'Type, category, amount, and transaction date are required',
                400
            );
        }
        
        if (!['income', 'expense'].includes(type)) {
            return responseHandler.error(
                res,
                'Type must be either income or expense',
                400
            );
        }
        
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return responseHandler.error(
                res,
                'Amount must be a positive number',
                400
            );
        }
        
        console.log('💳 Creating transaction:', { type, category_id, amount, receipt_path });
        
        const transaction = await transactionService.createTransaction(userId, {
            type,
            category_id,
            amount: parseFloat(amount),
            transaction_date,
            description,
            receipt_path
        });
        
        console.log('✅ Transaction created successfully');
        
        return responseHandler.success(
            res,
            transaction,
            'Transaction created successfully',
            201
        );
        
    } catch (error) {
        console.error('❌ Error in createTransaction:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        if (error.message.includes('Amount must be')) {
            return responseHandler.error(
                res,
                error.message,
                400
            );
        }
        
        return responseHandler.error(
            res,
            `Failed to create transaction: ${error.message}`,
            500
        );
    }
};

// ==========================================
// GET TRANSACTION BY ID
// ==========================================
const getTransactionById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        console.log('💳 Getting transaction:', id);
        
        const transaction = await transactionService.getTransactionById(userId, id);
        
        if (!transaction) {
            return responseHandler.notFound(
                res,
                'Transaction not found'
            );
        }
        
        console.log('✅ Transaction retrieved');
        
        return responseHandler.success(
            res,
            transaction,
            'Transaction retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getTransactionById:', error);
        return responseHandler.error(
            res,
            'Failed to load transaction',
            500
        );
    }
};

// ==========================================
// UPDATE TRANSACTION
// ==========================================
const updateTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { type, category_id, amount, transaction_date, description } = req.body;
        const receipt_path = req.file ? req.file.filename : null;
        
        console.log('💳 Updating transaction:', id);
        
        const updateData = {};
        if (type) updateData.type = type;
        if (category_id) updateData.category_id = category_id;
        if (amount) updateData.amount = parseFloat(amount);
        if (transaction_date) updateData.transaction_date = transaction_date;
        if (description !== undefined) updateData.description = description;
        if (receipt_path) updateData.receipt_path = receipt_path;
        
        const transaction = await transactionService.updateTransaction(
            userId,
            id,
            updateData
        );
        
        console.log('✅ Transaction updated successfully');
        
        return responseHandler.success(
            res,
            transaction,
            'Transaction updated successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in updateTransaction:', error);
        
        if (error.message === 'Transaction not found') {
            return responseHandler.notFound(
                res,
                'Transaction not found'
            );
        }
        
        if (error.message.includes('Amount must be')) {
            return responseHandler.error(
                res,
                error.message,
                400
            );
        }
        
        return responseHandler.error(
            res,
            'Failed to update transaction',
            500
        );
    }
};

// ==========================================
// DELETE TRANSACTION
// ==========================================
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        console.log('💳 Deleting transaction:', id);
        
        await transactionService.deleteTransaction(userId, id);
        
        console.log('✅ Transaction deleted successfully');
        
        return responseHandler.success(
            res,
            null,
            'Transaction deleted successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in deleteTransaction:', error);
        
        if (error.message === 'Transaction not found') {
            return responseHandler.notFound(
                res,
                'Transaction not found'
            );
        }
        
        return responseHandler.error(
            res,
            'Failed to delete transaction',
            500
        );
    }
};

// ==========================================
// DOWNLOAD RECEIPT
// ==========================================
const downloadReceipt = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const path = require('path');
        const fs = require('fs');
        
        console.log('📄 Download receipt for transaction:', id);
        
        const transaction = await transactionService.getTransactionById(userId, id);
        
        if (!transaction) {
            return responseHandler.notFound(
                res,
                'Transaction not found'
            );
        }
        
        if (!transaction.receipt_path) {
            return responseHandler.error(
                res,
                'No receipt found for this transaction',
                404
            );
        }
        
        const filePath = path.join(__dirname, '..', 'Uploads', 'receipts', transaction.receipt_path);
        
        if (!fs.existsSync(filePath)) {
            return responseHandler.error(
                res,
                'Receipt file not found',
                404
            );
        }
        
        console.log('✅ Sending receipt file');
        res.download(filePath);
        
    } catch (error) {
        console.error('❌ Error in downloadReceipt:', error);
        return responseHandler.error(
            res,
            'Failed to download receipt',
            500
        );
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    downloadReceipt
};
