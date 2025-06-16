-- LUCRO INTERNSHIP PORTAL DATABASE SCHEMA
-- PostgreSQL Database Setup

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS internship_certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS student_internship CASCADE;
DROP TABLE IF EXISTS technologies CASCADE;
DROP TABLE IF EXISTS login_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ROLES TABLE
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL  -- e.g., 'admin', 'student'
);

-- USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(15),
    education_level VARCHAR(50),
    field_of_study VARCHAR(100),
    address TEXT,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- LOGIN SESSIONS TABLE
CREATE TABLE login_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- TECHNOLOGIES TABLE
CREATE TABLE technologies (
    tech_id SERIAL PRIMARY KEY,
    tech_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INTEGER,
    price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE
);

-- STUDENT INTERNSHIP TABLE
CREATE TABLE student_internship (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(user_id),
    tech_id INTEGER REFERENCES technologies(tech_id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',  -- active, completed, dropped, pending
    progress_percentage INTEGER DEFAULT 0,
    mentor_assigned VARCHAR(100),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS TABLE
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tech_id INTEGER REFERENCES technologies(tech_id),
    assigned_to INTEGER REFERENCES users(user_id), -- only student
    created_by INTEGER REFERENCES users(user_id), -- admin who created
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, overdue
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASK SUBMISSIONS TABLE
CREATE TABLE task_submissions (
    submission_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(task_id),
    student_id INTEGER REFERENCES users(user_id),
    submission_text TEXT,
    submission_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    grade VARCHAR(10),
    reviewed_by INTEGER REFERENCES users(user_id),
    reviewed_at TIMESTAMP
);

-- ORDER MANAGEMENT TABLE
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(user_id),
    tech_id INTEGER REFERENCES technologies(tech_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, cancelled
    order_description TEXT
);

-- PAYMENTS TABLE
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    amount DECIMAL(10, 2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
    transaction_id VARCHAR(100),
    payment_gateway VARCHAR(50),
    gateway_response TEXT
);

-- INTERNSHIP CERTIFICATES TABLE
CREATE TABLE internship_certificates (
    certificate_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(user_id),
    tech_id INTEGER REFERENCES technologies(tech_id),
    issue_date DATE,
    certificate_url TEXT,
    certificate_number VARCHAR(50) UNIQUE,
    remarks TEXT,
    issued_by INTEGER REFERENCES users(user_id),
    is_verified BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_student_internship_student ON student_internship(student_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_tech ON tasks(tech_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_orders_student ON orders(student_id);
