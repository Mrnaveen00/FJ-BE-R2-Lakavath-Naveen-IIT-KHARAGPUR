// ==========================================
// CATEGORY SERVICE
// Business logic for categories
// ==========================================

const db = require('../db');

// ==========================================
// GET ALL CATEGORIES FOR USER
// ==========================================
const getUserCategories = async (userId) => {
    try {
        const result = await db.query(
            `SELECT id, name, type, user_id, is_default, created_at, updated_at
             FROM categories
             WHERE user_id = $1 OR is_default = true
             ORDER BY is_default DESC, name ASC`,
            [userId]
        );
        
        return result.rows;
    } catch (error) {
        console.error('Error in getUserCategories:', error);
        throw error;
    }
};

// ==========================================
// INITIALIZE DEFAULT CATEGORIES
// ==========================================
const initializeDefaultCategories = async (userId) => {
    try {
        // Check if user already has categories
        const existingResult = await db.query(
            `SELECT COUNT(*) as count FROM categories WHERE user_id = $1`,
            [userId]
        );
        
        if (parseInt(existingResult.rows[0].count) > 0) {
            return { message: 'Categories already initialized' };
        }
        
        // Default categories to create
        const defaultCategories = [
            // Income categories
            { name: 'Salary', type: 'income' },
            { name: 'Freelance', type: 'income' },
            { name: 'Investment', type: 'income' },
            { name: 'Other Income', type: 'income' },
            
            // Expense categories
            { name: 'Food & Dining', type: 'expense' },
            { name: 'Transportation', type: 'expense' },
            { name: 'Shopping', type: 'expense' },
            { name: 'Entertainment', type: 'expense' },
            { name: 'Bills & Utilities', type: 'expense' },
            { name: 'Healthcare', type: 'expense' },
            { name: 'Education', type: 'expense' },
            { name: 'Other Expense', type: 'expense' }
        ];
        
        // Insert all default categories
        const insertPromises = defaultCategories.map(category => {
            return db.query(
                `INSERT INTO categories (id, name, type, user_id, is_default, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, $2, $3, false, NOW(), NOW())`,
                [category.name, category.type, userId]
            );
        });
        
        await Promise.all(insertPromises);
        
        return { message: 'Default categories initialized successfully' };
    } catch (error) {
        console.error('Error in initializeDefaultCategories:', error);
        throw error;
    }
};

// ==========================================
// CREATE CUSTOM CATEGORY
// ==========================================
const createCategory = async (userId, categoryData) => {
    try {
        const { name, type } = categoryData;
        
        // Check if category already exists for user
        const existingResult = await db.query(
            `SELECT id FROM categories 
             WHERE user_id = $1 AND LOWER(name) = LOWER($2)`,
            [userId, name]
        );
        
        if (existingResult.rows.length > 0) {
            throw new Error('Category with this name already exists');
        }
        
        // Insert new category
        const result = await db.query(
            `INSERT INTO categories (id, name, type, user_id, is_default, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, false, NOW(), NOW())
             RETURNING id, name, type, user_id, is_default, created_at, updated_at`,
            [name, type, userId]
        );
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in createCategory:', error);
        throw error;
    }
};

// ==========================================
// GET CATEGORY BY ID
// ==========================================
const getCategoryById = async (userId, categoryId) => {
    try {
        const result = await db.query(
            `SELECT id, name, type, user_id, is_default, created_at, updated_at
             FROM categories
             WHERE id = $1 AND (user_id = $2 OR is_default = true)`,
            [categoryId, userId]
        );
        
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        throw error;
    }
};

module.exports = {
    getUserCategories,
    initializeDefaultCategories,
    createCategory,
    getCategoryById
};
