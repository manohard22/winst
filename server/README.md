# Lucro Server - PostgreSQL Backend

Complete Node.js backend server for the Lucro Internship Portal using PostgreSQL database.

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model with PostgreSQL queries
│   ├── Payment.js           # Payment model
│   ├── Task.js              # Task model
│   └── Technology.js        # Technology model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── payments.js          # Payment routes
│   ├── tasks.js             # Task management routes
│   ├── admin.js             # Admin dashboard routes
│   └── certificates.js      # Certificate generation routes
├── scripts/
│   └── setupDatabase.js     # Database setup script
├── utils/
│   └── emailService.js      # Email utilities
├── uploads/                 # File upload directory
├── certificates/           # Generated certificates
├── server.js               # Main server file
├── package.json
└── .env
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database

```bash
# Make sure PostgreSQL is running
# Create database and run schema
npm run db:setup
```

### 4. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Models

### User Model

- **create(userData)**: Register new user
- **findByEmail(email)**: Find user by email
- **findById(userId)**: Find user by ID
- **getAllStudents()**: Get all student records
- **updateLastLogin(userId)**: Update last login timestamp

### Payment Model

- **create(paymentData)**: Process new payment
- **getAllPayments()**: Get all payment records
- **getPaymentsByUser(userId)**: Get user's payment history

### Task Model

- **getTasksByUser(userId)**: Get user's assigned tasks
- **submitTask(taskId, userId, data)**: Submit task solution
- **getAllTasks()**: Get all tasks (admin)
- **createTask(taskData)**: Create new task (admin)

### Technology Model

- **getAll()**: Get all available technologies
- **getById(techId)**: Get technology by ID
- **getByName(techName)**: Get technology by name

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/technologies` - Get available technologies

### Payments

- `POST /api/payments` - Process payment
- `GET /api/payments/my-payments` - Get user payments

### Tasks

- `GET /api/tasks` - Get user tasks
- `POST /api/tasks/:id/submit` - Submit task

### Admin Routes

- `GET /api/admin/students` - Get all students
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/tasks` - Get all tasks
- `POST /api/admin/tasks` - Create new task
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

### Certificates

- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/student/:id` - Get student certificates
- `GET /api/certificates/download/:filename` - Download certificate

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Access**: Admin and student role separation
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Parameterized queries

## 📧 Email Integration

- **Welcome Emails**: Sent on registration
- **Certificate Emails**: Sent when certificates are generated
- **Configurable**: Easy to enable/disable email features

## 📄 File Management

- **File Uploads**: Multer for handling file uploads
- **Certificate Generation**: PDFKit for PDF certificates
- **Static File Serving**: Express static middleware

## 🔧 Environment Variables

```env
# Database
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=lucro_portal
PG_USER=lucro_admin
PG_PASSWORD=lucro_secure_2024

# Security
JWT_SECRET=your-secret-key

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
```

## 📈 Database Queries

The server includes optimized PostgreSQL queries for:

- User management and authentication
- Payment processing and tracking
- Task assignment and submission
- Progress tracking and analytics
- Certificate generation and management

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123","phone":"+91 9876543210","education":"undergraduate","technology":"Web Development"}'
```

## 🚀 Deployment

1. **Environment Setup**: Configure production environment variables
2. **Database**: Set up PostgreSQL database with SSL
3. **File Storage**: Configure file upload and certificate storage
4. **Email**: Set up SMTP for email notifications
5. **Security**: Enable HTTPS and security headers

## 📞 Support

For server-related issues:

1. Check server logs
2. Verify database connection
3. Ensure environment variables are set
4. Review API endpoint documentation

---

**Note**: This server provides a complete backend solution for the Lucro internship portal with PostgreSQL integration, authentication, file handling, and email notifications.
