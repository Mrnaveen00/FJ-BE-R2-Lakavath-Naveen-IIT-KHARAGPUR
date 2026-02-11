# Personal Finance Tracker - Project Architecture

## 📁 Complete Project Structure

```
Personal-Finance-Tracker/
│
├── Backend/
│   ├── server.js                      # Main entry point, Express setup
│   ├── app.js                         # Express app configuration
│   ├── database.js                    # PostgreSQL connection pool
│   ├── package.json                   # Backend dependencies
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment template
│   │
│   ├── Config/
│   │   ├── constants.js               # App constants & enums
│   │   ├── jwt.config.js              # JWT configuration
│   │   ├── email.config.js            # Email service config
│   │   ├── storage.config.js          # File storage config
│   │   └── currencies.config.js       # Currency list & rates
│   │
│   ├── Models/
│   │   ├── index.js                   # Model aggregator & associations
│   │   ├── User.model.js              # User schema
│   │   ├── Category.model.js          # Income/Expense categories
│   │   ├── Transaction.model.js       # Financial transactions
│   │   ├── Budget.model.js            # Budget limits
│   │   ├── Notification.model.js      # User notifications
│   │   └── RefreshToken.model.js      # JWT refresh tokens
│   │
│   ├── Routes/
│   │   ├── index.js                   # Route aggregator
│   │   ├── auth.routes.js             # Auth endpoints
│   │   ├── user.routes.js             # User profile
│   │   ├── category.routes.js         # Category CRUD
│   │   ├── transaction.routes.js      # Transaction CRUD
│   │   ├── budget.routes.js           # Budget management
│   │   ├── report.routes.js           # Analytics & reports
│   │   └── notification.routes.js     # Notifications
│   │
│   ├── Controllers/
│   │   ├── auth.controller.js         # Register, Login, Logout, OAuth
│   │   ├── user.controller.js         # Profile management
│   │   ├── category.controller.js     # Category operations
│   │   ├── transaction.controller.js  # Transaction operations
│   │   ├── budget.controller.js       # Budget operations
│   │   ├── report.controller.js       # Report generation
│   │   └── notification.controller.js # Notification handling
│   │
│   ├── Services/
│   │   ├── auth.service.js            # Authentication logic
│   │   ├── transaction.service.js     # Transaction business logic
│   │   ├── budget.service.js          # Budget calculations
│   │   ├── report.service.js          # Report generation logic
│   │   ├── notification.service.js    # Notification management
│   │   ├── email.service.js           # Email sending (SendGrid)
│   │   ├── currency.service.js        # Currency conversion
│   │   ├── file.service.js            # File upload/storage
│   │   └── ai.service.js              # OpenAI integration
│   │
│   ├── Middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── validation.middleware.js   # Request validation
│   │   ├── error.middleware.js        # Error handling
│   │   ├── upload.middleware.js       # File upload handling
│   │   └── rateLimiter.middleware.js  # Rate limiting
│   │
│   ├── Utils/
│   │   ├── logger.js                  # Winston logger
│   │   ├── responseHandler.js         # Standardized responses
│   │   ├── helpers.js                 # Helper functions
│   │   ├── validators.js              # Custom validators
│   │   └── dateHelpers.js             # Date utilities
│   │
│   ├── Jobs/
│   │   ├── budgetChecker.job.js       # Daily budget monitoring
│   │   └── monthlyReport.job.js       # Monthly report emails
│   │
│   └── Uploads/
│       └── receipts/                  # Receipt storage
│
│
├── Frontend/
│   ├── index.html                     # HTML entry point
│   ├── vite.config.js                 # Vite configuration
│   ├── package.json                   # Frontend dependencies
│   ├── eslint.config.js               # ESLint rules
│   │
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Main app & routing
│       ├── App.css                    # Global styles
│       ├── index.css                  # Base styles
│       │
│       ├── Config/
│       │   ├── api.config.js          # API endpoints
│       │   └── constants.js           # Frontend constants
│       │
│       ├── Services/
│       │   ├── api.service.js         # Axios instance
│       │   ├── auth.service.js        # Auth API calls
│       │   ├── transaction.service.js # Transaction API calls
│       │   ├── budget.service.js      # Budget API calls
│       │   └── report.service.js      # Report API calls
│       │
│       ├── Context/
│       │   ├── AuthContext.jsx        # Authentication state
│       │   └── ThemeContext.jsx       # Theme management
│       │
│       ├── Hooks/
│       │   ├── useAuth.js             # Auth hook
│       │   ├── useApi.js              # API call hook
│       │   └── useDebounce.js         # Debounce hook
│       │
│       ├── Components/
│       │   │
│       │   ├── Layout/
│       │   │   ├── Navbar/
│       │   │   │   ├── Navbar.jsx
│       │   │   │   └── Navbar.module.css
│       │   │   ├── Sidebar/
│       │   │   │   ├── Sidebar.jsx
│       │   │   │   └── Sidebar.module.css
│       │   │   └── Footer/
│       │   │       ├── Footer.jsx
│       │   │       └── Footer.module.css
│       │   │
│       │   ├── Auth/
│       │   │   ├── LoginForm/
│       │   │   │   ├── LoginForm.jsx
│       │   │   │   └── LoginForm.module.css
│       │   │   ├── RegisterForm/
│       │   │   │   ├── RegisterForm.jsx
│       │   │   │   └── RegisterForm.module.css
│       │   │   └── ProtectedRoute/
│       │   │       └── ProtectedRoute.jsx
│       │   │
│       │   ├── Dashboard/
│       │   │   ├── DashboardCard/
│       │   │   │   ├── DashboardCard.jsx
│       │   │   │   └── DashboardCard.module.css
│       │   │   ├── FinancialSummary/
│       │   │   │   ├── FinancialSummary.jsx
│       │   │   │   └── FinancialSummary.module.css
│       │   │   ├── Charts/
│       │   │   │   ├── IncomeExpenseChart.jsx
│       │   │   │   ├── CategoryChart.jsx
│       │   │   │   └── TrendChart.jsx
│       │   │   └── RecentTransactions/
│       │   │       ├── RecentTransactions.jsx
│       │   │       └── RecentTransactions.module.css
│       │   │
│       │   ├── Transaction/
│       │   │   ├── TransactionList/
│       │   │   │   ├── TransactionList.jsx
│       │   │   │   └── TransactionList.module.css
│       │   │   ├── TransactionForm/
│       │   │   │   ├── TransactionForm.jsx
│       │   │   │   └── TransactionForm.module.css
│       │   │   ├── TransactionFilter/
│       │   │   │   ├── TransactionFilter.jsx
│       │   │   │   └── TransactionFilter.module.css
│       │   │   └── ReceiptUpload/
│       │   │       ├── ReceiptUpload.jsx
│       │   │       └── ReceiptUpload.module.css
│       │   │
│       │   ├── Category/
│       │   │   ├── CategoryList/
│       │   │   │   ├── CategoryList.jsx
│       │   │   │   └── CategoryList.module.css
│       │   │   └── CategoryForm/
│       │   │       ├── CategoryForm.jsx
│       │   │       └── CategoryForm.module.css
│       │   │
│       │   ├── Budget/
│       │   │   ├── BudgetList/
│       │   │   │   ├── BudgetList.jsx
│       │   │   │   └── BudgetList.module.css
│       │   │   ├── BudgetForm/
│       │   │   │   ├── BudgetForm.jsx
│       │   │   │   └── BudgetForm.module.css
│       │   │   ├── BudgetProgress/
│       │   │   │   ├── BudgetProgress.jsx
│       │   │   │   └── BudgetProgress.module.css
│       │   │   └── BudgetAlert/
│       │   │       ├── BudgetAlert.jsx
│       │   │       └── BudgetAlert.module.css
│       │   │
│       │   ├── Report/
│       │   │   ├── MonthlyReport/
│       │   │   │   ├── MonthlyReport.jsx
│       │   │   │   └── MonthlyReport.module.css
│       │   │   ├── CategoryReport/
│       │   │   │   ├── CategoryReport.jsx
│       │   │   │   └── CategoryReport.module.css
│       │   │   └── ExportReport/
│       │   │       ├── ExportReport.jsx
│       │   │       └── ExportReport.module.css
│       │   │
│       │   └── Common/
│       │       ├── Button/
│       │       │   ├── Button.jsx
│       │       │   └── Button.module.css
│       │       ├── Input/
│       │       │   ├── Input.jsx
│       │       │   └── Input.module.css
│       │       ├── Select/
│       │       │   ├── Select.jsx
│       │       │   └── Select.module.css
│       │       ├── Modal/
│       │       │   ├── Modal.jsx
│       │       │   └── Modal.module.css
│       │       ├── Loader/
│       │       │   ├── Loader.jsx
│       │       │   └── Loader.module.css
│       │       └── Toast/
│       │           ├── Toast.jsx
│       │           └── Toast.module.css
│       │
│       └── Pages/
│           ├── HomePage/
│           │   ├── HomePage.jsx
│           │   └── HomePage.module.css
│           ├── LoginPage/
│           │   ├── LoginPage.jsx
│           │   └── LoginPage.module.css
│           ├── RegisterPage/
│           │   ├── RegisterPage.jsx
│           │   └── RegisterPage.module.css
│           ├── DashboardPage/
│           │   ├── DashboardPage.jsx
│           │   └── DashboardPage.module.css
│           ├── TransactionsPage/
│           │   ├── TransactionsPage.jsx
│           │   └── TransactionsPage.module.css
│           ├── BudgetsPage/
│           │   ├── BudgetsPage.jsx
│           │   └── BudgetsPage.module.css
│           ├── ReportsPage/
│           │   ├── ReportsPage.jsx
│           │   └── ReportsPage.module.css
│           ├── ProfilePage/
│           │   ├── ProfilePage.jsx
│           │   └── ProfilePage.module.css
│           └── NotFoundPage/
│               ├── NotFoundPage.jsx
│               └── NotFoundPage.module.css
│
│
└── Documentation/
    ├── API_DOCUMENTATION.md           # API endpoint documentation
    ├── DATABASE_SCHEMA.md             # Database structure
    ├── DEPLOYMENT_GUIDE.md            # Deployment instructions
    └── USER_GUIDE.md                  # User manual
```

## 🔄 Application Flow

### Authentication Flow
```
User → LoginForm → auth.service.js → API → auth.controller.js 
→ auth.service.js → JWT Token → Store in localStorage → Redirect to Dashboard
```

### Transaction Creation Flow
```
User → TransactionForm → transaction.service.js → API 
→ transaction.controller.js → transaction.service.js 
→ Database → Response → Update UI
```

### Budget Monitoring Flow
```
Cron Job → budgetChecker.job.js → budget.service.js 
→ Check spending vs limit → notification.service.js 
→ email.service.js → SendGrid → User Email
```

## 🎯 Backend Architecture Layers

1. **Routes Layer**: Define API endpoints
2. **Controllers Layer**: Handle HTTP requests/responses
3. **Services Layer**: Business logic & database operations
4. **Models Layer**: Database schema definitions
5. **Middleware Layer**: Request processing & validation

## 🎨 Frontend Architecture

1. **Pages**: Top-level route components
2. **Components**: Reusable UI components
3. **Services**: API communication
4. **Context**: Global state management
5. **Hooks**: Reusable logic

## 📊 Key Features Mapping

| Feature | Backend Files | Frontend Files |
|---------|--------------|----------------|
| Authentication | auth.controller.js, auth.service.js, auth.routes.js | LoginForm, RegisterForm, AuthContext |
| Transactions | transaction.controller.js, transaction.service.js | TransactionList, TransactionForm |
| Budgets | budget.controller.js, budget.service.js | BudgetList, BudgetProgress |
| Reports | report.controller.js, report.service.js | MonthlyReport, Charts |
| Notifications | notification.controller.js, notification.service.js | Toast, BudgetAlert |

## 🚀 Technology Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT Authentication
- SendGrid (Email)
- Multer (File Upload)
- Winston (Logging)
- Node-cron (Scheduled Jobs)

**Frontend:**
- React 18
- Vite (Build tool)
- React Router (Navigation)
- Axios (API calls)
- Chart.js / Recharts (Visualizations)
- CSS Modules (Styling)
- Context API (State management)

## 📝 Naming Conventions

**Backend:**
- Files: `camelCase.suffix.js` (e.g., `auth.controller.js`)
- Functions: `camelCase` (e.g., `createTransaction`)
- Classes: `PascalCase` (e.g., `TransactionService`)

**Frontend:**
- Components: `PascalCase` (e.g., `TransactionForm.jsx`)
- Folders: `PascalCase` (e.g., `TransactionForm/`)
- Styles: `ComponentName.module.css`
- Hooks: `useCamelCase` (e.g., `useAuth`)

## 🔐 Security Features

- JWT with access & refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- SQL injection prevention (Sequelize)
- XSS protection (Helmet)
- CORS configuration
- File upload restrictions

## 📈 Performance Optimizations

- Database connection pooling
- Query optimization with indexes
- Response caching
- Lazy loading (Frontend)
- Code splitting (Vite)
- Image optimization
- Debounced API calls

---

This architecture provides:
✅ Clear separation of concerns
✅ Scalable structure
✅ Easy to maintain
✅ Follows best practices
✅ Ready for team collaboration
