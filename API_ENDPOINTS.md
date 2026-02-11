# Finance Tracker API Endpoints

**Base URL:** `http://localhost:5000/api`

## 📋 Quick Test Flow

1. Register a new user
2. Login to get JWT token
3. Initialize default categories
4. Create a transaction
5. View dashboard

---

## 🔐 Authentication

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Response: { "token": "JWT_TOKEN_HERE", "user": {...} }
```

### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Google OAuth (Requires Setup)
```
GET /api/auth/google
GET /api/auth/google/callback
```

---

## 📁 Categories

### List All Categories
```
GET /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
```

### Initialize Default Categories (Do this first!)
```
POST /api/categories/initialize
Authorization: Bearer YOUR_JWT_TOKEN

Creates 14 default categories (Salary, Freelance, Food, Transport, etc.)
```

### Create Category
```
POST /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Gaming",
  "type": "expense",
  "color": "#FF5733"
}
```

### Update Category
```
PUT /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#00FF00"
}
```

### Delete Category
```
DELETE /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💰 Transactions

### List Transactions (with filters)
```
GET /api/transactions?page=1&limit=20&type=expense&category_id=UUID&start_date=2026-02-01&end_date=2026-02-28
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Transaction
```
GET /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Transaction
```
POST /api/transactions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "category_id": "CATEGORY_UUID",
  "type": "expense",
  "amount": 50.00,
  "currency": "USD",
  "description": "Coffee at Starbucks",
  "transaction_date": "2026-02-10",
  "receipt_url": "/uploads/receipts/filename.jpg" (optional)
}
```

### Update Transaction
```
PUT /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 55.00,
  "description": "Updated description"
}
```

### Delete Transaction
```
DELETE /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Upload Receipt
```
POST /api/transactions/upload/receipt
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- receipt: [FILE] (JPEG/PNG/PDF, max 5MB)

Response: { "receipt_url": "/uploads/receipts/filename.jpg" }
```

---

## 📊 Budgets

### List All Budgets
```
GET /api/budgets
Authorization: Bearer YOUR_JWT_TOKEN

Response includes spent amount, remaining, percentage, and exceeded status
```

### Get Single Budget
```
GET /api/budgets/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Budget
```
POST /api/budgets
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "category_id": "CATEGORY_UUID" (nullable for overall budget),
  "amount": 500.00,
  "period": "monthly",
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "alert_threshold": 80
}
```

### Update Budget
```
PUT /api/budgets/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 600.00,
  "alert_threshold": 90
}
```

### Delete Budget
```
DELETE /api/budgets/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📈 Dashboard

### Get Financial Overview
```
GET /api/dashboard
Authorization: Bearer YOUR_JWT_TOKEN

Returns:
- Current month income
- Current month expenses
- Balance
- Expenses by category
- Recent 10 transactions
- Active budgets count
```

---

## 📑 Reports

### Monthly Report
```
GET /api/reports/monthly?year=2026&month=2
Authorization: Bearer YOUR_JWT_TOKEN

Returns:
- Income vs Expenses summary
- Category breakdown
- Daily trend
```

### Yearly Report
```
GET /api/reports/yearly?year=2026
Authorization: Bearer YOUR_JWT_TOKEN

Returns:
- 12-month breakdown
- Monthly income and expenses
```

---

## 🔍 Health Check

```
GET /health

Response: { "success": true, "message": "Server is running" }
```

---

## 🧪 Testing with Postman/Thunder Client

1. **Start Server:** `npm run dev` in Backend folder
2. **Register:** POST to `/api/auth/register`
3. **Login:** POST to `/api/auth/login` → Copy the JWT token
4. **Set Auth:** Add header `Authorization: Bearer YOUR_JWT_TOKEN` to all protected routes
5. **Initialize Categories:** POST to `/api/categories/initialize`
6. **Create Transaction:** POST to `/api/transactions`
7. **View Dashboard:** GET `/api/dashboard`

---

## 📦 File Upload Example

For receipt upload, use multipart/form-data:

```javascript
// JavaScript Fetch Example
const formData = new FormData();
formData.append('receipt', fileInput.files[0]);

fetch('http://localhost:5000/api/transactions/upload/receipt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
})
```

---

## ✅ Completed Features

- ✅ JWT Authentication (register, login, profile)
- ✅ Google OAuth (ready, needs credentials)
- ✅ Category Management (CRUD + 14 defaults)
- ✅ Transaction Management (CRUD with filters & pagination)
- ✅ Receipt Upload (5MB max, JPEG/PNG/PDF)
- ✅ Budget Tracking (with spending calculations)
- ✅ Dashboard (financial overview)
- ✅ Reports (monthly & yearly)

---

## 🚀 Next Steps

- Email Notifications (SendGrid)
- Frontend UI
- Deployment
- Testing & Documentation
