// ==========================================
// AUTHENTICATION MIDDLEWARE
// Verify JWT tokens and protect routes
// ==========================================

const authService = require('../Services/auth.service');

// ==========================================
// VERIFY TOKEN - Middleware to protect routes
// ==========================================
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }
    
    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Verify token
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
    
    // Attach user data to request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  verifyToken,
};
