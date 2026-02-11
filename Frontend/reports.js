// ==========================================
// REPORTS MODULE
// Handles financial reports and analytics
// ==========================================

// Configuration
const REPORTS_API_URL = 'http://localhost:5000/api';

// State
let monthlyReportChart = null;
let currentReportYear = new Date().getFullYear();

// ==========================================
// INITIALIZE REPORTS PAGE
// ==========================================
async function initializeReportsPage() {
    console.log('📊 Initializing Reports Page...');
    
    try {
        // Populate year dropdown
        populateYearDropdown();
        
        // Load report for current year
        await loadMonthlyReport();
        
        console.log('✅ Reports page initialized');
    } catch (error) {
        console.error('❌ Failed to initialize reports page:', error);
        showToast('Failed to load reports', 'error');
    }
}

// ==========================================
// POPULATE YEAR DROPDOWN
// ==========================================
function populateYearDropdown() {
    const yearSelect = document.getElementById('report-year');
    
    if (!yearSelect) return;
    
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5; // Show last 5 years
    
    yearSelect.innerHTML = '';
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
}

// ==========================================
// LOAD MONTHLY REPORT
// ==========================================
async function loadMonthlyReport() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return;
    }
    
    const yearSelect = document.getElementById('report-year');
    const year = yearSelect ? yearSelect.value : new Date().getFullYear();
    
    console.log(`📊 Loading monthly report for year: ${year}`);
    
    try {
        const response = await fetch(`${REPORTS_API_URL}/reports/monthly?year=${year}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Monthly report loaded:', data.data);
            displayMonthlyReport(data.data);
        } else {
            console.error('Failed to load monthly report:', data.message);
            showToast(data.message || 'Failed to load report', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading monthly report:', error);
        showToast('Unable to connect to server', 'error');
    }
}

// ==========================================
// DISPLAY MONTHLY REPORT
// ==========================================
function displayMonthlyReport(reportData) {
    console.log('📊 Displaying monthly report:', reportData);
    
    // Update summary cards
    updateReportSummary(reportData.summary);
    
    // Render chart
    renderMonthlyChart(reportData.months);
    
    // Display monthly breakdown table
    displayMonthlyBreakdownTable(reportData.months);
}

// ==========================================
// UPDATE REPORT SUMMARY
// ==========================================
function updateReportSummary(summary) {
    const totalIncomeEl = document.getElementById('report-total-income');
    const totalExpensesEl = document.getElementById('report-total-expenses');
    const balanceEl = document.getElementById('report-balance');
    
    if (totalIncomeEl) {
        totalIncomeEl.textContent = `$${formatCurrency(summary.totalIncome || 0)}`;
    }
    
    if (totalExpensesEl) {
        totalExpensesEl.textContent = `$${formatCurrency(summary.totalExpenses || 0)}`;
    }
    
    if (balanceEl) {
        const balance = summary.totalBalance || 0;
        balanceEl.textContent = `$${formatCurrency(balance)}`;
        balanceEl.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--error-color)';
    }
}

// ==========================================
// RENDER MONTHLY CHART
// ==========================================
function renderMonthlyChart(monthsData) {
    const ctx = document.getElementById('monthlyReportChart');
    
    if (!ctx) {
        console.error('❌ Chart canvas not found');
        return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded');
        return;
    }
    
    // Destroy existing chart if it exists
    if (monthlyReportChart) {
        monthlyReportChart.destroy();
    }
    
    // Prepare data
    const labels = monthsData.map(m => m.monthName.substring(0, 3)); // Short month names
    const incomeData = monthsData.map(m => m.income);
    const expenseData = monthsData.map(m => m.expenses);
    
    // Create chart
    monthlyReportChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
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
// DISPLAY MONTHLY BREAKDOWN TABLE
// ==========================================
function displayMonthlyBreakdownTable(monthsData) {
    const container = document.getElementById('monthly-breakdown-table');
    
    if (!container) return;
    
    if (monthsData.length === 0) {
        container.innerHTML = '<p class="empty-state">No data available for this year</p>';
        return;
    }
    
    const tableHTML = `
        <div class="table-responsive">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Income</th>
                        <th>Expenses</th>
                        <th>Balance</th>
                        <th>Transactions</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthsData.map(month => `
                        <tr>
                            <td><strong>${month.monthName}</strong></td>
                            <td class="income-text">$${formatCurrency(month.income)}</td>
                            <td class="expense-text">$${formatCurrency(month.expenses)}</td>
                            <td class="${month.balance >= 0 ? 'income-text' : 'expense-text'}">
                                $${formatCurrency(month.balance)}
                            </td>
                            <td>${month.transactionCount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
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
window.initializeReportsPage = initializeReportsPage;
window.loadMonthlyReport = loadMonthlyReport;
