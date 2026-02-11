// ==========================================
// BUDGETS MODULE
// Handles budget operations
// ==========================================


// State
let budgets = [];
let budgetCategories = [];

// ==========================================
// INITIALIZE BUDGETS PAGE
// ==========================================
async function initializeBudgetsPage() {
    console.log('💰 Initializing Budgets Page...');
    
    try {
        // Load categories
        await loadBudgetCategories();
        
        // Populate category dropdown
        populateBudgetCategoryDropdown();
        
        // Load budgets
        await loadBudgets();
        
        console.log('✅ Budgets page initialized');
    } catch (error) {
        console.error('❌ Failed to initialize budgets page:', error);
        showToast('Failed to load budgets', 'error');
    }
}

// ==========================================
// LOAD BUDGET CATEGORIES
// ==========================================
async function loadBudgetCategories() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Filter only expense categories for budgets
            budgetCategories = data.data.filter(cat => cat.type === 'expense');
            console.log(`✅ Loaded ${budgetCategories.length} expense categories`);
        }
    } catch (error) {
        console.error('❌ Error loading categories:', error);
    }
}

// ==========================================
// POPULATE BUDGET CATEGORY DROPDOWN
// ==========================================
function populateBudgetCategoryDropdown() {
    const categorySelect = document.getElementById('budget-category');
    
    if (!categorySelect) return;
    
    // Clear existing options except the first one
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add expense categories
    budgetCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// ==========================================
// LOAD BUDGETS
// ==========================================
async function loadBudgets() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/budgets`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            budgets = data.data;
            console.log(`✅ Loaded ${budgets.length} budgets`);
            displayBudgets(budgets);
        } else {
            console.error('Failed to load budgets:', data.message);
            showToast(data.message || 'Failed to load budgets', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading budgets:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// DISPLAY BUDGETS
// ==========================================
function displayBudgets(budgetsList) {
    const container = document.getElementById('budgets-list');
    
    if (!container) return;
    
    if (budgetsList.length === 0) {
        container.innerHTML = '<p class="empty-state">No budgets set yet. Create your first budget!</p>';
        return;
    }
    
    const budgetsHTML = budgetsList.map(budget => {
        const percentage = budget.percentage || 0;
        const categoryName = budget.Category?.name || 'Uncategorized';
        const status = budget.status || 'good';
        
        // Determine progress bar color
        let progressColor = '#22c55e'; // green
        if (status === 'warning') progressColor = '#f59e0b'; // orange
        if (status === 'exceeded') progressColor = '#ef4444'; // red
        
        const startDate = new Date(budget.start_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        const endDate = new Date(budget.end_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        return `
            <div class="budget-card ${status}">
                <div class="budget-header">
                    <div class="budget-info">
                        <h3>${categoryName}</h3>
                        <p class="budget-period">${budget.period} • ${startDate} - ${endDate}</p>
                    </div>
                    <div class="budget-actions">
                        <button onclick="deleteBudget('${budget.id}')" class="btn-delete" title="Delete">
                            ✕
                        </button>
                    </div>
                </div>
                
                <div class="budget-amounts">
                    <div class="amount-item">
                        <span class="amount-label">Budget</span>
                        <span class="amount-value">$${formatCurrency(budget.budgetAmount)}</span>
                    </div>
                    <div class="amount-item">
                        <span class="amount-label">Spent</span>
                        <span class="amount-value spent">$${formatCurrency(budget.spentAmount)}</span>
                    </div>
                    <div class="amount-item">
                        <span class="amount-label">Remaining</span>
                        <span class="amount-value ${budget.remaining >= 0 ? 'positive' : 'negative'}">
                            $${formatCurrency(Math.abs(budget.remaining))}
                        </span>
                    </div>
                </div>
                
                <div class="budget-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${progressColor}"></div>
                    </div>
                    <div class="progress-text">
                        <span>${percentage.toFixed(1)}% used</span>
                    </div>
                </div>
                
                ${status === 'exceeded' ? '<div class="budget-alert">⚠️ Budget exceeded!</div>' : ''}
                ${status === 'warning' ? '<div class="budget-alert warning">⚠️ Nearing budget limit</div>' : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = budgetsHTML;
}

// ==========================================
// SHOW ADD BUDGET FORM
// ==========================================
function showAddBudgetForm() {
    const formContainer = document.getElementById('budget-form-container');
    if (formContainer) {
        formContainer.style.display = 'block';
        
        // Set current date as default
        const startDateInput = document.getElementById('budget-start-date');
        if (startDateInput && !startDateInput.value) {
            startDateInput.valueAsDate = new Date();
        }
        
        // Attach form listener if not already attached
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm && !budgetForm.dataset.listenerAttached) {
            budgetForm.addEventListener('submit', handleAddBudget);
            budgetForm.dataset.listenerAttached = 'true';
        }
        
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// HIDE ADD BUDGET FORM
// ==========================================
function hideAddBudgetForm() {
    const formContainer = document.getElementById('budget-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    
    // Reset form
    const form = document.getElementById('budget-form');
    if (form) {
        form.reset();
    }
}

// ==========================================
// UPDATE BUDGET DATES BASED ON PERIOD
// ==========================================
function updateBudgetDates() {
    const period = document.getElementById('budget-period').value;
    const startDateInput = document.getElementById('budget-start-date');
    const endDateInput = document.getElementById('budget-end-date');
    
    if (!period || !startDateInput) return;
    
    const startDate = startDateInput.value ? new Date(startDateInput.value) : new Date();
    let endDate = new Date(startDate);
    
    if (period === 'monthly') {
        // Set end date to last day of the month
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    } else if (period === 'yearly') {
        // Set end date to last day of the year
        endDate = new Date(startDate.getFullYear(), 11, 31);
    }
    
    // Format date as YYYY-MM-DD for input
    const formattedEndDate = endDate.toISOString().split('T')[0];
    if (endDateInput) {
        endDateInput.value = formattedEndDate;
    }
}

// ==========================================
// HANDLE ADD BUDGET
// ==========================================
async function handleAddBudget(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    // Get form values
    const category_id = document.getElementById('budget-category').value;
    const amount = document.getElementById('budget-amount').value;
    const period = document.getElementById('budget-period').value;
    const start_date = document.getElementById('budget-start-date').value;
    const end_date = document.getElementById('budget-end-date').value;
    
    // Validation
    if (!category_id || !amount || !period || !start_date || !end_date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        showToast('Amount must be greater than 0', 'error');
        return;
    }
    
    console.log('💰 Creating budget:', { category_id, amount, period });
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        
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
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            showToast('✅ Budget created successfully!', 'success');
            hideAddBudgetForm();
            await loadBudgets();
        } else {
            showToast(data.message || 'Failed to create budget', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error creating budget:', error);
        showToast('Unable to connect to server', 'error');
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Set Budget';
            submitBtn.disabled = false;
        }
    }
}

// ==========================================
// DELETE BUDGET
// ==========================================
async function deleteBudget(budgetId) {
    if (!confirm('Are you sure you want to delete this budget?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    console.log('🗑️ Deleting budget:', budgetId);
    
    try {
        const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Budget deleted successfully', 'success');
            await loadBudgets();
        } else {
            showToast(data.message || 'Failed to delete budget', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error deleting budget:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// FORMAT CURRENCY
// ==========================================
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0.00';
    return parseFloat(amount).toFixed(2);
}

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ==========================================
window.initializeBudgetsPage = initializeBudgetsPage;
window.showAddBudgetForm = showAddBudgetForm;
window.hideAddBudgetForm = hideAddBudgetForm;
window.updateBudgetDates = updateBudgetDates;
window.deleteBudget = deleteBudget;
