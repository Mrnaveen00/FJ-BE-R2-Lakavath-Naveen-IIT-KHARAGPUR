// ==========================================
// RESPONSE HANDLER UTILITY
// Standardized API response formatting
// ==========================================

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details
 */
const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message: message
    };
    
    if (errors) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 */
const validationError = (res, errors) => {
    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
    });
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const notFound = (res, message = 'Resource not found') => {
    return res.status(404).json({
        success: false,
        message: message
    });
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const unauthorized = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
        success: false,
        message: message
    });
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
const forbidden = (res, message = 'Access forbidden') => {
    return res.status(403).json({
        success: false,
        message: message
    });
};

module.exports = {
    success,
    error,
    validationError,
    notFound,
    unauthorized,
    forbidden
};
