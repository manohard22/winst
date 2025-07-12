-- 🎯 LUCRO INTERNSHIP PORTAL - COMPLETE FRESH DATABASE SCHEMA
-- 🔧 Core Infrastructure with 4 Major Features Implementation
-- 📊 Assessment System | 🤝 Referral Friend System | 💰 Affiliate Program | 📝 Task Submissions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all existing tables in dependency order (for fresh start)
DROP TABLE IF EXISTS 
    user_sessions,
    internship_certificates,
    task_submissions,
    tasks,
    assessment_answers,
    assessment_attempts,
    assessment_questions,
    project_submissions,
    project_requirements,
    learning_journey,
    certificates,
    affiliate_earnings,
    affiliates,
    referrals,
    payments,
    orders,
    student_internship,
    program_technologies,
    internship_programs,
    technologies,
    announcements,
    users
CASCADE;

-- =============================================================================
-- 👥 CORE USER MANAGEMENT
-- =============================================================================

-- Users table (students, admins, mentors, affiliates)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'mentor', 'affiliate')),
    profile_image VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    college_name VARCHAR(200),
    degree VARCHAR(100),
    branch VARCHAR(100),
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    portfolio_url VARCHAR(300),
    resume_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🎓 PROGRAMS & TECHNOLOGIES
-- =============================================================================

-- Technologies table
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(300),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internship programs table
CREATE TABLE internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    duration_weeks INTEGER NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    price DECIMAL(10,2) NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    registration_deadline DATE,
    certificate_provided BOOLEAN DEFAULT true,
    mentorship_included BOOLEAN DEFAULT true,
    project_based BOOLEAN DEFAULT true,
    remote_allowed BOOLEAN DEFAULT true,
    assessment_required BOOLEAN DEFAULT true,
    minimum_score_required DECIMAL(5,2) DEFAULT 70.00,
    requirements TEXT,
    learning_outcomes TEXT,
    syllabus TEXT,
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program technologies mapping
CREATE TABLE program_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, technology_id)
);

-- =============================================================================
-- 🤝 REFERRAL FRIEND SYSTEM (Requirement 2)
-- =============================================================================

-- Referral system - ₹499 discount for friends
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    discount_amount DECIMAL(10,2) DEFAULT 499.00,
    used_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    referrer_reward DECIMAL(10,2) DEFAULT 0.00, -- Future reward for referrer
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💰 AFFILIATE PROGRAM (Requirement 3)
-- =============================================================================

-- Affiliate system - 25% commission structure
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 25.00, -- 25% commission
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_earnings DECIMAL(10,2) DEFAULT 0,
    paid_earnings DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    bank_details JSONB,
    tax_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate earnings tracking with detailed metrics
CREATE TABLE affiliate_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🎯 ASSESSMENT SYSTEM (Requirement 1)
-- =============================================================================

-- Assessment questions with multiple difficulty levels
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'coding')),
    options JSONB, -- For multiple choice options: {"A": "Option 1", "B": "Option 2", ...}
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    topic VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    time_limit_seconds INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment attempts with timing and completion tracking
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    total_questions INTEGER NOT NULL,
    answered_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    max_possible_points INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    time_limit_seconds INTEGER DEFAULT 3600, -- 1 hour default
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted', 'timed_out', 'cancelled')),
    pass_status VARCHAR(20) DEFAULT 'pending' CHECK (pass_status IN ('pending', 'passed', 'failed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual assessment answers with correctness validation
CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    answer_order INTEGER,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📝 TASK SUBMISSIONS SYSTEM (Requirement 4)
-- =============================================================================

-- Tasks/Assignments with multiple types
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(50) DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'project', 'quiz', 'presentation', 'code_review', 'research')),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_points INTEGER DEFAULT 100,
    passing_points INTEGER DEFAULT 70,
    due_date TIMESTAMP,
    instructions TEXT,
    resources TEXT,
    submission_format VARCHAR(100) DEFAULT 'github_link',
    requirements TEXT,
    evaluation_criteria TEXT,
    estimated_hours INTEGER,
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    allow_late_submission BOOLEAN DEFAULT true,
    late_penalty_percentage INTEGER DEFAULT 10,
    max_attempts INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task submissions with comprehensive tracking
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_title VARCHAR(200),
    submission_text TEXT,
    submission_url VARCHAR(500),
    github_url VARCHAR(300),
    live_demo_url VARCHAR(300),
    documentation_url VARCHAR(300),
    video_demo_url VARCHAR(300),
    technologies_used TEXT,
    challenges_faced TEXT,
    learning_outcomes TEXT,
    time_spent_hours INTEGER,
    attempt_number INTEGER DEFAULT 1,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'resubmitted')),
    points_earned INTEGER,
    feedback TEXT,
    detailed_feedback JSONB, -- Structured feedback for different aspects
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    revision_count INTEGER DEFAULT 0,
    is_late_submission BOOLEAN DEFAULT false,
    late_penalty_applied INTEGER DEFAULT 0,
    final_grade VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📚 ENROLLMENT & PROGRESS TRACKING
-- =============================================================================

-- Student internship enrollments with enhanced tracking
CREATE TABLE student_internship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'assessment_pending', 'assessment_completed', 'project_phase', 'completed', 'dropped', 'suspended')),
    progress_percentage INTEGER DEFAULT 0,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    mentor_id UUID REFERENCES users(id),
    
    -- Assessment tracking
    assessment_completed BOOLEAN DEFAULT false,
    assessment_score DECIMAL(5,2),
    assessment_attempts INTEGER DEFAULT 0,
    assessment_passed BOOLEAN DEFAULT false,
    
    -- Task/Project tracking
    tasks_assigned INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    tasks_passed INTEGER DEFAULT 0,
    average_task_score DECIMAL(5,2) DEFAULT 0,
    
    -- Certificate tracking
    certificate_eligible BOOLEAN DEFAULT false,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url VARCHAR(500),
    
    -- Final grading
    final_grade VARCHAR(5),
    final_score DECIMAL(5,2),
    feedback TEXT,
    completion_certificate_number VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning journey step-by-step tracking
CREATE TABLE learning_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    current_step VARCHAR(50) DEFAULT 'enrolled' CHECK (current_step IN ('enrolled', 'assessment_pending', 'assessment_in_progress', 'assessment_completed', 'tasks_assigned', 'tasks_in_progress', 'tasks_completed', 'project_phase', 'project_submitted', 'project_approved', 'certificate_issued', 'completed')),
    step_completed_at TIMESTAMP,
    next_step VARCHAR(50),
    progress_percentage INTEGER DEFAULT 0,
    milestones_completed JSONB DEFAULT '[]',
    current_milestone VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💳 ORDERS & PAYMENTS
-- =============================================================================

-- Orders with referral and affiliate tracking
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(100),
    
    -- Referral and Affiliate tracking
    referral_code VARCHAR(20),
    affiliate_code VARCHAR(20),
    discount_type VARCHAR(20) CHECK (discount_type IN ('referral', 'affiliate', 'coupon', 'promotional')),
    referrer_id UUID REFERENCES users(id),
    affiliate_id UUID REFERENCES affiliates(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_transaction_id VARCHAR(200),
    gateway_payment_id VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    gateway_response TEXT,
    processed_at TIMESTAMP,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🏆 CERTIFICATES & ACHIEVEMENTS
-- =============================================================================

-- Certificate generation and verification
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_url VARCHAR(500),
    certificate_type VARCHAR(50) DEFAULT 'completion' CHECK (certificate_type IN ('completion', 'excellence', 'participation')),
    assessment_score DECIMAL(5,2),
    project_score DECIMAL(5,2),
    final_grade VARCHAR(5),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT true,
    verification_code VARCHAR(50) UNIQUE,
    template_used VARCHAR(100),
    metadata JSONB,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📢 ANNOUNCEMENTS & COMMUNICATION
-- =============================================================================

-- Announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general' CHECK (announcement_type IN ('general', 'urgent', 'program_specific', 'maintenance', 'feature', 'celebration')),
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'mentors', 'admins', 'affiliates')),
    program_id UUID REFERENCES internship_programs(id),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    expires_at TIMESTAMP,
    read_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🔐 USER SESSIONS & SECURITY
-- =============================================================================

-- User sessions for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📊 PERFORMANCE INDEXES
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Programs indexes
CREATE INDEX idx_programs_slug ON internship_programs(slug);
CREATE INDEX idx_programs_featured ON internship_programs(featured);
CREATE INDEX idx_programs_active ON internship_programs(is_active);

-- Enrollment indexes
CREATE INDEX idx_student_internship_student_id ON student_internship(student_id);
CREATE INDEX idx_student_internship_program_id ON student_internship(program_id);
CREATE INDEX idx_student_internship_status ON student_internship(status);

-- Referral system indexes
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- Affiliate system indexes
CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliate_earnings_affiliate_id ON affiliate_earnings(affiliate_id);
CREATE INDEX idx_affiliate_earnings_status ON affiliate_earnings(status);

-- Assessment system indexes
CREATE INDEX idx_assessment_questions_program_id ON assessment_questions(program_id);
CREATE INDEX idx_assessment_attempts_student_id ON assessment_attempts(student_id);
CREATE INDEX idx_assessment_attempts_program_id ON assessment_attempts(program_id);
CREATE INDEX idx_assessment_answers_attempt_id ON assessment_answers(attempt_id);

-- Task submission indexes
CREATE INDEX idx_tasks_program_id ON tasks(program_id);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id);
CREATE INDEX idx_task_submissions_status ON task_submissions(status);

-- Orders and payments indexes
CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_referral_code ON orders(referral_code);
CREATE INDEX idx_orders_affiliate_code ON orders(affiliate_code);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Certificates indexes
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);

-- Sessions indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- =============================================================================
-- ⚙️ TRIGGERS & FUNCTIONS
-- =============================================================================

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internship_programs_updated_at BEFORE UPDATE ON internship_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_internship_updated_at BEFORE UPDATE ON student_internship FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_submissions_updated_at BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_journey_updated_at BEFORE UPDATE ON learning_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 📈 ANALYTICS VIEWS
-- =============================================================================

-- Student dashboard summary view
CREATE OR REPLACE VIEW student_dashboard_summary AS
SELECT 
    si.student_id,
    u.full_name,
    u.email,
    COUNT(si.id) as total_enrollments,
    COUNT(CASE WHEN si.status = 'completed' THEN 1 END) as completed_programs,
    COUNT(CASE WHEN si.certificate_issued = true THEN 1 END) as certificates_earned,
    AVG(si.final_score) as average_score,
    SUM(CASE WHEN si.assessment_passed = true THEN 1 ELSE 0 END) as assessments_passed,
    SUM(si.tasks_completed) as total_tasks_completed
FROM student_internship si
JOIN users u ON si.student_id = u.id
GROUP BY si.student_id, u.full_name, u.email;

-- Referral performance view
CREATE OR REPLACE VIEW referral_performance AS
SELECT 
    r.referrer_id,
    u.full_name as referrer_name,
    COUNT(r.id) as total_referrals,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as successful_referrals,
    SUM(CASE WHEN r.status = 'completed' THEN r.discount_amount ELSE 0 END) as total_savings_provided,
    ROUND(COUNT(CASE WHEN r.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(r.id), 0), 2) as conversion_rate
FROM referrals r
JOIN users u ON r.referrer_id = u.id
GROUP BY r.referrer_id, u.full_name;

-- Affiliate summary view
CREATE OR REPLACE VIEW affiliate_summary AS
SELECT 
    a.id as affiliate_id,
    u.full_name as affiliate_name,
    a.affiliate_code,
    a.total_referrals,
    a.successful_referrals,
    a.total_earnings,
    a.pending_earnings,
    a.paid_earnings,
    a.conversion_rate,
    COUNT(ae.id) as total_transactions
FROM affiliates a
JOIN users u ON a.user_id = u.id
LEFT JOIN affiliate_earnings ae ON a.id = ae.affiliate_id
GROUP BY a.id, u.full_name, a.affiliate_code, a.total_referrals, a.successful_referrals, 
         a.total_earnings, a.pending_earnings, a.paid_earnings, a.conversion_rate;

-- Program performance view
CREATE OR REPLACE VIEW program_performance AS
SELECT 
    ip.id as program_id,
    ip.title,
    ip.difficulty_level,
    COUNT(si.id) as total_enrollments,
    COUNT(CASE WHEN si.status = 'completed' THEN 1 END) as completions,
    COUNT(CASE WHEN si.certificate_issued = true THEN 1 END) as certificates_issued,
    AVG(si.final_score) as average_final_score,
    AVG(si.assessment_score) as average_assessment_score,
    ROUND(COUNT(CASE WHEN si.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(si.id), 0), 2) as completion_rate
FROM internship_programs ip
LEFT JOIN student_internship si ON ip.id = si.program_id
GROUP BY ip.id, ip.title, ip.difficulty_level;

-- Assessment analytics view
CREATE OR REPLACE VIEW assessment_analytics AS
SELECT 
    aa.program_id,
    ip.title as program_title,
    COUNT(aa.id) as total_attempts,
    COUNT(CASE WHEN aa.pass_status = 'passed' THEN 1 END) as passed_attempts,
    AVG(aa.score_percentage) as average_score,
    AVG(aa.time_taken_seconds) as average_time_taken,
    ROUND(COUNT(CASE WHEN aa.pass_status = 'passed' THEN 1 END) * 100.0 / NULLIF(COUNT(aa.id), 0), 2) as pass_rate
FROM assessment_attempts aa
JOIN internship_programs ip ON aa.program_id = ip.id
WHERE aa.status = 'completed'
GROUP BY aa.program_id, ip.title;

-- 🎉 SCHEMA CREATION COMPLETE!
-- ✅ All 4 major features implemented:
-- 1. Assessment System with questions, attempts, and scoring
-- 2. Referral Friend System with ₹499 discount
-- 3. Affiliate Program with 25% commission
-- 4. Task Submissions with comprehensive tracking
