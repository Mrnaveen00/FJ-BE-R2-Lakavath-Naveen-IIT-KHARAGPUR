// ==========================================
// BUDGET CONTROLLER
// Handles budget-related HTTP requests
// ==========================================

const budgetService = require('../Services/budget.service');
const responseHandler = require('../Utils/responseHandler');

// ==========================================
// GET ALL BUDGETS
// ==========================================
const getBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('💰 Getting budgets for user:', userId);
        
        const budgets = await budgetService.getUserBudgets(userId);
        
        console.log(`✅ Retrieved ${budgets.length} budgets`);
        
        return responseHandler.success(
            res,
            budgets,
            'Budgets retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getBudgets:', error);
        return responseHandler.error(
            res,
            'Failed to load budgets',
            500
        );
    }
};

// ==========================================
// CREATE BUDGET
// ==========================================
const createBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { category_id, amount, period, start_date, end_date } = req.body;
        
        console.log('💰 Create Budget Request:', {
            userId,
            body: req.body
        });
        
        // Validation
        if (!category_id || !amount || !period || !start_date || !end_date) {
            return responseHandler.error(
                res,
                'Category, amount, period, start date, and end date are required',
                400
            );
        }
        
        if (!['monthly', 'yearly'].includes(period)) {
            return responseHandler.error(
                res,
                'Period must be either monthly or yearly',
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
        
        const budget = await budgetService.createBudget(userId, {
            category_id,
            amount: parseFloat(amount),
            period,
            start_date,
            end_date
        });
        
        console.log('✅ Budget created successfully');
        
        return responseHandler.success(
            res,
            budget,
            'Budget created successfully',
            201
        );
        
    } catch (error) {
        console.error('❌ Error in createBudget:', error);
        
        if (error.message.includes('already exists')) {
            return responseHandler.error(
                res,
                error.message,
                400
            );
        }
        
        return responseHandler.error(
            res,
            `Failed to create budget: ${error.message}`,
            500
        );
    }
};

// ==========================================
// GET BUDGET BY ID
// ==========================================
const getBudgetById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        console.log('💰 Getting budget:', id);
        
        const budget = await budgetService.getBudgetById(userId, id);
        
        if (!budget) {
            return responseHandler.notFound(
                res,
                'Budget not found'
            );
        }
        
        console.log('✅ Budget retrieved');
        
        return responseHandler.success(
            res,
            budget,
            'Budget retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getBudgetById:', error);
        return responseHandler.error(
            res,
            'Failed to load budget',
            500
        );
    }
};

// ==========================================
// UPDATE BUDGET
// ==========================================
const updateBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { category_id, amount, period, start_date, end_date } = req.body;
        
        console.log('💰 Updating budget:', id);
        
        const updateData = {};
        if (category_id) updateData.category_id = category_id;
        if (amount) updateData.amount = parseFloat(amount);
        if (period) updateData.period = period;
        if (start_date) updateData.start_date = start_date;
        if (end_date) updateData.end_date = end_date;
        
        const budget = await budgetService.updateBudget(userId, id, updateData);
        
        console.log('✅ Budget updated successfully');
        
        return responseHandler.success(
            res,
            budget,
            'Budget updated successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in updateBudget:', error);
        
        if (error.message === 'Budget not found') {
            return responseHandler.notFound(
                res,
                'Budget not found'
            );
        }
        
        return responseHandler.error(
            res,
            'Failed to update budget',
            500
        );
    }
};

// ==========================================
// DELETE BUDGET
// ==========================================
const deleteBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        console.log('💰 Deleting budget:', id);
        
        await budgetService.deleteBudget(userId, id);
        
        console.log('✅ Budget deleted successfully');
        
        return responseHandler.success(
            res,
            null,
            'Budget deleted successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in deleteBudget:', error);
        
        if (error.message === 'Budget not found') {
            return responseHandler.notFound(
                res,
                'Budget not found'
            );
        }
        
        return responseHandler.error(
            res,
            'Failed to delete budget',
            500
        );
    }
};

module.exports = {
    getBudgets,
    createBudget,
    getBudgetById,
    updateBudget,
    deleteBudget
};
