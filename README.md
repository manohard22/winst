# Lucro Internship Management Portal

A comprehensive full-stack internship management system built with React, Node.js, and PostgreSQL.

## 🏗️ Project Structure

```
lucro-internship-portal/
├── frontend/          # React + TailwindCSS frontend
├── backend/           # Node.js + Express backend
├── admin-portal/      # React admin dashboard
├── database/          # PostgreSQL setup scripts
└── package.json       # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd lucro-internship-portal
npm run install-all
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb lucro_portal

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Run database setup script
npm run setup-db
```

### 3. Environment Configuration

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lucro_portal
DB_USER=lucro_admin
DB_PASSWORD=lucro_secure_2024
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 4. Start Development Servers
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Admin Portal:** http://localhost:5174
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health

## 👥 Demo Credentials

- **Admin:** admin@lucro.com / password123
- **Student:** rahul@example.com / password123

## 🛠️ Technologies

- **Frontend:** React 18, TailwindCSS, Vite
- **Backend:** Node.js, Express.js, PostgreSQL
- **Database:** PostgreSQL
- **Authentication:** JWT Tokens

## 📱 Features

### Student Portal
- Browse internship programs with filters
- Enroll in programs with payment
- Track enrollment progress
- Submit tasks and assignments
- Profile management

### Admin Dashboard
- CRUD operations for programs
- View and manage enrollments
- Student management
- Analytics and statistics
- Task management

## 🔧 Development

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm start           # Start production server
```

### Frontend Commands
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Admin Portal Commands
```bash
cd admin-portal
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📦 Installation Steps

1. **Install Dependencies:**
   ```bash
   npm run install-all
   ```

2. **Setup Database:**
   ```bash
   npm run setup-db
   ```

3. **Configure Environment:**
   - Copy `.env.example` files and update with your credentials
   - Set up database connection details

4. **Start Development:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

1. Students register/login via `/api/auth/register` or `/api/auth/login`
2. JWT tokens are stored in localStorage
3. Protected routes check for valid tokens
4. Role-based access control for admin features

## 📊 Database Schema

- **users:** Student and admin accounts
- **internship_programs:** Program listings
- **student_internship:** Student enrollments
- **orders:** Payment orders
- **payments:** Payment records
- **tasks:** Program tasks and assignments
- **task_submissions:** Student task submissions

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Admin Portal Deployment
```bash
cd admin-portal
npm run build
# Deploy dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
