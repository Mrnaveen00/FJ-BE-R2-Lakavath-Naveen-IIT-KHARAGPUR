// ==========================================
// DASHBOARD MODULE
// Handles dashboard data and UI
// ==========================================

// State
let currentUser = null;
let dashboardData = null;
let financeChart = null; // Store chart instance

// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================
async function initializeDashboard() {
    console.log('📊 Initializing Dashboard...');
    
    try {
        // Get user profile first
        await loadUserProfile();
        
        // Load dashboard data
        await loadDashboardData();
        
        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Dashboard initialization failed:', error);
        showToast('Failed to load dashboard', 'error');
    }
}

// ==========================================
// LOAD USER PROFILE
// ==========================================
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data;
            console.log('👤 User profile loaded:', currentUser);
            
            // Update UI with user name
            const userNameElement = document.getElementById('user-name');
            if (userNameElement && currentUser.full_name) {
                userNameElement.textContent = currentUser.full_name;
            }
        } else {
            console.error('Failed to load profile:', data.message);
            // If unauthorized, logout
            if (response.status === 401) {
                handleLogout();
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// ==========================================
// LOAD DASHBOARD DATA
// ==========================================
async function loadDashboardData() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            dashboardData = data.data;
            console.log('📊 Dashboard data loaded:', dashboardData);
            
            // Update dashboard UI
            updateDashboardUI(dashboardData);
        } else {
            console.error('Failed to load dashboard data:', data.message);
            showToast(data.message || 'Failed to load dashboard data', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showToast('Unable to connect to server', 'error');
        
        // Set default values
        updateDashboardUI({
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
            recentTransactions: []
        });
    }
}

// ==========================================
// UPDATE DASHBOARD UI
// ==========================================
function updateDashboardUI(data) {
    console.log('🎨 Updating dashboard UI with data:', data);
    
    // Update stat cards
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    
    if (totalIncomeEl) {
        totalIncomeEl.textContent = `$${formatCurrency(data.totalIncome || 0)}`;
    }
    
    if (totalExpensesEl) {
        totalExpensesEl.textContent = `$${formatCurrency(data.totalExpenses || 0)}`;
    }
    
    if (balanceEl) {
        const balance = (data.totalIncome || 0) - (data.totalExpenses || 0);
        balanceEl.textContent = `$${formatCurrency(balance)}`;
        
        // Apply color based on balance
        balanceEl.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--error-color)';
    }
    
    // Update recent transactions
    updateRecentTransactions(data.recentTransactions || []);
    
    // Update chart
    renderFinanceChart(data);
}

// ==========================================
// RENDER FINANCE CHART
// ==========================================
function renderFinanceChart(data) {
    const ctx = document.getElementById('financeChart');
    
    if (!ctx) {
        console.error('❌ Chart canvas not found');
        return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded');
        return;
    }
    
    console.log('📊 Rendering finance chart with data:', data);
    
    // Destroy existing chart if it exists
    if (financeChart) {
        financeChart.destroy();
    }
    
    const totalIncome = data.totalIncome || 0;
    const totalExpenses = data.totalExpenses || 0;
    const balance = totalIncome - totalExpenses;
    
    console.log('📊 Chart values - Income:', totalIncome, 'Expenses:', totalExpenses, 'Balance:', balance);
    
    // Create new chart
    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Balance'],
            datasets: [{
                label: 'Amount ($)',
                data: [totalIncome, totalExpenses, balance],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',   // Green for income
                    'rgba(239, 68, 68, 0.7)',   // Red for expenses
                    balance >= 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(245, 158, 11, 0.7)' // Blue/Orange for balance
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    balance >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// UPDATE RECENT TRANSACTIONS
// ==========================================
function updateRecentTransactions(transactions) {
    const container = document.getElementById('recent-transactions-list');
    
    if (!container) return;
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="empty-state">No transactions yet. Add your first transaction!</p>';
        return;
    }
    
    // Generate transaction items HTML
    const transactionsHTML = transactions.map(transaction => {
        const date = new Date(transaction.transaction_date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const categoryName = transaction.Category?.name || 'Uncategorized';
        const type = transaction.type;
        const amount = parseFloat(transaction.amount);
        const description = transaction.description || '';
        
        return `
            <div class="transaction-item ${type}">
                <div class="transaction-icon">
                    ${type === 'income' ? '📥' : '📤'}
                </div>
                <div class="transaction-info">
                    <div class="transaction-title">${categoryName}</div>
                    <div class="transaction-date">${formattedDate}</div>
                    ${description ? `<div class="transaction-description">${description}</div>` : ''}
                </div>
                <div class="transaction-amount ${type}">
                    ${type === 'income' ? '+' : '-'}$${formatCurrency(amount)}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = transactionsHTML;
}

// ==========================================
// NAVIGATION - SHOW SECTION
// ==========================================
function showSection(sectionName) {
    console.log(`🔄 Switching to section: ${sectionName}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`.nav-link[onclick*="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Load section-specific data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'transactions') {
        // Initialize transactions page if function exists
        if (typeof initializeTransactionsPage === 'function') {
            initializeTransactionsPage();
        }
    } else if (sectionName === 'reports') {
        // Initialize reports page if function exists
        if (typeof initializeReportsPage === 'function') {
            initializeReportsPage();
        }
    } else if (sectionName === 'budgets') {
        // Initialize budgets page if function exists
        if (typeof initializeBudgetsPage === 'function') {
            initializeBudgetsPage();
        }
    }
}

// ==========================================
// LOGOUT HANDLER
// ==========================================
function handleLogout() {
    console.log('🚪 Logging out...');
    
    // Clear token and user data
    localStorage.removeItem('token');
    currentUser = null;
    dashboardData = null;
    
    // Hide app section and navbar
    const appSection = document.getElementById('app-section');
    const navbar = document.getElementById('navbar');
    const authSection = document.getElementById('auth-section');
    
    if (appSection) appSection.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
    if (authSection) authSection.style.display = 'flex';
    
    // Show toast
    showToast('Logged out successfully', 'success');
    
    console.log('✅ Logged out successfully');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
}

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ==========================================
// These functions can be called from HTML onclick attributes
window.showSection = showSection;
window.handleLogout = handleLogout;
window.initializeDashboard = initializeDashboard;
