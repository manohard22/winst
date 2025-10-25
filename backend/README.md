# 🚀 WINST Backend - Environment Configuration Guide

## 📁 **Clean Backend Structure**

```
backend/
├── .env                    # Default configuration
├── .env.development       # Development environment
├── .env.production        # Production environment  
├── .env.local            # Local overrides (gitignored)
├── .env.template         # Template for new setups
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── pm2.config.cjs        # PM2 process manager config
├── config/               # Database configuration
├── middleware/           # Authentication middleware
├── routes/               # API route handlers
├── scripts/              # Utility scripts
├── utils/                # Helper utilities
└── README.md            # This documentation
```

## 🌍 **Environment Configuration**

### **Environment File Loading Order**
1. **`.env`** - Base configuration (always loaded)
2. **`.env.{NODE_ENV}`** - Environment-specific (development/production)
3. **`.env.local`** - Local overrides (not committed, personal settings)

### **Environment Files Explained**

#### 📄 `.env` - Default Configuration
- Base settings that work across all environments
- Contains development-friendly defaults
- Safe to commit to version control (no sensitive data)

#### 🔧 `.env.development` - Development Environment
- Local development settings
- Debug mode enabled
- Relaxed security settings
- Test database and email configurations

#### 🚀 `.env.production` - Production Environment  
- Production-ready configuration
- Security hardened settings
- SSL enforced
- Production database and email settings
- **⚠️ Contains sensitive data - DO NOT commit real production values**

#### 🏠 `.env.local` - Local Overrides
- Personal customizations for local development
- Overrides development settings
- **Added to .gitignore** - never committed
- Use for personal database settings, email testing, etc.

## 📜 **Available Scripts**

### **Basic Commands**
```bash
# Development
npm run dev                 # Start with nodemon (auto-restart)
npm run start              # Start production server
npm test                   # Run tests

# Environment-Specific
npm run start:development  # Force development environment
npm run start:production   # Force production environment
npm run dev:development    # Development with nodemon
npm run dev:production     # Production with nodemon (testing)
```

### **PM2 Process Management**
```bash
# Start with PM2
npm run pm2:start          # Start with default environment
npm run pm2:start:dev      # Start in development mode
npm run pm2:start:prod     # Start in production mode

# Control PM2
npm run pm2:stop           # Stop the process
npm run pm2:restart        # Restart the process
npm run pm2:status         # View process status
npm run pm2:logs           # View logs
npm run pm2:monit          # Monitor in real-time
npm run pm2:delete         # Delete the process
```

### **Utility Commands**
```bash
# Testing and Health
npm run health             # Check server health
npm run smtp:test          # Test email configuration
npm run logs               # View application logs
npm run clean              # Clean install dependencies
```

## ⚙️ **Environment Setup Instructions**

### **1. Development Setup**
```bash
# Clone and install
git clone <repository>
cd backend
npm install

# Use default settings (development)
npm run dev

# OR customize with .env.local
cp .env.local.example .env.local
# Edit .env.local with your settings
npm run dev
```

### **2. Production Setup**
```bash
# Install production dependencies
npm ci --production

# Set production environment variables
export NODE_ENV=production
# Configure production .env.production file

# Start with PM2
npm run pm2:start:prod

# Monitor
npm run pm2:status
npm run pm2:logs
```

### **3. Local Development Customization**
```bash
# Create personal local config
touch .env.local

# Add your overrides to .env.local:
# DB_PASSWORD=my_local_password
# SMTP_HOST=localhost
# SMTP_PORT=1025
# DEBUG=true

# Start development
npm run dev
```

## 🔧 **Configuration Variables**

### **Required Variables**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=winst_portal_db
DB_USER=winst_db_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# CORS
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### **Optional Variables**
```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Payment
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🔒 **Security Best Practices**

### **Development**
- ✅ Use test/sandbox payment keys
- ✅ Use development database
- ✅ Enable debug logging
- ✅ Use local/test email services

### **Production**
- 🔐 Use strong, unique JWT secrets (64+ characters)
- 🔐 Enable SSL/HTTPS
- 🔐 Use production database with SSL
- 🔐 Set strong database passwords
- 🔐 Use production email service
- 🔐 Use live payment gateway keys
- 🔐 Disable debug mode
- 🔐 Set restrictive CORS origins

## 🚀 **Deployment Examples**

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:production"]
```

### **PM2 Ecosystem**
```bash
# Development
pm2 start pm2.config.cjs --env development

# Production
pm2 start pm2.config.cjs --env production

# Multiple instances
pm2 start pm2.config.cjs --env production -i max
```

### **Systemd Service**
```ini
[Unit]
Description=Winst Backend API
After=network.target

[Service]
Type=simple
User=winst
WorkingDirectory=/opt/winst/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start:production
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### Environment Variables Not Loading
```bash
# Check environment loading
node -e "console.log(process.env.NODE_ENV)"

# Verify file exists
ls -la .env*

# Check file permissions
chmod 644 .env
```

#### Database Connection Issues
```bash
# Test database connection
npm run smtp:test

# Check database credentials
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Change port in environment
PORT=3002 npm run dev
```

### **Logging and Monitoring**
```bash
# View application logs
npm run logs

# PM2 monitoring
npm run pm2:monit

# Health check
npm run health
curl http://localhost:3001/health
```

## 📋 **Environment Checklist**

### **Before Development**
- [ ] Node.js 16+ installed
- [ ] PostgreSQL running
- [ ] Dependencies installed (`npm install`)
- [ ] Database created and accessible
- [ ] Environment files configured

### **Before Production**
- [ ] Production database setup
- [ ] SSL certificates configured
- [ ] Production environment variables set
- [ ] Email service configured
- [ ] Payment gateway configured
- [ ] Security review completed
- [ ] Backup strategy in place

## 🎯 **Quick Start Commands**

```bash
# Fresh setup
npm install
npm run dev

# Production deployment
NODE_ENV=production npm run pm2:start:prod

# Monitor production
npm run pm2:status
npm run pm2:logs

# Health check
curl http://localhost:3001/health
```

---

**🎉 Your WINST backend is now properly organized and ready for development and production deployment!**