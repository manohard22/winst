# 🎯 WINST INTERNSHIP PORTAL - FRESH DATABASE SETUP

## 📋 Overview

This directory contains everything needed to set up a complete, production-ready database for the Winst Internship Portal. The database includes comprehensive schemas, realistic sample data, and all features required for a modern internship management platform.

## 🗄️ Database Features

### 🏗️ **Complete Schema Architecture**
- **15+ Interconnected Tables** with proper relationships
- **Comprehensive Indexing** for optimal performance  
- **Triggers and Functions** for automated workflows
- **Analytics Views** for business intelligence
- **Data Integrity Constraints** and validation

### 💼 **Business Functionality**
- ✅ **Multi-Role User Management** (Students, Admins, Mentors, Affiliates)
- ✅ **Program Catalog** with technologies and pricing
- ✅ **Payment Processing** (Razorpay integration ready)
- ✅ **Assessment System** with multiple question types
- ✅ **Task Management** and project submissions
- ✅ **Certificate Generation** with verification
- ✅ **Referral System** with discount tracking
- ✅ **Affiliate Program** with commission management
- ✅ **Progress Tracking** and learning journey
- ✅ **Content Management** (announcements, testimonials)

## 📁 Files Included

### 🗃️ **Core Database Files**
- `winst_complete_schema.sql` - Complete database schema (tables, indexes, views)
- `winst_sample_data.sql` - Comprehensive realistic sample data
- `setup_fresh_database.bat` - Windows setup script
- `setup_fresh_database.sh` - Linux/Mac setup script
- `DATABASE_README.md` - This documentation file

## 🚀 Quick Setup

### **Option 1: Windows (Recommended)**
```bash
# Double-click to run or execute in command prompt
setup_fresh_database.bat
```

### **Option 2: Linux/Mac**
```bash
# Make executable and run
chmod +x setup_fresh_database.sh
./setup_fresh_database.sh
```

### **Option 3: Manual Setup**
```bash
# 1. Create database
createdb -U winst_db_user winst_portal_db

# 2. Run schema creation
psql -U winst_db_user -d winst_portal_db -f winst_complete_schema.sql

# 3. Populate sample data
psql -U winst_db_user -d winst_portal_db -f winst_sample_data.sql
```

## 📊 Sample Data Included

### 👥 **Users (Password: `password123`)**
| Role | Email | Name | Status |
|------|-------|------|--------|
| Admin | admin@winst.com | Admin User | Active |
| Admin | support@winst.com | Support Team | Active |
| Student | john.doe@gmail.com | John Doe | Active |
| Student | jane.smith@gmail.com | Jane Smith | Active |
| Student | mike.wilson@gmail.com | Mike Wilson | Active |
| Student | sarah.jones@gmail.com | Sarah Jones | Active |
| Student | rahul.kumar@gmail.com | Rahul Kumar | Active |
| Student | priya.sharma@gmail.com | Priya Sharma | Active |
| Student | amit.patel@gmail.com | Amit Patel | Active |
| Mentor | mentor1@winst.com | Dr. Rajesh Gupta | Active |
| Mentor | mentor2@winst.com | Prof. Sneha Agarwal | Active |
| Affiliate | affiliate1@winst.com | Marketing Partner | Active |
| Affiliate | affiliate2@winst.com | Content Creator | Active |

### 🎓 **Internship Programs**
1. **Full Stack Web Development with MERN** - 12 weeks (₹2,500 → ₹2,000)
2. **Frontend Development with React** - 8 weeks (₹1,800 → ₹1,530)
3. **Backend Development with Python Django** - 10 weeks (₹2,200 → ₹1,980)
4. **DevOps and Cloud Computing with AWS** - 14 weeks (₹3,000 → ₹2,250)
5. **Mobile App Development with React Native** - 10 weeks (₹2,300 → ₹1,955)
6. **Data Science with Python** - 16 weeks (₹3,500 → ₹2,450)

### 🛠️ **Technologies (25+)**
- **Frontend**: React, Vue.js, Angular, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS
- **Backend**: Node.js, Express.js, Python, Django, Flask, Java, Spring Boot
- **Database**: PostgreSQL, MongoDB, MySQL, Redis
- **DevOps**: Docker, Kubernetes, AWS, Google Cloud
- **Tools**: Git, GitHub, VS Code

### 💼 **Business Data**
- **7 Student Enrollments** with realistic progress tracking
- **5 Referral Codes** (some completed, some pending)
- **7 Orders** with payment records (Razorpay integration)
- **11 Assessment Questions** across different programs
- **7 Programming Tasks** with detailed requirements
- **3 Completed Submissions** with grades and feedback
- **2 Issued Certificates** with verification codes
- **4 Platform Announcements** for different audiences
- **6 Student Testimonials** with success stories

## 🔧 Database Configuration

### **Connection Settings** (from .env)
```properties
DB_HOST=localhost
DB_PORT=5432  
DB_NAME=winst_portal_db
DB_USER=winst_db_user
DB_PASSWORD=winstpass123
```

### **Performance Features**
- **25+ Strategic Indexes** for fast queries
- **Automatic Timestamp Updates** via triggers
- **Analytics Views** for reporting
- **Data Validation** constraints
- **Foreign Key Relationships** for integrity

## 📈 Database Statistics

After setup completion, you'll have:
- **12 Users** across all roles
- **25+ Technologies** in the catalog
- **6 Comprehensive Programs** 
- **7 Active Enrollments** with progress
- **7 Payment Records** 
- **11 Assessment Questions**
- **7 Practical Tasks**
- **Multiple Referrals** and affiliate data
- **Learning Journey Tracking**
- **Certificate Records**
- **Platform Content**

## 🔍 Testing Your Setup

### **Verify Schema Creation**
```sql
-- Check table count
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Should return ~20 tables

-- Check sample data
SELECT role, count(*) FROM users GROUP BY role;
-- Should show admins, students, mentors, affiliates
```

### **Test Login Credentials**
Use these credentials in your application:
- **Admin**: admin@winst.com / password123
- **Student**: john.doe@gmail.com / password123  
- **Mentor**: mentor1@winst.com / password123

### **Verify Business Logic**
- Check student enrollments and progress
- View available programs and technologies
- Test referral codes and affiliate tracking
- Examine assessment questions and tasks
- Review payment records and certificates

## 🛠️ Backend Integration

Ensure your backend `.env` file matches:
```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=winst_portal_db
DB_USER=winst_db_user
DB_PASSWORD=winstpass123
```

## 📊 Analytics and Reporting

The database includes pre-built views for analytics:
- `student_progress_overview` - Student performance metrics
- `program_performance` - Program success rates and analytics
- `affiliate_performance` - Affiliate earnings and conversion data

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: JWT token tracking
- **Role-Based Access**: Proper user role segregation
- **Data Validation**: Input validation at database level
- **Verification Codes**: Secure certificate verification

## 🚀 Production Readiness

This database is designed for production use with:
- **Scalable Architecture** for thousands of users
- **Performance Optimization** with strategic indexing
- **Data Integrity** with proper constraints
- **Business Logic** implementation
- **Comprehensive Testing Data**

## 📞 Support

If you encounter any issues:
1. Ensure PostgreSQL is running
2. Check database credentials in .env
3. Verify user permissions
4. Check PostgreSQL logs for errors
5. Ensure all SQL files are in the correct directory

---

**🎉 Your Winst Internship Portal database is now ready for comprehensive testing and development!**

The database provides a complete foundation for:
- Student enrollment and progress tracking
- Program management and catalog
- Payment processing and order management  
- Assessment and grading systems
- Certificate generation and verification
- Referral and affiliate programs
- Content management and analytics

**Ready to build the future of internship education!** 🚀