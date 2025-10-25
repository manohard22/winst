#!/bin/bash

# 🎯 WINST DATABASE SETUP SCRIPT
# This script creates a fresh PostgreSQL database with all features

echo "🚀 Setting up Winst Database..."

# Database configuration (matching your .env file)
DB_NAME="winst_db"
DB_USER="winst_db_user"
DB_PASSWORD="root"
DB_HOST="localhost"
DB_PORT="5432"

echo "📊 Creating database and user..."

# Create database and user (run as postgres superuser)
sudo -u postgres psql <<EOF
-- Drop existing database if it exists
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create database and user
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Exit
\q
EOF

echo "✅ Database and user created successfully!"

echo "📝 Running schema and data setup..."

# Run the complete setup script
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f setup_fresh_database.sql

if [ $? -eq 0 ]; then
    echo "🎉 Database setup completed successfully!"
    echo ""
    echo "📋 Setup Summary:"
    echo "   Database: $DB_NAME"
    echo "   User: $DB_USER"
    echo "   Host: $DB_HOST:$DB_PORT"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Admin: admin@winst.com / admin123"
    echo "   Student: rahul.sharma@gmail.com / admin123"
    echo ""
    echo "🚀 You can now start your backend server!"
else
    echo "❌ Database setup failed. Please check the error messages above."
    exit 1
fi