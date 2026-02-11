// ==========================================
// AUTHENTICATION CONTROLLER
// Handles HTTP requests for authentication
// ==========================================

const authService = require('../Services/auth.service');
const jwt = require('jsonwebtoken');

// ==========================================
// REGISTER - Handle user registration
// ==========================================
const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: full_name, email, password',
      });
    }
    
    // Call service to register user
    const result = await authService.registerUser({
      full_name,
      email,
      password,
    });
    
    // Send response
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
    
  } catch (error) {
    console.error('Register controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ==========================================
// LOGIN - Handle user login
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }
    
    // Call service to login user
    const result = await authService.loginUser({
      email,
      password,
    });
    
    // Send response
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
    
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ==========================================
// GET PROFILE - Get authenticated user profile
// ==========================================
const getProfile = async (req, res) => {
  try {
    // User ID is set by auth middleware
    const userId = req.user.userId;
    
    // Call service to get user profile
    const result = await authService.getUserProfile(userId);
    
    // Send response
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
    
  } catch (error) {
    console.error('Get profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ==========================================
// CHECK EMAIL - Check if email is available
// ==========================================
const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    // Call service to check email
    const exists = await authService.checkEmailExists(email);
    
    return res.status(200).json({
      success: true,
      data: {
        exists,
        available: !exists,
      },
    });
    
  } catch (error) {
    console.error('Check email controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ==========================================
// GOOGLE OAUTH CALLBACK
// ==========================================
const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      console.error('❌ No user in Google callback');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendUrl}?error=oauth_failed`);
    }
    
    console.log('✅ Google OAuth successful for:', user.email);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    res.redirect(`${frontendUrl}?token=${token}&auth=success`);
    
  } catch (error) {
    console.error('❌ Error in Google callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    res.redirect(`${frontendUrl}?error=oauth_error`);
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  register,
  login,
  getProfile,
  checkEmail,
  googleCallback,
};
