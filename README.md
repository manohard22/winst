# WINST Internship Portal

## Project Structure

This repository contains the complete WINST Internship Portal system with the following components:

### 📁 Project Directories

- **`backend/`** - Node.js/Express API server
  - JWT authentication system
  - PostgreSQL database integration
  - Complete REST API endpoints
  - Environment configuration

- **`frontend/`** - React frontend application
  - Student portal interface
  - Modern UI with Tailwind CSS
  - JWT authentication integration
  - Responsive design

- **`admin-portal/`** - React admin interface
  - Administrative dashboard
  - Program and user management
  - Analytics and reporting
  - Role-based access control

- **`database/`** - Database schema and scripts
  - PostgreSQL schema files
  - Migration scripts
  - Sample data

- **`documents/`** - Project documentation
  - API documentation
  - Setup guides
  - Technical specifications

### 🚀 Getting Started

Each project directory contains its own README and setup instructions:

1. **Backend Setup**: See `backend/README.md`
2. **Frontend Setup**: See `frontend/README.md`
3. **Admin Portal Setup**: See `admin-portal/README.md`
4. **Database Setup**: See `database/README.md`

### 🔧 Quick Start

```bash
# Start all services in development mode

# Terminal 1 - Backend
cd backend
npm install
npm run start:safe

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Terminal 3 - Admin Portal
cd admin-portal
npm install
npm run dev
```

### 🌐 URLs

- **Frontend**: http://localhost:5173
- **Admin Portal**: http://localhost:5174
- **Backend API**: http://localhost:3001

### 📖 Documentation

Complete setup and deployment guides are available in each project's directory and the `documents/` folder.

---

**Note**: This is a monorepo structure where each directory is a separate, deployable project component.