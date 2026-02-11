// ==========================================
// AUTHENTICATION MODULE
// Handles login and registration
// ==========================================

// Configuration
const API_URL = 'http://localhost:5000/api';

// State Management
let token = localStorage.getItem('token');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Auth Module Loaded');
    console.log('Token exists:', !!token);
    
    initializeAuthForms();
    
    // If user already has token, load dashboard
    if (token) {
        console.log('User already logged in, loading dashboard...');
        loadDashboard();
    }
});

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================
function initializeAuthForms() {
    // Get form elements
    const loginFormElement = document.getElementById('login-form-element');
    const registerFormElement = document.getElementById('register-form-element');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    // Attach form submit listeners
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
        console.log('✅ Login form listener attached');
    }
    
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
        console.log('✅ Register form listener attached');
    }
    
    // Attach toggle listeners
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForms('register');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForms('login');
        });
    }
}

// ==========================================
// AUTH FORM TOGGLE
// ==========================================
function toggleAuthForms(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (formType === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        console.log('📝 Showing registration form');
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        console.log('🔐 Showing login form');
    }
}

// ==========================================
// REGISTER HANDLER
// ==========================================
async function handleRegister(e) {
    e.preventDefault();
    console.log('📝 Registration initiated');
    
    // Get form values
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    // Basic validation
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Prepare data
    const registrationData = {
        full_name: name,
        email: email,
        password: password
    };
    
    console.log('Sending registration data:', { full_name: name, email });
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        
        // Make API call
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });
        
        const data = await response.json();
        console.log('Registration response:', data);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Handle response
        if (data.success) {
            showToast('✅ Registration successful! Please login.', 'success');
            
            // Clear form
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            
            // Option 1: Auto-login after registration
            // Store token and load dashboard directly
            token = data.data.token;
            localStorage.setItem('token', token);
            
            setTimeout(() => {
                loadDashboard();
            }, 1000);
            
            /* Option 2: Switch to login form (commented out)
            setTimeout(() => {
                toggleAuthForms('login');
                // Pre-fill email in login form
                document.getElementById('login-email').value = email;
            }, 1500);
            */
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        showToast('Unable to connect to server. Please try again.', 'error');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Register';
        submitBtn.disabled = false;
    }
}

// ==========================================
// LOGIN HANDLER
// ==========================================
async function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 Login initiated');
    
    // Get form values
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Prepare data
    const loginData = {
        email: email,
        password: password
    };
    
    console.log('Sending login data:', { email });
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Make API call
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Handle response
        if (data.success) {
            // Store token
            token = data.data.token;
            localStorage.setItem('token', token);
            
            showToast('✅ Login successful! Welcome back!', 'success');
            console.log('✅ Token saved:', token);
            
            // Clear password field
            document.getElementById('login-password').value = '';
            
            // Load dashboard
            setTimeout(() => {
                loadDashboard();
            }, 800);
            
        } else {
            showToast(data.message || 'Login failed. Check your credentials.', 'error');
        }
        
    } catch (error) {
        console.error('❌ Login error:', error);
        showToast('Unable to connect to server. Please try again.', 'error');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Set message and type
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    console.log(`📢 Toast: [${type.toUpperCase()}] ${message}`);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Get current token
function getToken() {
    return token;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!token;
}

// ==========================================
// LOAD DASHBOARD
// ==========================================
function loadDashboard() {
    console.log('🎯 Loading dashboard...');
    
    // Hide auth section
    const authSection = document.getElementById('auth-section');
    if (authSection) {
        authSection.style.display = 'none';
    }
    
    // Show app section and navbar
    const appSection = document.getElementById('app-section');
    const navbar = document.getElementById('navbar');
    
    if (appSection) {
        appSection.style.display = 'block';
    }
    
    if (navbar) {
        navbar.style.display = 'block';
    }
    
    // Initialize dashboard (from dashboard.js)
    if (typeof initializeDashboard === 'function') {
        initializeDashboard();
    } else {
        console.error('initializeDashboard function not found');
    }
    
    console.log('✅ Dashboard loaded');
}

// ==========================================
// GOOGLE OAUTH
// ==========================================

// Initiate Google OAuth login
window.loginWithGoogle = function() {
    console.log('🔐 Initiating Google OAuth...');
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
}

// Handle OAuth callback
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const authSuccess = urlParams.get('auth');
    const error = urlParams.get('error');
    
    if (error) {
        console.error('❌ OAuth error:', error);
        showToast('Login failed. Please try again.', 'error');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }
    
    if (authSuccess === 'success' && token) {
        console.log('✅ OAuth successful, token received');
        // Store token
        localStorage.setItem('token', token);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Load dashboard
        showToast('✅ Logged in successfully with Google!', 'success');
        loadDashboard();
    }
}

// Check for OAuth callback on page load
document.addEventListener('DOMContentLoaded', () => {
    handleOAuthCallback();
});
