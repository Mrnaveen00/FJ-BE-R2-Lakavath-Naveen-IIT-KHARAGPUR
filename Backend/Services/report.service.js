// ==========================================
// REPORT SERVICE
// Business logic for reports and analytics
// ==========================================

const db = require('../db');

// ==========================================
// GET MONTHLY REPORT (Single Month)
// ==========================================
const getMonthlyReport = async (userId, year, month) => {
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
        
        // Get transaction count
        const countResult = await db.query(
            `SELECT COUNT(*) as count
             FROM transactions
             WHERE user_id = $1 
             AND transaction_date >= $2 
             AND transaction_date <= $3`,
            [userId, startDate, endDate]
        );
        
        const monthlyIncome = parseFloat(incomeResult.rows[0].total);
        const monthlyExpenses = parseFloat(expensesResult.rows[0].total);
        const transactionCount = parseInt(countResult.rows[0].count);
        
        return {
            year,
            month,
            monthName: getMonthName(month),
            income: monthlyIncome,
            expenses: monthlyExpenses,
            balance: monthlyIncome - monthlyExpenses,
            transactionCount
        };
        
    } catch (error) {
        console.error('Error in getMonthlyReport:', error);
        throw error;
    }
};

// ==========================================
// GET YEARLY MONTHLY REPORT (All Months)
// ==========================================
const getYearlyMonthlyReport = async (userId, year) => {
    try {
        const monthsData = [];
        
        // Get data for each month
        for (let month = 1; month <= 12; month++) {
            const monthData = await getMonthlyReport(userId, year, month);
            monthsData.push(monthData);
        }
        
        // Calculate yearly totals
        const yearlyIncome = monthsData.reduce((sum, m) => sum + m.income, 0);
        const yearlyExpenses = monthsData.reduce((sum, m) => sum + m.expenses, 0);
        const yearlyBalance = yearlyIncome - yearlyExpenses;
        
        return {
            year,
            months: monthsData,
            summary: {
                totalIncome: yearlyIncome,
                totalExpenses: yearlyExpenses,
                totalBalance: yearlyBalance,
                averageMonthlyIncome: yearlyIncome / 12,
                averageMonthlyExpenses: yearlyExpenses / 12
            }
        };
        
    } catch (error) {
        console.error('Error in getYearlyMonthlyReport:', error);
        throw error;
    }
};

// ==========================================
// GET YEARLY REPORT
// ==========================================
const getYearlyReport = async (userId, year) => {
    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        // Get total income for the year
        const incomeResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 
             AND type = 'income'
             AND transaction_date >= $2 
             AND transaction_date <= $3`,
            [userId, startDate, endDate]
        );
        
        // Get total expenses for the year
        const expensesResult = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total
             FROM transactions
             WHERE user_id = $1 
             AND type = 'expense'
             AND transaction_date >= $2 
             AND transaction_date <= $3`,
            [userId, startDate, endDate]
        );
        
        // Get category breakdown
        const categoryResult = await db.query(
            `SELECT 
                c.name as category_name,
                t.type,
                SUM(t.amount) as total
             FROM transactions t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1 
             AND t.transaction_date >= $2 
             AND t.transaction_date <= $3
             GROUP BY c.name, t.type
             ORDER BY total DESC`,
            [userId, startDate, endDate]
        );
        
        const totalIncome = parseFloat(incomeResult.rows[0].total);
        const totalExpenses = parseFloat(expensesResult.rows[0].total);
        
        // Separate categories by type
        const incomeCategories = categoryResult.rows
            .filter(row => row.type === 'income')
            .map(row => ({
                category: row.category_name || 'Uncategorized',
                amount: parseFloat(row.total)
            }));
            
        const expenseCategories = categoryResult.rows
            .filter(row => row.type === 'expense')
            .map(row => ({
                category: row.category_name || 'Uncategorized',
                amount: parseFloat(row.total)
            }));
        
        return {
            year,
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            incomeCategories,
            expenseCategories
        };
        
    } catch (error) {
        console.error('Error in getYearlyReport:', error);
        throw error;
    }
};

// ==========================================
// GET CATEGORY REPORT
// ==========================================
const getCategoryReport = async (userId, startDate, endDate) => {
    try {
        // Use current year if no dates provided
        if (!startDate || !endDate) {
            const now = new Date();
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }
        
        // Get category breakdown with transaction details
        const result = await db.query(
            `SELECT 
                c.id as category_id,
                c.name as category_name,
                c.type as category_type,
                t.type as transaction_type,
                COUNT(t.id) as transaction_count,
                SUM(t.amount) as total_amount,
                AVG(t.amount) as avg_amount,
                MIN(t.amount) as min_amount,
                MAX(t.amount) as max_amount
             FROM transactions t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1 
             AND t.transaction_date >= $2 
             AND t.transaction_date <= $3
             GROUP BY c.id, c.name, c.type, t.type
             ORDER BY total_amount DESC`,
            [userId, startDate, endDate]
        );
        
        const categories = result.rows.map(row => ({
            categoryId: row.category_id,
            categoryName: row.category_name || 'Uncategorized',
            categoryType: row.category_type,
            transactionType: row.transaction_type,
            transactionCount: parseInt(row.transaction_count),
            totalAmount: parseFloat(row.total_amount),
            averageAmount: parseFloat(row.avg_amount),
            minAmount: parseFloat(row.min_amount),
            maxAmount: parseFloat(row.max_amount)
        }));
        
        return {
            startDate,
            endDate,
            categories
        };
        
    } catch (error) {
        console.error('Error in getCategoryReport:', error);
        throw error;
    }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
}

module.exports = {
    getMonthlyReport,
    getYearlyMonthlyReport,
    getYearlyReport,
    getCategoryReport
};
