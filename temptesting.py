<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Finance Tracker</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav id="navbar" style="display: none;">
        <div class="nav-container">
            <h2>Finance Tracker</h2>
            <div class="nav-links">
                <a href="#" onclick="showSection('dashboard')">Dashboard</a>
                <a href="#" onclick="showSection('transactions')">Transactions</a>
                <a href="#" onclick="showSection('budgets')">Budgets</a>
                <a href="#" onclick="showSection('reports')">Reports</a>
                <button onclick="logout()" class="btn-secondary">Logout</button>
            </div>
        </div>
    </nav>

    <!-- Auth Section -->
    <div id="auth-section" class="container">
        <div class="auth-box">
            <h1>Personal Finance Tracker</h1>
            
            <!-- Login Form -->
            <div id="login-form" class="form-container">
                <h2>Login</h2>
                <form id="login-form-element">
                    <input type="email" id="login-email" placeholder="Email" required>
                    <input type="password" id="login-password" placeholder="Password" required>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
                <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
            </div>

            <!-- Register Form -->
            <div id="register-form" class="form-container" style="display: none;">
                <h2>Register</h2>
                <form id="register-form-element">
                    <input type="text" id="register-name" placeholder="Full Name" required>
                    <input type="email" id="register-email" placeholder="Email" required>
                    <input type="password" id="register-password" placeholder="Password" required>
                    <button type="submit" class="btn-primary">Register</button>
                </form>
                <p>Already have an account? <a href="#" id="show-login">Login</a></p>
            </div>
        </div>
    </div>

    <!-- Main App Section -->
    <div id="app-section" style="display: none;">
        
        <!-- Dashboard Section -->
        <div id="dashboard-section" class="section">
            <div class="container">
                <h1>Dashboard</h1>
                <div id="dashboard-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Income</h3>
                            <p id="total-income" class="stat-value">$0.00</p>
                        </div>
                        <div class="stat-card">
                            <h3>Total Expenses</h3>
                            <p id="total-expenses" class="stat-value">$0.00</p>
                        </div>
                        <div class="stat-card">
                            <h3>Balance</h3>
                            <p id="balance" class="stat-value">$0.00</p>
                        </div>
                    </div>
                    <div class="recent-transactions">
                        <h3>Recent Transactions</h3>
                        <div id="recent-transactions-list"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transactions Section -->
        <div id="transactions-section" class="section" style="display: none;">
            <div class="container">
                <h1>Transactions</h1>
                
                <!-- Add Transaction Form -->
                <div class="form-box">
                    <h3>Add Transaction</h3>
                    <button id="show-transaction-btn" class="btn-primary">+ Add Transaction</button>
                    
                    <form id="transaction-form" style="display: none; margin-top: 20px;">
                        <select id="trans-type" required>
                            <option value="">Select Type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <select id="trans-category" required>
                            <option value="">Select Category</option>
                        </select>
                        <input type="number" step="0.01" id="trans-amount" placeholder="Amount" required>
                        <input type="date" id="trans-date" required>
                        <input type="text" id="trans-description" placeholder="Description">
                        <div class="form-buttons">
                            <button type="submit" class="btn-primary">Add</button>
                            <button type="button" id="cancel-transaction-btn" class="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>

                <!-- Transactions List -->
                <div class="transactions-list">
                    <h3>All Transactions</h3>
                    <div id="transactions-list"></div>
                </div>
            </div>
        </div>

        <!-- Budgets Section -->
        <div id="budgets-section" class="section" style="display: none;">
            <div class="container">
                <h1>Budgets</h1>
                
                <div class="form-box">
                    <h3>Create Budget</h3>
                    <button onclick="showAddBudgetForm()" class="btn-primary">+ Create Budget</button>
                    
                    <form id="budget-form" style="display: none; margin-top: 20px;" onsubmit="addBudget(event)">
                        <select id="budget-category" required>
                            <option value="">Select Category (Optional)</option>
                        </select>
                        <input type="number" step="0.01" id="budget-amount" placeholder="Budget Amount" required>
                        <select id="budget-period" required>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input type="date" id="budget-start" required>
                        <input type="date" id="budget-end" required>
                        <div class="form-buttons">
                            <button type="submit" class="btn-primary">Create</button>
                            <button type="button" onclick="cancelBudgetForm()" class="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="budgets-list">
                    <h3>Active Budgets</h3>
                    <div id="budgets-list"></div>
                </div>
            </div>
        </div>

        <!-- Reports Section -->
        <div id="reports-section" class="section" style="display: none;">
            <div class="container">
                <h1>Reports</h1>
                
                <div class="form-box">
                    <h3>Generate Report</h3>
                    <form onsubmit="generateReport(event)">
                        <select id="report-type" required>
                            <option value="monthly">Monthly Report</option>
                            <option value="yearly">Yearly Report</option>
                        </select>
                        <input type="number" id="report-year" placeholder="Year (e.g., 2026)" required>
                        <input type="number" id="report-month" placeholder="Month (1-12)" min="1" max="12">
                        <button type="submit" class="btn-primary">Generate</button>
                    </form>
                </div>

                <div id="report-content"></div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast"></div>

    <script src="app.js"></script>
</body>
</html>




















// API Base URL
const API_URL = 'http://localhost:5000/api';

// Token management
let token = localStorage.getItem('token');
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('========= APP LOADED =========');
    console.log('Token:', token);
    
    // Attach event listeners to forms
    const loginForm = document.getElementById('login-form-element');
    const registerForm = document.getElementById('register-form-element');
    
    if (loginForm) {
        console.log('Login form found, attaching listener');
        loginForm.addEventListener('submit', login);
    } else {
        console.error('Login form NOT found!');
    }
    
    if (registerForm) {
        console.log('Register form found, attaching listener');
        registerForm.addEventListener('submit', register);
    } else {
        console.error('Register form NOT found!');
    }
    
    // Attach event listeners to auth toggle links
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuth();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuth();
        });
    }
    
    if (token) {
        loadApp();
    } else {
        console.log('No token found, showing login');
    }
});

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `show ${type}`;
    setTimeout(() => {
        toast.className = '';
    }, 3000);
}

// Toggle between login and register
function toggleAuth() {
    console.log('Toggling auth form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        console.log('Showing login form');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        console.log('Showing register form');
    }
}

// Register
async function register(e) {
    e.preventDefault();
    console.log('Register function called');
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    console.log('Registration data:', { name, email });
    
    try {
        console.log('Sending registration request to:', `${API_URL}/auth/register`);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                full_name: name,
                email,
                password
            })
        });
        
        const data = await response.json();
        console.log('Registration response:', data);
        
        if (data.success) {
            showToast('Registration successful! Please login.');
            toggleAuth();
            // Clear form
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

// Login
async function login(e) {
    e.preventDefault();
    console.log('Login function called');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    console.log('Login data:', { email });
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (data.success) {
            token = data.data.token;
            localStorage.setItem('token', token);
            showToast('Login successful!');
            loadApp();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    token = null;
    localStorage.removeItem('token');
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    showToast('Logged out successfully');
}

// Load app after login
async function loadApp() {
    try {
        // Get user profile
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data;
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('app-section').style.display = 'block';
            document.getElementById('navbar').style.display = 'block';
            
            // Attach event listeners for app
            attachAppEventListeners();
            
            // Initialize categories and load dashboard
            await initializeCategories();
            showSection('dashboard');
        } else {
            logout();
        }
    } catch (error) {
        showToast('Error loading app: ' + error.message, 'error');
        logout();
    }
}

// Attach event listeners for app sections
function attachAppEventListeners() {
    console.log('Attaching app event listeners...');
    
    // Transaction form listeners
    const showTransactionBtn = document.getElementById('show-transaction-btn');
    const transactionForm = document.getElementById('transaction-form');
    const cancelTransactionBtn = document.getElementById('cancel-transaction-btn');
    
    if (showTransactionBtn) {
        showTransactionBtn.addEventListener('click', showAddTransactionForm);
        console.log('Transaction button listener attached');
    }
    
    if (transactionForm) {
        transactionForm.addEventListener('submit', addTransaction);
        console.log('Transaction form listener attached');
    }
    
    if (cancelTransactionBtn) {
        cancelTransactionBtn.addEventListener('click', cancelTransactionForm);
    }
}

// Initialize default categories
async function initializeCategories() {
    try {
        await fetch(`${API_URL}/categories/initialize`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error initializing categories:', error);
    }
}

// Show section
function showSection(section) {
    console.log('Showing section:', section);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Load section data
    if (section === 'dashboard') loadDashboard();
    if (section === 'transactions') loadTransactions();
    if (section === 'budgets') loadBudgets();
}

// Load Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const dashboard = data.data;
            document.getElementById('total-income').textContent = `$${dashboard.totalIncome.toFixed(2)}`;
            document.getElementById('total-expenses').textContent = `$${dashboard.totalExpenses.toFixed(2)}`;
            document.getElementById('balance').textContent = `$${dashboard.balance.toFixed(2)}`;
            
            // Recent transactions
            const recentList = document.getElementById('recent-transactions-list');
            recentList.innerHTML = dashboard.recentTransactions.map(t => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <strong>${t.Category.name}</strong>
                        <div class="transaction-date">${new Date(t.transaction_date).toLocaleDateString()}</div>
                        <div>${t.description || ''}</div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'income' ? '+' : '-'}$${parseFloat(t.amount).toFixed(2)}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showToast('Error loading dashboard: ' + error.message, 'error');
    }
}

// Load Transactions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const list = document.getElementById('transactions-list');
            list.innerHTML = data.data.transactions.map(t => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <strong>${t.Category.name}</strong>
                        <div class="transaction-date">${new Date(t.transaction_date).toLocaleDateString()}</div>
                        <div>${t.description || ''}</div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'income' ? '+' : '-'}$${parseFloat(t.amount).toFixed(2)}
                    </div>
                </div>
            `).join('');
        }
        
        // Load categories for dropdown
        await loadCategories();
    } catch (error) {
        showToast('Error loading transactions: ' + error.message, 'error');
    }
}

// Load categories for dropdowns
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const transCategory = document.getElementById('trans-category');
            const budgetCategory = document.getElementById('budget-category');
            
            const options = data.data.map(c => 
                `<option value="${c.id}">${c.name} (${c.type})</option>`
            ).join('');
            
            transCategory.innerHTML = '<option value="">Select Category</option>' + options;
            budgetCategory.innerHTML = '<option value="">Select Category (Optional)</option>' + options;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Show/hide transaction form
function showAddTransactionForm() {
    console.log('Showing transaction form');
    document.getElementById('transaction-form').style.display = 'block';
    // Set today's date
    document.getElementById('trans-date').valueAsDate = new Date();
}

function cancelTransactionForm() {
    console.log('Canceling transaction form');
    document.getElementById('transaction-form').style.display = 'none';
    document.getElementById('transaction-form').reset();
}

// Add Transaction
async function addTransaction(e) {
    e.preventDefault();
    console.log('Add Transaction function called');
    
    const type = document.getElementById('trans-type').value;
    const category_id = document.getElementById('trans-category').value;
    const amount = document.getElementById('trans-amount').value;
    const transaction_date = document.getElementById('trans-date').value;
    const description = document.getElementById('trans-description').value;
    
    console.log('Transaction data:', { type, category_id, amount, transaction_date, description });
    
    try {
        console.log('Sending transaction to:', `${API_URL}/transactions`);
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                type, 
                category_id, 
                amount: parseFloat(amount),
                transaction_date,
                description
            })
        });
        
        const data = await response.json();
        console.log('Transaction response:', data);
        
        if (data.success) {
            showToast('Transaction added successfully!');
            cancelTransactionForm();
            loadTransactions();
        } else {
            showToast(data.message || 'Failed to add transaction', 'error');
        }
    } catch (error) {
        console.error('Transaction error:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

// Load Budgets
async function loadBudgets() {
    try {
        const response = await fetch(`${API_URL}/budgets`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const list = document.getElementById('budgets-list');
            list.innerHTML = data.data.map(b => {
                const percentage = (b.spent / b.amount) * 100;
                const progressClass = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : '';
                
                return `
                    <div class="budget-item">
                        <div class="budget-info">
                            <strong>${b.Category ? b.Category.name : 'Overall Budget'}</strong>
                            <div class="budget-period">${b.period} - ${new Date(b.start_date).toLocaleDateString()} to ${new Date(b.end_date).toLocaleDateString()}</div>
                            <div class="budget-progress">
                                <div>Spent: $${b.spent.toFixed(2)} / $${parseFloat(b.amount).toFixed(2)}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill ${progressClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Load categories for dropdown
        await loadCategories();
    } catch (error) {
        showToast('Error loading budgets: ' + error.message, 'error');
    }
}

// Show/hide budget form
function showAddBudgetForm() {
    document.getElementById('budget-form').style.display = 'block';
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('budget-start').valueAsDate = firstDay;
    document.getElementById('budget-end').valueAsDate = lastDay;
}

function cancelBudgetForm() {
    document.getElementById('budget-form').style.display = 'none';
    document.getElementById('budget-form').reset();
}

// Add Budget
async function addBudget(e) {
    e.preventDefault();
    
    const category_id = document.getElementById('budget-category').value || null;
    const amount = document.getElementById('budget-amount').value;
    const period = document.getElementById('budget-period').value;
    const start_date = document.getElementById('budget-start').value;
    const end_date = document.getElementById('budget-end').value;
    
    try {
        const response = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                category_id, 
                amount: parseFloat(amount),
                period,
                start_date,
                end_date
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Budget created successfully!');
            cancelBudgetForm();
            loadBudgets();
        } else {
            showToast(data.message || 'Failed to create budget', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// Generate Report
async function generateReport(e) {
    e.preventDefault();
    
    const type = document.getElementById('report-type').value;
    const year = document.getElementById('report-year').value;
    const month = document.getElementById('report-month').value;
    
    try {
        let url = `${API_URL}/reports/${type}?year=${year}`;
        if (type === 'monthly' && month) {
            url += `&month=${month}`;
        }
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const report = data.data;
            const content = document.getElementById('report-content');
            
            content.innerHTML = `
                <h3>${type === 'monthly' ? 'Monthly' : 'Yearly'} Report</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Income</h3>
                        <p class="stat-value income">$${report.totalIncome.toFixed(2)}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Expenses</h3>
                        <p class="stat-value expense">$${report.totalExpenses.toFixed(2)}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Net Balance</h3>
                        <p class="stat-value">${report.balance >= 0 ? '+' : ''}$${report.balance.toFixed(2)}</p>
                    </div>
                </div>
                
                <h4>Expenses by Category</h4>
                ${report.expensesByCategory.map(cat => `
                    <div class="transaction-item">
                        <div>${cat.category}</div>
                        <div class="expense">$${parseFloat(cat.amount).toFixed(2)}</div>
                    </div>
                `).join('')}
            `;
            
            showToast('Report generated successfully!');
        } else {
            showToast(data.message || 'Failed to generate report', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}
