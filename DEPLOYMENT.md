# Personal Finance Tracker - Deployment Guide

## 🚀 Live Application

### Step 1: Wake Up Backend
**Health Check:** https://fj-be-r2-lakavath-naveen-iit-kharagpur.onrender.com/health

⚠️ **IMPORTANT:** Click this link first and wait 30-60 seconds. Free tier services sleep after inactivity.

---

### Step 2: Access Frontend
**Application:** https://fj-be-r2-lakavath-naveen-iit-kharagpur-1wrs.onrender.com

---

## ✅ Implemented Features

### 1. User Authentication
- ✅ User Registration with email and password
- ✅ User Login with JWT tokens
- ✅ Google OAuth integration
- ✅ Profile management

### 2. Transaction Management (CRUD)
- ✅ Create transactions (income/expense)
- ✅ Edit existing transactions
- ✅ Delete transactions
- ✅ View transaction history with filters
- ✅ Receipt upload (PDF/Images up to 5MB)
- ✅ Receipt download

### 3. Dashboard
- ✅ Total balance display
- ✅ Income vs Expense summary
- ✅ Monthly spending chart
- ✅ Category-wise breakdown chart
- ✅ Recent transactions list

### 4. Categories
- ✅ Default categories (Salary, Food, Transport, etc.)
- ✅ Custom category creation
- ✅ Category management

### 5. Budget Tracking
- ✅ Set monthly budgets per category
- ✅ Track spending vs budget
- ✅ Progress bars showing budget utilization
- ✅ Budget alerts when approaching limits

### 6. Reports & Analytics
- ✅ Monthly/Yearly financial reports
- ✅ Income and expense breakdown
- ✅ CSV export for reports
- ✅ Category-wise spending analysis

---

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL database
- JWT Authentication
- Multer for file uploads

**Frontend:**
- Vanilla HTML/CSS/JavaScript
- Chart.js for visualizations
- Responsive design

**Deployment:**
- Backend: Render Web Service
- Frontend: Render Static Site
- Database: Render PostgreSQL

---

## 📝 Test Credentials

Register a new account or use Google OAuth to test the application.

---

## ⚠️ Known Limitations

- Receipt uploads work but files are deleted on Render free tier restarts (ephemeral storage)
- Free tier services may take 30-60 seconds to wake up from sleep

---

## 📦 GitHub Repository

https://github.com/Mrnaveen00/FJ-BE-R2-Lakavath-Naveen-IIT-KHARAGPUR
