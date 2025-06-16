# Lucro Internship Portal Database

This directory contains the complete PostgreSQL database setup for the Lucro Internship Portal.

## 📁 Files Structure

```
database/
├── schema.sql          # Database schema with all tables
├── dummy_data.sql      # Sample data for development/testing
├── queries.sql         # Useful queries for analytics
├── setup.sh           # Automated setup script
└── README.md          # This file
```

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
chmod +x database/setup.sh
./database/setup.sh
```

### Option 2: Manual Setup

```bash
# 1. Create database
sudo -u postgres createdb lucro_portal

# 2. Create user
sudo -u postgres psql -c "CREATE USER lucro_admin WITH PASSWORD 'lucro_secure_2024';"

# 3. Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lucro_portal TO lucro_admin;"

# 4. Run schema
psql -U lucro_admin -d lucro_portal -f database/schema.sql

# 5. Insert dummy data
psql -U lucro_admin -d lucro_portal -f database/dummy_data.sql
```

## 📊 Database Schema Overview

### Core Tables

- **roles**: User roles (admin, student, mentor)
- **users**: User accounts and profiles
- **technologies**: Available internship programs
- **student_internship**: Student enrollments and progress

### Task Management

- **tasks**: Assignments and projects
- **task_submissions**: Student submissions and grades

### Payment System

- **orders**: Course orders and pricing
- **payments**: Payment transactions and status

### Additional Features

- **login_sessions**: User session tracking
- **internship_certificates**: Certificate management

## 👥 Sample Data Included

### Users

- **2 Admin users**: Full administrative access
- **10 Student users**: Various backgrounds and programs
- **Realistic profiles**: Names, emails, phone numbers, addresses

### Technologies (8 Programs)

- Web Development (₹15,000)
- Data Science (₹20,000)
- Mobile Development (₹18,000)
- Digital Marketing (₹12,000)
- Cloud Computing (₹16,000)
- Cybersecurity (₹22,000)
- DevOps (₹17,000)
- UI/UX Design (₹14,000)

### Sample Credentials

```
Admin Login:
- Email: admin@lucro.com
- Password: password123

Student Logins:
- Email: rahul@example.com
- Password: password123
- Email: priya@example.com
- Password: password123
```

## 📈 Analytics Queries

The `queries.sql` file includes ready-to-use queries for:

1. **Student Analytics**

   - Active students with progress
   - Top performing students
   - Task completion rates

2. **Financial Analytics**

   - Revenue by technology
   - Monthly payment trends
   - Pending payments

3. **Operational Analytics**

   - Overdue tasks
   - Mentor workload
   - Certificate eligibility

4. **Business Intelligence**
   - Technology popularity
   - Success rates
   - Completion analytics

## 🔧 Environment Configuration

Add these to your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lucro_portal
DB_USER=lucro_admin
DB_PASSWORD=lucro_secure_2024

# Connection String
DATABASE_URL=postgresql://lucro_admin:lucro_secure_2024@localhost:5432/lucro_portal
```

## 🔍 Data Verification

After setup, verify your data:

```sql
-- Check record counts
SELECT 'Users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'Technologies', COUNT(*) FROM technologies
UNION ALL
SELECT 'Active Students', COUNT(*) FROM student_internship WHERE status = 'active';

-- Check sample student
SELECT u.full_name, u.email, t.tech_name, si.progress_percentage
FROM users u
JOIN student_internship si ON u.user_id = si.student_id
JOIN technologies t ON si.tech_id = t.tech_id
WHERE u.email = 'rahul@example.com';
```

## 🛡️ Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Enable SSL for database connections
- Regular backup procedures recommended

## 📱 Integration with Node.js

Example connection setup:

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === "production",
});
```

## 🔄 Data Maintenance

### Regular Tasks

- Clean up old login sessions
- Archive completed internships
- Generate monthly reports
- Update student progress

### Backup Strategy

```bash
# Daily backup
pg_dump -U lucro_admin lucro_portal > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U lucro_admin lucro_portal < backup_20240121.sql
```

## 📞 Support

For database-related issues:

1. Check PostgreSQL logs
2. Verify connection parameters
3. Ensure proper permissions
4. Review schema constraints

---

**Note**: This database setup includes comprehensive sample data for development and testing. Modify as needed for production deployment.
