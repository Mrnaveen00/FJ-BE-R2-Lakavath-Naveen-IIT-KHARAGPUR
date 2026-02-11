// ==========================================
// TRANSACTIONS MODULE
// Handles transaction operations
// ==========================================


// State
let categories = [];
let transactions = [];

// ==========================================
// INITIALIZE TRANSACTIONS PAGE
// ==========================================
async function initializeTransactionsPage() {
    console.log('💳 Initializing Transactions Page...');
    
    try {
        // Load categories first
        await loadCategories();
        
        // Initialize default categories if none exist
        if (categories.length === 0) {
            await initializeDefaultCategories();
            await loadCategories();
        }
        
        // Populate category dropdowns
        populateCategoryDropdowns();
        
        // Load transactions
        await loadTransactions();
        
        // Set today's date as default
        const dateInput = document.getElementById('trans-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
        
        // Attach form listener
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', handleAddTransaction);
        }
        
        console.log('✅ Transactions page initialized');
    } catch (error) {
        console.error('❌ Failed to initialize transactions page:', error);
        showToast('Failed to load transactions', 'error');
    }
}

// ==========================================
// LOAD CATEGORIES
// ==========================================
async function loadCategories() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        console.log('📂 Fetching categories from API...');
        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        console.log('📂 API Response:', data);
        
        if (data.success) {
            categories = data.data;
            console.log(`✅ Loaded ${categories.length} categories:`, categories);
            
            // Populate category dropdowns
            populateCategoryDropdowns();
        } else {
            console.error('Failed to load categories:', data.message);
        }
    } catch (error) {
        console.error('❌ Error loading categories:', error);
    }
}

// ==========================================
// INITIALIZE DEFAULT CATEGORIES
// ==========================================
async function initializeDefaultCategories() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return;
    }
    
    try {
        console.log('🔧 Initializing default categories...');
        
        const response = await fetch(`${API_URL}/categories/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Default categories initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing categories:', error);
    }
}

// ==========================================
// POPULATE CATEGORY DROPDOWNS
// ==========================================
function populateCategoryDropdowns() {
    console.log('📋 Populating category dropdowns with', categories.length, 'categories');
    
    const transCategory = document.getElementById('trans-category');
    const filterCategory = document.getElementById('filter-category');
    
    if (transCategory) {
        transCategory.innerHTML = '<option value="">Select Category</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.name} (${cat.type})`;
            transCategory.appendChild(option);
            console.log('Added category:', cat.name, cat.type);
        });
        
        console.log('✅ Transaction category dropdown populated');
    } else {
        console.error('❌ trans-category element not found');
    }
    
    if (filterCategory) {
        filterCategory.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            filterCategory.appendChild(option);
        });
        
        console.log('✅ Filter category dropdown populated');
    } else {
        console.error('❌ filter-category element not found');
    }
}

// ==========================================
// LOAD TRANSACTIONS
// ==========================================
async function loadTransactions() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    try {
        // Get filter values
        const filterType = document.getElementById('filter-type')?.value || '';
        const filterCategory = document.getElementById('filter-category')?.value || '';
        
        // Build query string
        let queryParams = [];
        if (filterType) queryParams.push(`type=${filterType}`);
        if (filterCategory) queryParams.push(`category_id=${filterCategory}`);
        
        const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
        
        console.log('💳 Loading transactions...');
        
        const response = await fetch(`${API_URL}/transactions${queryString}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            transactions = data.data.transactions;
            console.log(`✅ Loaded ${transactions.length} transactions`);
            
            // Reset display limit when loading new transactions
            displayLimit = 3;
            
            // Display transactions
            displayTransactions(transactions);
        } else {
            console.error('Failed to load transactions:', data.message);
            showToast('Failed to load transactions', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading transactions:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================
let displayLimit = 3; // Show 3 transactions initially

function displayTransactions(transactionsList) {
    const container = document.getElementById('transactions-list');
    const filtersCard = document.getElementById('transaction-filters');
    
    if (!container) return;
    
    // Show/hide filters based on whether there are transactions
    if (filtersCard) {
        filtersCard.style.display = transactionsList.length > 0 ? 'block' : 'none';
    }
    
    if (transactionsList.length === 0) {
        container.innerHTML = '<p class="empty-state">No transactions found. Try adjusting your filters or add a new transaction!</p>';
        return;
    }
    
    // Determine how many transactions to display
    const transactionsToShow = transactionsList.slice(0, displayLimit);
    const hasMore = transactionsList.length > displayLimit;
    
    const transactionsHTML = transactionsToShow.map(transaction => {
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
        const hasReceipt = transaction.receipt_path ? true : false;
        
        // Use default icons based on transaction type
        const icon = type === 'income' ? '💰' : '💸';
        
        return `
            <div class="transaction-item ${type}">
                <div class="transaction-icon">
                    ${icon}
                </div>
                <div class="transaction-info">
                    <div class="transaction-title">${categoryName}</div>
                    <div class="transaction-date">${formattedDate}</div>
                    ${description ? `<div class="transaction-description">${description}</div>` : ''}
                    ${hasReceipt ? `<div style="margin-top: 0.25rem;"><span style="font-size: 0.85rem; color: #28a745;">📎 Receipt attached</span></div>` : ''}
                </div>
                <div class="transaction-amount ${type}">
                    ${type === 'income' ? '+' : '-'}$${amount.toFixed(2)}
                </div>
                <div class="transaction-actions">
                    ${hasReceipt ? `<button onclick="downloadReceipt('${transaction.id}')" class="btn-download" title="Download Receipt">📄</button>` : ''}
                    <button onclick="editTransaction('${transaction.id}')" class="btn-edit" title="Edit">
                        ✏️
                    </button>
                    <button onclick="deleteTransaction('${transaction.id}')" class="btn-delete" title="Delete">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add "Show More" button if there are more transactions
    const showMoreButton = hasMore ? `
        <div style="text-align: center; margin-top: 1rem;">
            <button onclick="showMoreTransactions()" class="btn-primary" style="width: auto; padding: 0.75rem 2rem;">
                Show More (${transactionsList.length - displayLimit} more)
            </button>
        </div>
    ` : '';
    
    container.innerHTML = transactionsHTML + showMoreButton;
}

// ==========================================
// SHOW MORE TRANSACTIONS
// ==========================================
function showMoreTransactions() {
    displayLimit += 5; // Show 5 more transactions
    displayTransactions(transactions);
}

// ==========================================
// SHOW ADD TRANSACTION FORM
// ==========================================
let editingTransactionId = null; // Track if we're editing a transaction

function showAddTransactionForm() {
    const formContainer = document.getElementById('transaction-form-container');
    const formTitle = formContainer.querySelector('h3');
    const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
    
    if (formContainer) {
        // Reset to add mode
        editingTransactionId = null;
        if (formTitle) formTitle.textContent = 'Add New Transaction';
        if (submitBtn) submitBtn.textContent = 'Add Transaction';
        
        // Reset form
        const form = document.getElementById('transaction-form');
        if (form) form.reset();
        
        formContainer.style.display = 'block';
        
        // Set today's date
        const dateInput = document.getElementById('trans-date');
        if (dateInput && !dateInput.value) {
            dateInput.valueAsDate = new Date();
        }
        
        // Scroll to form
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// HIDE ADD TRANSACTION FORM
// ==========================================
function hideAddTransactionForm() {
    const formContainer = document.getElementById('transaction-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    
    // Reset editing state
    editingTransactionId = null;
    
    // Reset form
    const form = document.getElementById('transaction-form');
    if (form) {
        form.reset();
    }
}

// ==========================================
// HANDLE ADD/EDIT TRANSACTION
// ==========================================
async function handleAddTransaction(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    // Get form values
    const type = document.getElementById('trans-type').value;
    const category_id = document.getElementById('trans-category').value;
    const amount = document.getElementById('trans-amount').value;
    const transaction_date = document.getElementById('trans-date').value;
    const description = document.getElementById('trans-description').value;
    const receiptFile = document.getElementById('trans-receipt').files[0];
    
    // Validation
    if (!type || !category_id || !amount || !transaction_date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        showToast('Amount must be greater than 0', 'error');
        return;
    }
    
    const isEditing = editingTransactionId !== null;
    console.log(isEditing ? '✏️ Updating transaction' : '💳 Adding transaction:', { type, category_id, amount, hasReceipt: !!receiptFile });
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = isEditing ? 'Updating...' : 'Adding...';
        submitBtn.disabled = true;
        
        const url = isEditing 
            ? `${API_URL}/transactions/${editingTransactionId}`
            : `${API_URL}/transactions`;
        
        const method = isEditing ? 'PUT' : 'POST';
        
        // Use FormData to support file upload
        const formData = new FormData();
        formData.append('type', type);
        formData.append('category_id', category_id);
        formData.append('amount', parseFloat(amount));
        formData.append('transaction_date', transaction_date);
        formData.append('description', description || '');
        
        // Add receipt file if selected
        if (receiptFile) {
            formData.append('receipt', receiptFile);
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
                // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
            },
            body: formData
        });
        
        const data = await response.json();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            showToast(isEditing ? '✅ Transaction updated successfully!' : '✅ Transaction added successfully!', 'success');
            
            // Hide form and reset
            hideAddTransactionForm();
            
            // Reload transactions and dashboard
            await loadTransactions();
            
            // Reload dashboard if function exists
            if (typeof loadDashboardData === 'function') {
                await loadDashboardData();
            }
            
        } else {
            showToast(data.message || (isEditing ? 'Failed to update transaction' : 'Failed to add transaction'), 'error');
        }
        
    } catch (error) {
        console.error('❌ Error saving transaction:', error);
        showToast('Unable to connect to server', 'error');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = editingTransactionId ? 'Update Transaction' : 'Add Transaction';
            submitBtn.disabled = false;
        }
    }
}

// ==========================================
// EDIT TRANSACTION
// ==========================================
async function editTransaction(transactionId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    console.log('✏️ Loading transaction for editing:', transactionId);
    
    try {
        // Fetch transaction details
        const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
            const transaction = data.data;
            
            // Set editing mode
            editingTransactionId = transactionId;
            
            // Populate form fields
            document.getElementById('trans-type').value = transaction.type;
            document.getElementById('trans-category').value = transaction.category_id;
            document.getElementById('trans-amount').value = transaction.amount;
            
            // Format date properly for input (YYYY-MM-DD)
            const date = new Date(transaction.transaction_date);
            const formattedDate = date.toISOString().split('T')[0];
            document.getElementById('trans-date').value = formattedDate;
            
            document.getElementById('trans-description').value = transaction.description || '';
            
            // Update form UI
            const formContainer = document.getElementById('transaction-form-container');
            const formTitle = formContainer.querySelector('h3');
            const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
            
            if (formTitle) formTitle.textContent = 'Edit Transaction';
            if (submitBtn) submitBtn.textContent = 'Update Transaction';
            
            // Show form
            formContainer.style.display = 'block';
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            console.log('✅ Transaction loaded for editing');
        } else {
            showToast(data.message || 'Failed to load transaction', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error loading transaction:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// DELETE TRANSACTION
// ==========================================
async function deleteTransaction(transactionId) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    console.log('🗑️ Deleting transaction:', transactionId);
    
    try {
        const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Transaction deleted successfully', 'success');
            
            // Reload transactions and dashboard
            await loadTransactions();
            
            // Reload dashboard if function exists
            if (typeof loadDashboardData === 'function') {
                await loadDashboardData();
            }
            
        } else {
            showToast(data.message || 'Failed to delete transaction', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error deleting transaction:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// CLEAR FILTERS
// ==========================================
function clearFilters() {
    const filterType = document.getElementById('filter-type');
    const filterCategory = document.getElementById('filter-category');
    
    if (filterType) filterType.value = '';
    if (filterCategory) filterCategory.value = '';
    
    loadTransactions();
}

// ==========================================
// DOWNLOAD RECEIPT
// ==========================================
async function downloadReceipt(transactionId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }
    
    try {
        console.log('📄 Downloading receipt for transaction:', transactionId);
        
        const response = await fetch(`${API_URL}/transactions/${transactionId}/receipt`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'receipt.pdf';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }
            
            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast('✅ Receipt downloaded', 'success');
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to download receipt', 'error');
        }
    } catch (error) {
        console.error('❌ Error downloading receipt:', error);
        showToast('Unable to download receipt', 'error');
    }
}

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ==========================================
window.showAddTransactionForm = showAddTransactionForm;
window.hideAddTransactionForm = hideAddTransactionForm;
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.downloadReceipt = downloadReceipt;
window.clearFilters = clearFilters;
window.showMoreTransactions = showMoreTransactions;
window.initializeTransactionsPage = initializeTransactionsPage;
window.loadTransactions = loadTransactions;
