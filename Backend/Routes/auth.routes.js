// ==========================================
// AUTHENTICATION ROUTES
// Define API endpoints for authentication
// ==========================================

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const passport = require('../Config/passport');

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/check-email
// @desc    Check if email is available
// @access  Public
router.get('/check-email', authController.checkEmail);

// ==========================================
// OAUTH ROUTES
// ==========================================

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=oauth_failed'
  }),
  authController.googleCallback
);

// ==========================================
// PROTECTED ROUTES (Authentication required)
// ==========================================

// @route   GET /api/auth/profile
// @desc    Get authenticated user profile
// @access  Private
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

// ==========================================
// EXPORTS
// ==========================================
module.exports = router;
