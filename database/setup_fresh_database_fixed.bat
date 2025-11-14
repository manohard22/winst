@echo off
REM =============================================================================
REM WINST INTERNSHIP PORTAL - FRESH DATABASE SETUP SCRIPT (WINDOWS - FIXED)
REM =============================================================================
REM This script creates a complete fresh database with schema and data
REM =============================================================================

setlocal enabledelayedexpansion

echo.
echo Starting Fresh Database Setup for Winst Internship Portal...
echo ==============================================================

REM Database configuration
set DB_NAME=winst_portal_db
set DB_USER=winst_db_user
set DB_PASSWORD=winstpass123
set DB_HOST=localhost
set DB_PORT=5432
set POSTGRES_PASSWORD=admin123

REM Add PostgreSQL bin folder to PATH for this session
set PATH=C:\Program Files\PostgreSQL\14\bin;%PATH%

REM Check if PostgreSQL is accessible
echo.
echo Checking PostgreSQL connectivity...
pg_isready -h %DB_HOST% -p %DB_PORT% >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is not running or not accessible
    echo Please ensure PostgreSQL is installed and running
    pause
    exit /b 1
)

echo [OK] PostgreSQL is running

REM First, create database user if it doesn't exist
echo.
echo Setting up database user '%DB_USER%'...
set PGPASSWORD=%POSTGRES_PASSWORD%

REM Try to create the user
psql -h %DB_HOST% -p %DB_PORT% -U postgres -d postgres -c "CREATE USER \"%DB_USER%\" WITH PASSWORD '%DB_PASSWORD%';" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] User %DB_USER% may already exist, updating password...
    psql -h %DB_HOST% -p %DB_PORT% -U postgres -d postgres -c "ALTER USER \"%DB_USER%\" WITH PASSWORD '%DB_PASSWORD%';" >nul 2>&1
)

REM Create database if it doesn't exist
echo Creating database '%DB_NAME%'...
psql -h %DB_HOST% -p %DB_PORT% -U postgres -d postgres -c "CREATE DATABASE \"%DB_NAME%\" OWNER \"%DB_USER%\";" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Database %DB_NAME% already exists
)

REM Grant privileges
echo Granting privileges...
psql -h %DB_HOST% -p %DB_PORT% -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"%DB_NAME%\" TO \"%DB_USER%\";" >nul 2>&1

REM Now run schema creation with the new user
echo.
echo Creating database schema...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f winst_complete_schema.sql

if %errorlevel% equ 0 (
    echo [OK] Schema created successfully
) else (
    echo [ERROR] Schema creation failed
    pause
    exit /b 1
)

REM Run data population
echo.
echo Populating sample data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f winst_sample_data.sql

if %errorlevel% equ 0 (
    echo [OK] Sample data populated successfully
) else (
    echo [ERROR] Data population failed
    pause
    exit /b 1
)

echo.
echo ===================================
echo Fresh Database Setup Complete!
echo ===================================
echo.
echo Database Summary:
echo   Database: %DB_NAME%
echo   Host: %DB_HOST%:%DB_PORT%
echo   User: %DB_USER%
echo.
echo Test Login Credentials (Password: password123):
echo   Admin: admin@winst.com
echo   Student: john.doe@gmail.com
echo   Mentor: mentor1@winst.com
echo   Affiliate: affiliate1@winst.com
echo.
echo Next Steps:
echo   1. Update your backend .env file if needed
echo   2. Start your backend server: npm run dev
echo   3. Start your frontend application
echo.
echo Available Programs:
echo   - Full Stack Web Development with MERN (12 weeks)
echo   - Frontend Development with React (8 weeks)
echo   - Backend Development with Python Django (10 weeks)
echo   - DevOps and Cloud Computing with AWS (14 weeks)
echo   - Mobile App Development with React Native (10 weeks)
echo   - Data Science with Python (16 weeks)
echo.
echo Database is ready for comprehensive testing!
echo.

pause
