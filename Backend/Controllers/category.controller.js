// ==========================================
// CATEGORY CONTROLLER
// Handles category-related HTTP requests
// ==========================================

const categoryService = require('../Services/category.service');
const responseHandler = require('../Utils/responseHandler');

// ==========================================
// GET ALL CATEGORIES
// ==========================================
const getCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('📂 Getting categories for user:', userId);
        
        const categories = await categoryService.getUserCategories(userId);
        
        console.log(`✅ Retrieved ${categories.length} categories`);
        
        return responseHandler.success(
            res,
            categories,
            'Categories retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getCategories:', error);
        return responseHandler.error(
            res,
            'Failed to load categories',
            500
        );
    }
};

// ==========================================
// INITIALIZE DEFAULT CATEGORIES
// ==========================================
const initializeCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('🔧 Initializing default categories for user:', userId);
        
        const result = await categoryService.initializeDefaultCategories(userId);
        
        console.log('✅ Default categories initialized');
        
        return responseHandler.success(
            res,
            result,
            'Default categories initialized successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in initializeCategories:', error);
        return responseHandler.error(
            res,
            'Failed to initialize categories',
            500
        );
    }
};

// ==========================================
// CREATE CUSTOM CATEGORY
// ==========================================
const createCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, type, icon, color } = req.body;
        
        // Validation
        if (!name || !type) {
            return responseHandler.error(
                res,
                'Name and type are required',
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
        
        console.log('📂 Creating custom category:', name);
        
        const category = await categoryService.createCategory(userId, {
            name,
            type,
            icon,
            color
        });
        
        console.log('✅ Category created successfully');
        
        return responseHandler.success(
            res,
            category,
            'Category created successfully',
            201
        );
        
    } catch (error) {
        console.error('❌ Error in createCategory:', error);
        
        if (error.message.includes('already exists')) {
            return responseHandler.error(
                res,
                error.message,
                400
            );
        }
        
        return responseHandler.error(
            res,
            'Failed to create category',
            500
        );
    }
};

module.exports = {
    getCategories,
    initializeCategories,
    createCategory
};
