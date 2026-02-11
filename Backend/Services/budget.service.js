// ==========================================
// BUDGET SERVICE
// Business logic for budgets
// ==========================================

const db = require('../db');

// ==========================================
// GET ALL BUDGETS FOR USER WITH PROGRESS
// ==========================================
const getUserBudgets = async (userId) => {
    try {
        const query = `
            SELECT 
                b.id,
                b.category_id,
                b.amount as budget_amount,
                b.period,
                b.start_date,
                b.end_date,
                b.created_at,
                b.updated_at,
                c.name as category_name,
                c.type as category_type,
                COALESCE(SUM(t.amount), 0) as spent_amount
            FROM budgets b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN transactions t ON t.category_id = b.category_id 
                AND t.user_id = b.user_id
                AND t.type = 'expense'
                AND t.transaction_date >= b.start_date
                AND t.transaction_date <= b.end_date
            WHERE b.user_id = $1
            GROUP BY b.id, b.category_id, b.amount, b.period, b.start_date, b.end_date, 
                     b.created_at, b.updated_at, c.name, c.type
            ORDER BY b.created_at DESC
        `;
        
        const result = await db.query(query, [userId]);
        
        const budgets = result.rows.map(row => {
            const budgetAmount = parseFloat(row.budget_amount);
            const spentAmount = parseFloat(row.spent_amount);
            const remaining = budgetAmount - spentAmount;
            const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
            
            return {
                id: row.id,
                category_id: row.category_id,
                budgetAmount: budgetAmount,
                spentAmount: spentAmount,
                remaining: remaining,
                percentage: percentage,
                period: row.period,
                start_date: row.start_date,
                end_date: row.end_date,
                created_at: row.created_at,
                updated_at: row.updated_at,
                Category: {
                    name: row.category_name,
                    type: row.category_type
                },
                status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
            };
        });
        
        return budgets;
    } catch (error) {
        console.error('Error in getUserBudgets:', error);
        throw error;
    }
};

// ==========================================
// CREATE BUDGET
// ==========================================
const createBudget = async (userId, budgetData) => {
    try {
        const { category_id, amount, period, start_date, end_date } = budgetData;
        
        // Check if budget already exists for this category and period
        const existingCheck = await db.query(
            `SELECT id FROM budgets 
             WHERE user_id = $1 
             AND category_id = $2 
             AND start_date <= $4 
             AND end_date >= $3`,
            [userId, category_id, start_date, end_date]
        );
        
        if (existingCheck.rows.length > 0) {
            throw new Error('Budget already exists for this category in the given period');
        }
        
        // Insert budget
        const result = await db.query(
            `INSERT INTO budgets 
             (id, user_id, category_id, amount, period, start_date, end_date, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING id, user_id, category_id, amount, period, start_date, end_date, created_at, updated_at`,
            [userId, category_id, amount, period, start_date, end_date]
        );
        
        const budget = result.rows[0];
        
        // Get category details
        const categoryResult = await db.query(
            `SELECT id, name, type FROM categories WHERE id = $1`,
            [category_id]
        );
        
        return {
            ...budget,
            amount: parseFloat(budget.amount),
            Category: categoryResult.rows[0] || null,
            spentAmount: 0,
            remaining: parseFloat(budget.amount),
            percentage: 0,
            status: 'good'
        };
    } catch (error) {
        console.error('Error in createBudget:', error);
        throw error;
    }
};

// ==========================================
// GET BUDGET BY ID
// ==========================================
const getBudgetById = async (userId, budgetId) => {
    try {
        const result = await db.query(
            `SELECT 
                b.id,
                b.category_id,
                b.amount as budget_amount,
                b.period,
                b.start_date,
                b.end_date,
                b.created_at,
                b.updated_at,
                c.name as category_name,
                c.type as category_type,
                COALESCE(SUM(t.amount), 0) as spent_amount
             FROM budgets b
             LEFT JOIN categories c ON b.category_id = c.id
             LEFT JOIN transactions t ON t.category_id = b.category_id 
                AND t.user_id = b.user_id
                AND t.type = 'expense'
                AND t.transaction_date >= b.start_date
                AND t.transaction_date <= b.end_date
             WHERE b.id = $1 AND b.user_id = $2
             GROUP BY b.id, b.category_id, b.amount, b.period, b.start_date, b.end_date, 
                      b.created_at, b.updated_at, c.name, c.type`,
            [budgetId, userId]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        const budgetAmount = parseFloat(row.budget_amount);
        const spentAmount = parseFloat(row.spent_amount);
        const remaining = budgetAmount - spentAmount;
        const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
        
        return {
            id: row.id,
            category_id: row.category_id,
            budgetAmount: budgetAmount,
            spentAmount: spentAmount,
            remaining: remaining,
            percentage: percentage,
            period: row.period,
            start_date: row.start_date,
            end_date: row.end_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            Category: {
                name: row.category_name,
                type: row.category_type
            },
            status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
        };
    } catch (error) {
        console.error('Error in getBudgetById:', error);
        throw error;
    }
};

// ==========================================
// UPDATE BUDGET
// ==========================================
const updateBudget = async (userId, budgetId, updateData) => {
    try {
        const { category_id, amount, period, start_date, end_date } = updateData;
        
        // Check if budget exists
        const existingResult = await db.query(
            `SELECT id FROM budgets WHERE id = $1 AND user_id = $2`,
            [budgetId, userId]
        );
        
        if (existingResult.rows.length === 0) {
            throw new Error('Budget not found');
        }
        
        // Update budget
        const result = await db.query(
            `UPDATE budgets
             SET category_id = COALESCE($1, category_id),
                 amount = COALESCE($2, amount),
                 period = COALESCE($3, period),
                 start_date = COALESCE($4, start_date),
                 end_date = COALESCE($5, end_date),
                 updated_at = NOW()
             WHERE id = $6 AND user_id = $7
             RETURNING id, user_id, category_id, amount, period, start_date, end_date, created_at, updated_at`,
            [category_id, amount, period, start_date, end_date, budgetId, userId]
        );
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in updateBudget:', error);
        throw error;
    }
};

// ==========================================
// DELETE BUDGET
// ==========================================
const deleteBudget = async (userId, budgetId) => {
    try {
        const result = await db.query(
            `DELETE FROM budgets
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [budgetId, userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Budget not found');
        }
        
        return { message: 'Budget deleted successfully' };
    } catch (error) {
        console.error('Error in deleteBudget:', error);
        throw error;
    }
};

module.exports = {
    getUserBudgets,
    createBudget,
    getBudgetById,
    updateBudget,
    deleteBudget
};
