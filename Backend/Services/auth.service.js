// ==========================================
// AUTHENTICATION SERVICE
// Business logic for authentication operations
// ==========================================

const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ==========================================
// EMAIL CHECK - Check if email already exists
// ==========================================
const checkEmailExists = async (email) => {
  try {
    const result = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    
    return result.rows.length > 0; // Returns true if user exists
  } catch (error) {
    console.error('Error checking email:', error);
    throw new Error('Error checking email availability');
  }
};

// ==========================================
// REGISTER USER - Create new user account
// ==========================================
const registerUser = async (userData) => {
  const { full_name, email, password } = userData;
  
  try {
    // 1. Check if email already exists
    const emailExists = await checkEmailExists(email);
    
    if (emailExists) {
      return {
        success: false,
        message: 'Email already registered. Please login instead.',
        statusCode: 400,
      };
    }
    
    // 2. Validate password length
    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long',
        statusCode: 400,
      };
    }
    
    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 4. Insert new user into database
    const result = await db.query(
      `INSERT INTO users (id, full_name, email, password, last_login, created_at, updated_at) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) 
       RETURNING id, full_name, email, profile_picture`,
      [full_name.trim(), email.toLowerCase().trim(), hashedPassword, new Date()]
    );
    
    const newUser = result.rows[0];
    
    // 5. Generate JWT token
    const token = generateToken(newUser.id);
    
    return {
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          profile_picture: newUser.profile_picture,
        },
      },
      statusCode: 201,
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return {
        success: false,
        message: 'Email already registered. Please login instead.',
        statusCode: 400,
      };
    }
    
    return {
      success: false,
      message: 'Registration failed. Please try again.',
      statusCode: 500,
    };
  }
};

// ==========================================
// LOGIN USER - Authenticate existing user
// ==========================================
const loginUser = async (credentials) => {
  const { email, password } = credentials;
  
  try {
    // 1. Find user by email
    const result = await db.query(
      'SELECT id, full_name, email, password, profile_picture, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      };
    }
    
    const user = result.rows[0];
    
    // 2. Check if account is active
    if (!user.is_active) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact support.',
        statusCode: 403,
      };
    }
    
    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      };
    }
    
    // 4. Generate JWT token
    const token = generateToken(user.id);
    
    // 5. Update last login
    await db.query(
      'UPDATE users SET last_login = $1, updated_at = NOW() WHERE id = $2',
      [new Date(), user.id]
    );
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
      },
      statusCode: 200,
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.',
      statusCode: 500,
    };
  }
};

// ==========================================
// GET USER PROFILE - Get user details by ID
// ==========================================
const getUserProfile = async (userId) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, profile_picture, google_id, is_active, last_login, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }
    
    return {
      success: true,
      data: result.rows[0],
      statusCode: 200,
    };
    
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      message: 'Failed to fetch user profile',
      statusCode: 500,
    };
  }
};

// ==========================================
// GENERATE JWT TOKEN
// ==========================================
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// ==========================================
// VERIFY JWT TOKEN
// ==========================================
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  checkEmailExists,
  registerUser,
  loginUser,
  getUserProfile,
  generateToken,
  verifyToken,
};
