#!/bin/bash

# Lucro Internship Portal Database Setup Script
# This script sets up the PostgreSQL database with schema and dummy data

echo "🚀 Setting up Lucro Internship Portal Database..."

# Database configuration
DB_NAME="lucro_portal_db"
DB_USER="lucro_db_user"
DB_PASSWORD="root"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "📊 Creating database and user..."

# Create database and user (run as postgres user)
sudo -u postgres psql << EOF
-- Create database
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;

-- Create user
DROP USER IF EXISTS $DB_USER;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

\q
EOF

echo "✅ Database and user created successfully!"

echo "🏗️  Creating tables and schema..."

# Run schema creation
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully!"
else
    echo "❌ Error creating schema!"
    exit 1
fi

echo "📝 Inserting dummy data..."

# Run dummy data insertion
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/dummy_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Dummy data inserted successfully!"
else
    echo "❌ Error inserting dummy data!"
    exit 1
fi

echo "🔍 Running verification queries..."

# Verify data insertion
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Verification queries
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Technologies', COUNT(*) FROM technologies
UNION ALL
SELECT 'Student Internships', COUNT(*) FROM student_internship
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Task Submissions', COUNT(*) FROM task_submissions
UNION ALL
SELECT 'Certificates', COUNT(*) FROM internship_certificates;

\q
EOF

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Database Connection Details:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   Username: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo ""
echo "🔗 Connection String:"
echo "   postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "👥 Sample Login Credentials:"
echo "   Admin: admin@lucro.com / password123"
echo "   Student: rahul@example.com / password123"
echo ""
echo "💡 Next Steps:"
echo "   1. Update your .env file with the database connection details"
echo "   2. Install Node.js dependencies: npm install"
echo "   3. Start the development server: npm run dev"
