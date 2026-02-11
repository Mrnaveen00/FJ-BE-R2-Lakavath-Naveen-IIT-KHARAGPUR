// ==========================================
// TRANSACTION SERVICE
// Business logic for transactions
// ==========================================

const db = require('../db');

// ==========================================
// GET ALL TRANSACTIONS FOR USER
// ==========================================
const getUserTransactions = async (userId, filters = {}) => {
    try {
        let query = `
            SELECT 
                t.id,
                t.type,
                t.amount,
                t.transaction_date,
                t.description,
                t.created_at,
                t.updated_at,
                c.id as category_id,
                c.name as category_name,
                c.type as category_type
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = $1
        `;
        
        const params = [userId];
        let paramIndex = 2;
        
        // Filter by type (income/expense)
        if (filters.type) {
            query += ` AND t.type = $${paramIndex}`;
            params.push(filters.type);
            paramIndex++;
        }
        
        // Filter by category
        if (filters.category_id) {
            query += ` AND t.category_id = $${paramIndex}`;
            params.push(filters.category_id);
            paramIndex++;
        }
        
        // Filter by date range
        if (filters.start_date) {
            query += ` AND t.transaction_date >= $${paramIndex}`;
            params.push(filters.start_date);
            paramIndex++;
        }
        
        if (filters.end_date) {
            query += ` AND t.transaction_date <= $${paramIndex}`;
            params.push(filters.end_date);
            paramIndex++;
        }
        
        // Order by date (newest first)
        query += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;
        
        // Limit results
        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(filters.limit);
        }
        
        const result = await db.query(query, params);
        
        // Format the response
        const transactions = result.rows.map(row => ({
            id: row.id,
            type: row.type,
            amount: parseFloat(row.amount),
            transaction_date: row.transaction_date,
            description: row.description,
            created_at: row.created_at,
            updated_at: row.updated_at,
            Category: row.category_id ? {
                id: row.category_id,
                name: row.category_name,
                type: row.category_type
            } : null
        }));
        
        return transactions;
    } catch (error) {
        console.error('Error in getUserTransactions:', error);
        throw error;
    }
};

// ==========================================
// CREATE TRANSACTION
// ==========================================
const createTransaction = async (userId, transactionData) => {
    try {
        const { type, category_id, amount, transaction_date, description } = transactionData;
        
        // Validate amount
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        
        // Insert transaction
        const result = await db.query(
            `INSERT INTO transactions 
             (id, user_id, type, category_id, amount, transaction_date, description, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING id, user_id, type, category_id, amount, transaction_date, description, created_at, updated_at`,
            [userId, type, category_id, amount, transaction_date, description || null]
        );
        
        const transaction = result.rows[0];
        
        // Get category details
        const categoryResult = await db.query(
            `SELECT id, name, type FROM categories WHERE id = $1`,
            [category_id]
        );
        
        return {
            ...transaction,
            amount: parseFloat(transaction.amount),
            Category: categoryResult.rows[0] || null
        };
    } catch (error) {
        console.error('Error in createTransaction:', error);
        throw error;
    }
};

// ==========================================
// GET TRANSACTION BY ID
// ==========================================
const getTransactionById = async (userId, transactionId) => {
    try {
        const result = await db.query(
            `SELECT 
                t.id,
                t.type,
                t.amount,
                t.transaction_date,
                t.description,
                t.created_at,
                t.updated_at,
                c.id as category_id,
                c.name as category_name,
                c.type as category_type
             FROM transactions t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.id = $1 AND t.user_id = $2`,
            [transactionId, userId]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        
        return {
            id: row.id,
            type: row.type,
            amount: parseFloat(row.amount),
            transaction_date: row.transaction_date,
            description: row.description,
            created_at: row.created_at,
            updated_at: row.updated_at,
            Category: row.category_id ? {
                id: row.category_id,
                name: row.category_name,
                type: row.category_type
            } : null
        };
    } catch (error) {
        console.error('Error in getTransactionById:', error);
        throw error;
    }
};

// ==========================================
// UPDATE TRANSACTION
// ==========================================
const updateTransaction = async (userId, transactionId, updateData) => {
    try {
        const { type, category_id, amount, transaction_date, description } = updateData;
        
        // Check if transaction exists and belongs to user
        const existingResult = await db.query(
            `SELECT id FROM transactions WHERE id = $1 AND user_id = $2`,
            [transactionId, userId]
        );
        
        if (existingResult.rows.length === 0) {
            throw new Error('Transaction not found');
        }
        
        // Validate amount if provided
        if (amount !== undefined && amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        
        // Update transaction
        const result = await db.query(
            `UPDATE transactions
             SET type = COALESCE($1, type),
                 category_id = COALESCE($2, category_id),
                 amount = COALESCE($3, amount),
                 transaction_date = COALESCE($4, transaction_date),
                 description = COALESCE($5, description),
                 updated_at = NOW()
             WHERE id = $6 AND user_id = $7
             RETURNING id, user_id, type, category_id, amount, transaction_date, description, created_at, updated_at`,
            [type, category_id, amount, transaction_date, description, transactionId, userId]
        );
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in updateTransaction:', error);
        throw error;
    }
};

// ==========================================
// DELETE TRANSACTION
// ==========================================
const deleteTransaction = async (userId, transactionId) => {
    try {
        const result = await db.query(
            `DELETE FROM transactions
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [transactionId, userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Transaction not found');
        }
        
        return { message: 'Transaction deleted successfully' };
    } catch (error) {
        console.error('Error in deleteTransaction:', error);
        throw error;
    }
};

// ==========================================
// GET TRANSACTION SUMMARY
// ==========================================
const getTransactionSummary = async (userId, filters = {}) => {
    try {
        let query = `
            SELECT 
                type,
                COALESCE(SUM(amount), 0) as total
            FROM transactions
            WHERE user_id = $1
        `;
        
        const params = [userId];
        let paramIndex = 2;
        
        // Filter by date range
        if (filters.start_date) {
            query += ` AND transaction_date >= $${paramIndex}`;
            params.push(filters.start_date);
            paramIndex++;
        }
        
        if (filters.end_date) {
            query += ` AND transaction_date <= $${paramIndex}`;
            params.push(filters.end_date);
            paramIndex++;
        }
        
        query += ` GROUP BY type`;
        
        const result = await db.query(query, params);
        
        const summary = {
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0
        };
        
        result.rows.forEach(row => {
            if (row.type === 'income') {
                summary.totalIncome = parseFloat(row.total);
            } else if (row.type === 'expense') {
                summary.totalExpenses = parseFloat(row.total);
            }
        });
        
        summary.balance = summary.totalIncome - summary.totalExpenses;
        
        return summary;
    } catch (error) {
        console.error('Error in getTransactionSummary:', error);
        throw error;
    }
};

module.exports = {
    getUserTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
};
