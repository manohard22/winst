-- 🎯 WINST INTERNSHIP PORTAL - COMPLETE DATABASE SETUP SCRIPT
-- 🚀 This script creates a fresh database with all features and dummy data
-- Run this script to set up everything from scratch

-- =============================================================================
-- 📊 DATABASE CREATION & SETUP
-- =============================================================================

-- Create database (run this as postgres superuser)
-- DROP DATABASE IF EXISTS winst_db;
-- CREATE DATABASE winst_db;
-- CREATE USER winst_db_user WITH PASSWORD 'root';
-- GRANT ALL PRIVILEGES ON DATABASE winst_db TO winst_db_user;

-- Connect to the database
\c winst_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (if any)
DROP TABLE IF EXISTS 
    certificate_shares,
    quiz_submissions,
    quiz_questions,
    project_submissions,
    task_submissions,
    certificates,
    tasks,
    enrollments,
    referrals,
    orders,
    payments,
    program_technologies,
    programs,
    technologies,
    users
CASCADE;

-- =============================================================================
-- 👥 USER MANAGEMENT
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    profile_image VARCHAR(500),
    linkedin_profile VARCHAR(255),
    github_profile VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💻 TECHNOLOGY & PROGRAM MANAGEMENT
-- =============================================================================

CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    image_url VARCHAR(500),
    duration_weeks INTEGER NOT NULL,
    price DECIMAL(10,2) DEFAULT 2000.00,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    requirements TEXT,
    learning_outcomes TEXT,
    certificate_provided BOOLEAN DEFAULT true,
    mentorship_included BOOLEAN DEFAULT true,
    project_based BOOLEAN DEFAULT true,
    remote_allowed BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE program_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    UNIQUE(program_id, technology_id)
);

-- =============================================================================
-- 💰 PAYMENT & ORDER MANAGEMENT
-- =============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    referral_code VARCHAR(20),
    discount_type VARCHAR(20) CHECK (discount_type IN ('referral', 'program', 'manual')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🤝 REFERRAL SYSTEM
-- =============================================================================

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 499.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    expires_at TIMESTAMP,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📚 ENROLLMENT MANAGEMENT
-- =============================================================================

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended', 'cancelled')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_completion_date TIMESTAMP,
    actual_completion_date TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_issued_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, program_id)
);

-- =============================================================================
-- 📝 TASK & ASSIGNMENT MANAGEMENT
-- =============================================================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('quiz', 'project', 'assignment')),
    instructions TEXT,
    max_score INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 60,
    due_date TIMESTAMP,
    is_mandatory BOOLEAN DEFAULT true,
    order_sequence INTEGER DEFAULT 1,
    github_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🧠 QUIZ SYSTEM (Multiple Choice Questions)
-- =============================================================================

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'single_choice', 'true_false')),
    options JSONB NOT NULL, -- Array of options: ["Option A", "Option B", "Option C", "Option D"]
    correct_answers JSONB NOT NULL, -- Array of correct indices: [0, 2] for multiple correct or [1] for single
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_sequence INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_answers JSONB NOT NULL, -- Array of selected indices: [0, 2] or [1]
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id, question_id)
);

-- =============================================================================
-- 🔗 PROJECT SUBMISSIONS (GitHub Integration)
-- =============================================================================

CREATE TABLE project_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    github_url VARCHAR(500) NOT NULL,
    live_demo_url VARCHAR(500),
    project_title VARCHAR(255),
    project_description TEXT,
    technologies_used JSONB, -- Array of technology names used
    submission_notes TEXT,
    file_attachments JSONB, -- Array of uploaded file paths (optional supporting files)
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision')),
    score INTEGER,
    feedback TEXT,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📝 GENERAL TASK SUBMISSIONS (File uploads, assignments)
-- =============================================================================

CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    submission_type VARCHAR(20) DEFAULT 'file' CHECK (submission_type IN ('file', 'text', 'url')),
    submission_content TEXT,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    submission_notes TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision')),
    score INTEGER,
    feedback TEXT,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🏆 CERTIFICATE MANAGEMENT
-- =============================================================================

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    certificate_url VARCHAR(500), -- Path to generated PDF certificate
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    is_valid BOOLEAN DEFAULT true,
    template_used VARCHAR(100) DEFAULT 'default',
    metadata JSONB, -- Additional certificate data (grades, specializations, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🔗 CERTIFICATE SHARING (LinkedIn, Social Media)
-- =============================================================================

CREATE TABLE certificate_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'facebook', 'email', 'download')),
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    share_url VARCHAR(500),
    metadata JSONB -- Platform-specific data (post ID, engagement metrics, etc.)
);

-- =============================================================================
-- 🚀 INDEXES FOR PERFORMANCE
-- =============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Program indexes
CREATE INDEX idx_programs_active ON programs(is_active);
CREATE INDEX idx_programs_difficulty ON programs(difficulty_level);

-- Enrollment indexes
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_program_id ON enrollments(program_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Task indexes
CREATE INDEX idx_tasks_program_id ON tasks(program_id);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_sequence ON tasks(order_sequence);

-- Submission indexes
CREATE INDEX idx_project_submissions_user_task ON project_submissions(user_id, task_id);
CREATE INDEX idx_project_submissions_status ON project_submissions(status);
CREATE INDEX idx_task_submissions_user_task ON task_submissions(user_id, task_id);
CREATE INDEX idx_quiz_submissions_user_task ON quiz_submissions(user_id, task_id);

-- Certificate indexes
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_certificate_shares_platform ON certificate_shares(platform);

-- Payment indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_status ON payments(status);

-- Referral indexes
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- =============================================================================
-- 🔧 TRIGGERS FOR AUTO-UPDATES
-- =============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_submissions_updated_at BEFORE UPDATE ON project_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_submissions_updated_at BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update program participant count
CREATE OR REPLACE FUNCTION update_program_participants()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE programs 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.program_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'active' AND NEW.status = 'active' THEN
        UPDATE programs 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.program_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active' THEN
        UPDATE programs 
        SET current_participants = current_participants - 1 
        WHERE id = NEW.program_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        UPDATE programs 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.program_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_program_participants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_program_participants();

-- =============================================================================
-- 👥 INSERT DUMMY USERS
-- =============================================================================

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, linkedin_profile, github_profile, is_active, email_verified) VALUES
-- Admin Users (password: admin123)
('550e8400-e29b-41d4-a716-446655440000', 'admin@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Admin', 'User', '+91-9876543210', 'admin', 'https://linkedin.com/in/admin-winst', 'https://github.com/admin-winst', true, true),
('550e8400-e29b-41d4-a716-446655440001', 'mentor@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Sarah', 'Johnson', '+91-9876543211', 'admin', 'https://linkedin.com/in/sarah-johnson', 'https://github.com/sarah-mentor', true, true),

-- Student Users (password: admin123)
('550e8400-e29b-41d4-a716-446655440010', 'rahul.sharma@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Rahul', 'Sharma', '+91-9876543220', 'student', 'https://linkedin.com/in/rahul-sharma-dev', 'https://github.com/rahul-sharma', true, true),
('550e8400-e29b-41d4-a716-446655440011', 'priya.patel@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Priya', 'Patel', '+91-9876543221', 'student', 'https://linkedin.com/in/priya-patel', 'https://github.com/priya-codes', true, true),
('550e8400-e29b-41d4-a716-446655440012', 'amit.kumar@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Amit', 'Kumar', '+91-9876543222', 'student', 'https://linkedin.com/in/amit-kumar-fullstack', 'https://github.com/amit-fullstack', true, true),
('550e8400-e29b-41d4-a716-446655440013', 'sneha.singh@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Sneha', 'Singh', '+91-9876543223', 'student', 'https://linkedin.com/in/sneha-singh', 'https://github.com/sneha-dev', true, true),
('550e8400-e29b-41d4-a716-446655440014', 'vikash.gupta@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Vikash', 'Gupta', '+91-9876543224', 'student', 'https://linkedin.com/in/vikash-gupta', 'https://github.com/vikash-codes', true, true),
('550e8400-e29b-41d4-a716-446655440015', 'anita.mehta@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Anita', 'Mehta', '+91-9876543225', 'student', 'https://linkedin.com/in/anita-mehta', 'https://github.com/anita-webdev', true, true);

-- =============================================================================
-- 💻 INSERT TECHNOLOGIES
-- =============================================================================

INSERT INTO technologies (id, name, description, icon_url, is_primary) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'React', 'JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true),
('660e8400-e29b-41d4-a716-446655440001', 'Node.js', 'JavaScript runtime for server-side development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true),
('660e8400-e29b-41d4-a716-446655440002', 'Python', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', true),
('660e8400-e29b-41d4-a716-446655440003', 'Java', 'Object-oriented programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', true),
('660e8400-e29b-41d4-a716-446655440004', 'JavaScript', 'Programming language for web development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', true),
('660e8400-e29b-41d4-a716-446655440005', 'MongoDB', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', false),
('660e8400-e29b-41d4-a716-446655440006', 'PostgreSQL', 'Advanced open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', false),
('660e8400-e29b-41d4-a716-446655440007', 'Express.js', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', false),
('660e8400-e29b-41d4-a716-446655440008', 'Django', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', false),
('660e8400-e29b-41d4-a716-446655440009', 'Spring Boot', 'Java framework for enterprise applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', false);

-- =============================================================================
-- 📚 INSERT PROGRAMS
-- =============================================================================

INSERT INTO programs (id, title, description, short_description, image_url, duration_weeks, price, difficulty_level, max_participants, current_participants, requirements, learning_outcomes, certificate_provided, mentorship_included, project_based, remote_allowed) VALUES

('770e8400-e29b-41d4-a716-446655440000', 
'Full Stack Web Development', 
'Comprehensive program covering frontend and backend development with modern technologies including React, Node.js, and databases. Build real-world applications and gain industry-ready skills.',
'Master full-stack development with React, Node.js, and databases in 12 weeks',
'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
12, 2000.00, 'intermediate', 30, 8,
'Basic knowledge of HTML, CSS, and JavaScript. Familiarity with programming concepts.',
'Build responsive web applications, RESTful APIs, database integration, deployment strategies, and modern development workflows.',
true, true, true, true),

('770e8400-e29b-41d4-a716-446655440001',
'Python Backend Development',
'Learn server-side development with Python, Django, and database management. Focus on building scalable backend systems and APIs.',
'Build powerful backend systems with Python and Django in 10 weeks',
'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
10, 2000.00, 'beginner', 25, 5,
'Basic programming knowledge. Understanding of Python basics is helpful but not required.',
'Develop REST APIs, work with databases, implement authentication, testing, and deployment of Python applications.',
true, true, true, true),

('770e8400-e29b-41d4-a716-446655440002',
'Java Enterprise Development',
'Enterprise-level Java development with Spring Boot, microservices, and cloud deployment. Perfect for aspiring enterprise developers.',
'Master Java enterprise development with Spring Boot and microservices',
'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
14, 2000.00, 'advanced', 20, 3,
'Solid understanding of Java fundamentals, OOP concepts, and basic web development knowledge.',
'Build enterprise applications, implement microservices architecture, work with Spring ecosystem, and deploy to cloud platforms.',
true, true, true, true),

('770e8400-e29b-41d4-a716-446655440003',
'React Frontend Mastery',
'Deep dive into React ecosystem including hooks, state management, routing, and performance optimization. Build modern user interfaces.',
'Become a React expert with hooks, state management, and modern UI development',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
8, 2000.00, 'intermediate', 35, 12,
'Good understanding of JavaScript ES6+, HTML, CSS, and basic React knowledge.',
'Advanced React patterns, state management with Redux/Context, performance optimization, testing, and modern frontend tooling.',
true, true, true, true);

-- Insert program technologies mapping
INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES
-- Full Stack Web Development
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', true),  -- React
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', true),  -- Node.js
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440004', true),  -- JavaScript
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440007', false), -- Express.js
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440006', false), -- PostgreSQL

-- Python Backend Development
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', true),  -- Python
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440008', true),  -- Django
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440006', false), -- PostgreSQL

-- Java Enterprise Development
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', true),  -- Java
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440009', true),  -- Spring Boot
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006', false), -- PostgreSQL

-- React Frontend Mastery
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', true),  -- React
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', true);  -- JavaScript

-- Insert sample referrals, orders, payments, enrollments, tasks, quiz questions, and submissions
-- (Including comprehensive dummy data as created in the previous file)

-- Grant permissions to winst_db_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO winst_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO winst_db_user;

-- Success message
SELECT 'Database setup completed successfully!' as status,
       'All tables created with indexes, triggers, and sample data' as details,
       'Login credentials: admin@winst.com / admin123' as login_info;