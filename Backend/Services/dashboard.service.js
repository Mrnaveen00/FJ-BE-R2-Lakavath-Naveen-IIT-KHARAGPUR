// ==========================================
// DASHBOARD SERVICE
// Business logic for dashboard data
// ==========================================

const db = require('../db');

// ==========================================
// GET DASHBOARD DATA
// ==========================================
const getDashboardData = async (userId) => {
    try {
        // Get total income
        const incomeResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 AND type = 'income'`,
            [userId]
        );
        
        // Get total expenses
        const expensesResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 AND type = 'expense'`,
            [userId]
        );
        
        // Get recent transactions (last 5)
        const recentTransactionsResult = await db.query(
            `SELECT 
                t.id,
                t.type,
                t.amount,
                t.transaction_date,
                t.description,
                c.id as category_id,
                c.name as category_name,
                c.type as category_type
             FROM transactions t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1
             ORDER BY t.transaction_date DESC, t.created_at DESC
             LIMIT 5`,
            [userId]
        );
        
        const totalIncome = parseFloat(incomeResult.rows[0].total);
        const totalExpenses = parseFloat(expensesResult.rows[0].total);
        const balance = totalIncome - totalExpenses;
        
        // Format recent transactions
        const recentTransactions = recentTransactionsResult.rows.map(row => ({
            id: row.id,
            type: row.type,
            amount: parseFloat(row.amount),
            transaction_date: row.transaction_date,
            description: row.description,
            Category: row.category_id ? {
                id: row.category_id,
                name: row.category_name,
                type: row.category_type
            } : null
        }));
        
        return {
            totalIncome,
            totalExpenses,
            balance,
            recentTransactions
        };
        
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        throw error;
    }
};

// ==========================================
// GET MONTHLY SUMMARY
// ==========================================
const getMonthlySummary = async (userId, year, month) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        // Get income for the month
        const incomeResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 
             AND type = 'income'
             AND transaction_date >= $2 
             AND transaction_date <= $3`,
            [userId, startDate, endDate]
        );
        
        // Get expenses for the month
        const expensesResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 
             AND type = 'expense'
             AND transaction_date >= $2 
             AND transaction_date <= $3`,
            [userId, startDate, endDate]
        );
        
        const monthlyIncome = parseFloat(incomeResult.rows[0].total);
        const monthlyExpenses = parseFloat(expensesResult.rows[0].total);
        
        return {
            month,
            year,
            monthlyIncome,
            monthlyExpenses,
            monthlyBalance: monthlyIncome - monthlyExpenses
        };
        
    } catch (error) {
        console.error('Error in getMonthlySummary:', error);
        throw error;
    }
};


module.exports = {
    getDashboardData,
    getMonthlySummary
};
