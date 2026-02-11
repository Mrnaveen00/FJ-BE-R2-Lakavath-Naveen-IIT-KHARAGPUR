// ==========================================
// DASHBOARD CONTROLLER
// Handles dashboard-related HTTP requests
// ==========================================

const dashboardService = require('../Services/dashboard.service');
const responseHandler = require('../Utils/responseHandler');

// ==========================================
// GET DASHBOARD DATA
// ==========================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('📊 Getting dashboard data for user:', userId);
        
        // Get dashboard data from service
        const dashboardData = await dashboardService.getDashboardData(userId);
        
        console.log('✅ Dashboard data retrieved successfully');
        
        return responseHandler.success(
            res,
            dashboardData,
            'Dashboard data retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getDashboard:', error);
        return responseHandler.error(
            res,
            'Failed to load dashboard data',
            500
        );
    }
};

// ==========================================
// GET MONTHLY SUMMARY
// ==========================================
const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { year, month } = req.query;
        
        // Validation
        if (!year || !month) {
            return responseHandler.error(
                res,
                'Year and month are required',
                400
            );
        }
        
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        
        if (monthNum < 1 || monthNum > 12) {
            return responseHandler.error(
                res,
                'Month must be between 1 and 12',
                400
            );
        }
        
        console.log(`📊 Getting monthly summary for user ${userId}: ${year}-${month}`);
        
        // Get monthly summary from service
        const monthlySummary = await dashboardService.getMonthlySummary(
            userId,
            yearNum,
            monthNum
        );
        
        console.log('✅ Monthly summary retrieved successfully');
        
        return responseHandler.success(
            res,
            monthlySummary,
            'Monthly summary retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getMonthlySummary:', error);
        return responseHandler.error(
            res,
            'Failed to load monthly summary',
            500
        );
    }
};

module.exports = {
    getDashboard,
    getMonthlySummary
};
