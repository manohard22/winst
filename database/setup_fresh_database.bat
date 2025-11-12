@echo off
REM =============================================================================
REM WINST INTERNSHIP PORTAL - FRESH DATABASE SETUP SCRIPT (WINDOWS)
REM =============================================================================
REM This script creates a complete fresh database with schema and data
REM =============================================================================

echo 🚀 Starting Fresh Database Setup for Winst Internship Portal...
echo ==============================================================

REM Database configuration from .env
set DB_NAME=winst_portal_db
set DB_USER=winst_db_user
set DB_PASSWORD=winstpass123
set DB_HOST=localhost
set DB_PORT=5432

REM Check if PostgreSQL is accessible
pg_isready -h %DB_HOST% -p %DB_PORT% >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not running or not accessible
    echo Please ensure PostgreSQL is installed and running
    pause
    exit /b 1
)

echo ✅ PostgreSQL is running

REM Create database if it doesn't exist
echo 🗃️ Creating database '%DB_NAME%'...
set PGPASSWORD=%DB_PASSWORD%
createdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% 2>nul || echo Database already exists

REM Run schema creation
echo 📋 Creating database schema...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f winst_complete_schema.sql

if %errorlevel% equ 0 (
    echo ✅ Schema created successfully
) else (
    echo ❌ Schema creation failed
    pause
    exit /b 1
)

REM Run data population
echo 📊 Populating sample data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f winst_sample_data.sql

if %errorlevel% equ 0 (
    echo ✅ Sample data populated successfully
) else (
    echo ❌ Data population failed
    pause
    exit /b 1
)

echo.
echo 🎉 Fresh Database Setup Complete!
echo =================================
echo.
echo 📋 Database Summary:
echo • Database: %DB_NAME%
echo • Host: %DB_HOST%:%DB_PORT%
echo • User: %DB_USER%
echo.
echo 🔑 Test Login Credentials (Password: password123):
echo 👨‍💼 Admin: admin@winst.com
echo 🎓 Student: john.doe@gmail.com
echo 👨‍🏫 Mentor: mentor1@winst.com
echo 🤝 Affiliate: affiliate1@winst.com
echo.
echo 🚀 Next Steps:
echo 1. Update your backend .env file if needed
echo 2. Start your backend server: npm run dev
echo 3. Start your frontend application
echo.
echo 📚 Available Programs:
echo • Full Stack Web Development with MERN (12 weeks)
echo • Frontend Development with React (8 weeks)
echo • Backend Development with Python Django (10 weeks)
echo • DevOps and Cloud Computing with AWS (14 weeks)
echo • Mobile App Development with React Native (10 weeks)
echo • Data Science with Python (16 weeks)
echo.
echo ✨ Database is ready for comprehensive testing!

pause