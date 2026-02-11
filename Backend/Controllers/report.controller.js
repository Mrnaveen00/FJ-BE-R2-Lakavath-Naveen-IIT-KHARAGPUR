// ==========================================
// REPORT CONTROLLER
// Handles report-related HTTP requests
// ==========================================

const reportService = require('../Services/report.service');
const responseHandler = require('../Utils/responseHandler');

// ==========================================
// GET MONTHLY REPORT
// ==========================================
const getMonthlyReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { year, month } = req.query;
        
        console.log('📊 Getting monthly report for user:', userId);
        
        // If no year/month provided, use current year and get all months
        const currentYear = year ? parseInt(year) : new Date().getFullYear();
        
        let report;
        
        if (month) {
            // Get specific month report
            const monthNum = parseInt(month);
            if (monthNum < 1 || monthNum > 12) {
                return responseHandler.error(
                    res,
                    'Month must be between 1 and 12',
                    400
                );
            }
            report = await reportService.getMonthlyReport(userId, currentYear, monthNum);
        } else {
            // Get all months for the year
            report = await reportService.getYearlyMonthlyReport(userId, currentYear);
        }
        
        console.log('✅ Monthly report retrieved successfully');
        
        return responseHandler.success(
            res,
            report,
            'Monthly report retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getMonthlyReport:', error);
        return responseHandler.error(
            res,
            'Failed to generate monthly report',
            500
        );
    }
};

// ==========================================
// GET YEARLY REPORT
// ==========================================
const getYearlyReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { year } = req.query;
        
        const reportYear = year ? parseInt(year) : new Date().getFullYear();
        
        console.log(`📊 Getting yearly report for user ${userId}, year: ${reportYear}`);
        
        const report = await reportService.getYearlyReport(userId, reportYear);
        
        console.log('✅ Yearly report retrieved successfully');
        
        return responseHandler.success(
            res,
            report,
            'Yearly report retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getYearlyReport:', error);
        return responseHandler.error(
            res,
            'Failed to generate yearly report',
            500
        );
    }
};

// ==========================================
// GET CATEGORY REPORT
// ==========================================
const getCategoryReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { start_date, end_date } = req.query;
        
        console.log('📊 Getting category report for user:', userId);
        
        const report = await reportService.getCategoryReport(userId, start_date, end_date);
        
        console.log('✅ Category report retrieved successfully');
        
        return responseHandler.success(
            res,
            report,
            'Category report retrieved successfully'
        );
        
    } catch (error) {
        console.error('❌ Error in getCategoryReport:', error);
        return responseHandler.error(
            res,
            'Failed to generate category report',
            500
        );
    }
};

module.exports = {
    getMonthlyReport,
    getYearlyReport,
    getCategoryReport
};
