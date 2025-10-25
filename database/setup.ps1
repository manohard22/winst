# 🎯 WINST DATABASE SETUP SCRIPT (PowerShell)
# This script creates a fresh PostgreSQL database with all features

Write-Host "🚀 Setting up Winst Database..." -ForegroundColor Green

# Database configuration (matching your .env file)
$DB_NAME = "winst_db"
$DB_USER = "winst_db_user"
$DB_PASSWORD = "root"
$DB_HOST = "localhost" 
$DB_PORT = "5432"

Write-Host "📊 Creating database and user..." -ForegroundColor Yellow

# Set environment variable for password
$env:PGPASSWORD = "postgres"  # Default postgres password, change if different

# Create database and user
$createDbScript = @"
-- Drop existing database if it exists
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create database and user
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
"@

# Execute database creation
$createDbScript | psql -h $DB_HOST -p $DB_PORT -U postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database and user created successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create database. Please ensure PostgreSQL is running and you have the correct postgres password." -ForegroundColor Red
    Write-Host "💡 Try updating the postgres password in this script if needed." -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Running schema and data setup..." -ForegroundColor Yellow

# Set password for the new user
$env:PGPASSWORD = $DB_PASSWORD

# Run the complete setup script
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "setup_fresh_database.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Setup Summary:" -ForegroundColor Cyan
    Write-Host "   Database: $DB_NAME" -ForegroundColor White
    Write-Host "   User: $DB_USER" -ForegroundColor White
    Write-Host "   Host: ${DB_HOST}:${DB_PORT}" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
    Write-Host "   Admin: admin@winst.com / admin123" -ForegroundColor White
    Write-Host "   Student: rahul.sharma@gmail.com / admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 You can now start your backend server with: npm run dev" -ForegroundColor Green
} else {
    Write-Host "❌ Database setup failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}