-- =============================================================================
-- 🎯 WINST INTERNSHIP PORTAL - COMPLETE FRESH DATABASE SCHEMA
-- =============================================================================
-- 📝 Production-Ready Database with All Features
-- 🚀 Comprehensive Schema for Internship Management Platform
-- 💰 Payment Integration | 📊 Assessment System | 🤝 Referral System | 📜 Certificates
-- =============================================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all existing tables in correct dependency order (for fresh start)
DROP TABLE IF EXISTS 
    user_sessions,
    affiliate_earnings,
    task_submissions,
    assessment_answers,
    assessment_attempts,
    assessment_questions,
    certificates,
    learning_journey,
    payments,
    orders,
    student_internship,
    tasks,
    project_requirements,
    referrals,
    affiliates,
    program_technologies,
    announcements,
    testimonials,
    internship_programs,
    technologies,
    users
CASCADE;

-- =============================================================================
-- 👥 CORE USER MANAGEMENT
-- =============================================================================

-- Users table supporting multiple roles (students, admins, mentors, affiliates)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'mentor', 'affiliate')),
    
    -- Profile Information
    profile_image VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    
    -- Educational Information (for students)
    college_name VARCHAR(200),
    degree VARCHAR(100),
    branch VARCHAR(100),
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    
    -- Professional Links
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    portfolio_url VARCHAR(300),
    resume_url VARCHAR(500),
    
    -- Status and Verification
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for JWT token management
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
-- 🛠️ TECHNOLOGIES & PROGRAM CATALOG
-- =============================================================================

-- Technology stack catalog
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

-- Internship programs with comprehensive details
CREATE TABLE internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Program Structure
    duration_weeks INTEGER NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    
    -- Capacity and Scheduling
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    registration_deadline DATE,
    
    -- Program Features
    certificate_provided BOOLEAN DEFAULT true,
    mentorship_included BOOLEAN DEFAULT true,
    project_based BOOLEAN DEFAULT true,
    remote_allowed BOOLEAN DEFAULT true,
    assessment_required BOOLEAN DEFAULT true,
    minimum_score_required DECIMAL(5,2) DEFAULT 70.00,
    
    -- Content
    requirements TEXT,
    learning_outcomes TEXT,
    syllabus TEXT,
    
    -- Media and Status
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between programs and technologies
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
-- 📚 STUDENT ENROLLMENT & PROGRESS TRACKING
-- =============================================================================

-- Student internship enrollments with progress tracking
CREATE TABLE student_internship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    
    -- Enrollment Details
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'assessment_pending', 'assessment_completed', 'project_phase', 'completed', 'dropped', 'suspended')),
    
    -- Progress Tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Grading and Certification
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url VARCHAR(500),
    final_grade VARCHAR(5),
    feedback TEXT,
    
    -- Mentorship
    mentor_id UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(student_id, program_id)
);

-- Learning journey step-by-step tracking
CREATE TABLE learning_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    
    -- Current State
    current_step VARCHAR(50) DEFAULT 'enrolled' CHECK (current_step IN ('enrolled', 'assessment_pending', 'assessment_in_progress', 'assessment_completed', 'tasks_assigned', 'tasks_in_progress', 'tasks_completed', 'project_phase', 'project_submitted', 'project_approved', 'certificate_issued', 'completed')),
    step_completed_at TIMESTAMP,
    next_step VARCHAR(50),
    
    -- Progress Details
    progress_percentage INTEGER DEFAULT 0,
    milestones_completed JSONB DEFAULT '[]',
    current_milestone VARCHAR(100),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🤝 REFERRAL SYSTEM
-- =============================================================================

-- Student referral system with discount tracking
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Reward Details
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    discount_amount DECIMAL(10,2) DEFAULT 499.00,
    referrer_reward DECIMAL(10,2) DEFAULT 0.00,
    
    -- Tracking
    used_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💰 AFFILIATE PROGRAM
-- =============================================================================

-- Affiliate partners management
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Commission Structure
    commission_rate DECIMAL(5,2) DEFAULT 25.00,
    
    -- Performance Metrics
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_earnings DECIMAL(10,2) DEFAULT 0,
    paid_earnings DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status and Payment
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    bank_details JSONB,
    tax_id VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💳 ORDERS & PAYMENT PROCESSING (RAZORPAY INTEGRATION)
-- =============================================================================

-- Orders with comprehensive tracking
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    
    -- Order Details
    order_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    
    -- Payment Gateway Integration
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(100),
    gateway_order_id VARCHAR(100),
    
    -- Discount Tracking
    referral_code VARCHAR(20),
    affiliate_code VARCHAR(20),
    discount_type VARCHAR(20) CHECK (discount_type IN ('referral', 'affiliate', 'coupon', 'promotional')),
    referrer_id UUID REFERENCES users(id),
    affiliate_id UUID REFERENCES affiliates(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions with gateway details
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    
    -- Gateway Integration
    gateway_transaction_id VARCHAR(200),
    gateway_payment_id VARCHAR(200),
    gateway_order_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    gateway_response TEXT,
    webhook_signature VARCHAR(500),
    
    -- Processing Details
    processed_at TIMESTAMP,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate earnings tracking
CREATE TABLE affiliate_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Commission Details
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and Processing
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(100),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📊 COMPREHENSIVE ASSESSMENT SYSTEM
-- =============================================================================

-- Assessment questions with multiple question types
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    
    -- Question Content
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'single_choice', 'true_false', 'short_answer')),
    options JSONB, -- For multiple choice questions
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    
    -- Scoring and Difficulty
    points INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    
    -- Organization
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment attempts
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    
    -- Attempt Details
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    earned_points INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    time_taken_minutes INTEGER,
    
    -- Status
    pass_status VARCHAR(20) DEFAULT 'pending' CHECK (pass_status IN ('pending', 'passed', 'failed')),
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual assessment answers
CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    
    -- Answer Details
    student_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    answer_order INTEGER,
    
    -- Timestamps
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📝 TASK & PROJECT MANAGEMENT
-- =============================================================================

-- Tasks and assignments with comprehensive details
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    
    -- Task Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(50) DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'project', 'quiz', 'presentation', 'code_review', 'research')),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    
    -- Scoring
    max_points INTEGER DEFAULT 100,
    passing_points INTEGER DEFAULT 70,
    
    -- Scheduling
    due_date TIMESTAMP,
    estimated_hours INTEGER,
    
    -- Content and Instructions
    instructions TEXT,
    resources TEXT,
    submission_format VARCHAR(100) DEFAULT 'github_link',
    requirements TEXT,
    evaluation_criteria TEXT,
    
    -- Configuration
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    allow_late_submission BOOLEAN DEFAULT true,
    late_penalty_percentage INTEGER DEFAULT 10,
    max_attempts INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    
    -- Creator
    created_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task submissions with comprehensive tracking
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    
    -- Submission Content
    submission_url VARCHAR(500),
    github_url VARCHAR(500),
    live_demo_url VARCHAR(500),
    submission_text TEXT,
    file_attachments JSONB,
    technologies_used JSONB,
    
    -- Submission Details
    time_spent_hours INTEGER,
    attempt_number INTEGER DEFAULT 1,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Status and Grading
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'resubmitted')),
    points_earned INTEGER,
    feedback TEXT,
    detailed_feedback JSONB,
    
    -- Review Details
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    revision_count INTEGER DEFAULT 0,
    
    -- Late Submission Handling
    is_late_submission BOOLEAN DEFAULT false,
    late_penalty_applied INTEGER DEFAULT 0,
    final_grade VARCHAR(5),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🏆 CERTIFICATE GENERATION & VERIFICATION
-- =============================================================================

-- Digital certificates with verification
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    
    -- Certificate Details
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_url VARCHAR(500),
    certificate_type VARCHAR(50) DEFAULT 'completion' CHECK (certificate_type IN ('completion', 'excellence', 'participation')),
    
    -- Performance Metrics
    assessment_score DECIMAL(5,2),
    project_score DECIMAL(5,2),
    final_grade VARCHAR(5),
    
    -- Verification
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT true,
    verification_code VARCHAR(50) UNIQUE,
    template_used VARCHAR(100),
    metadata JSONB,
    download_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📢 CONTENT MANAGEMENT
-- =============================================================================

-- Platform announcements and notifications
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general' CHECK (announcement_type IN ('general', 'urgent', 'program_specific', 'maintenance', 'feature', 'celebration')),
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'mentors', 'admins', 'affiliates')),
    program_id UUID REFERENCES internship_programs(id),
    
    -- Status and Priority
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    expires_at TIMESTAMP,
    read_count INTEGER DEFAULT 0,
    
    -- Creator
    created_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student testimonials and success stories
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(200) NOT NULL,
    student_role VARCHAR(200) NOT NULL,
    image_url VARCHAR(500),
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🚀 PERFORMANCE INDEXES
-- =============================================================================

-- User Management Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- Program and Technology Indexes
CREATE INDEX idx_programs_slug ON internship_programs(slug);
CREATE INDEX idx_programs_featured ON internship_programs(featured);
CREATE INDEX idx_programs_active ON internship_programs(is_active);
CREATE INDEX idx_programs_difficulty ON internship_programs(difficulty_level);
CREATE INDEX idx_technologies_category ON technologies(category);
CREATE INDEX idx_technologies_active ON technologies(is_active);

-- Enrollment and Progress Indexes
CREATE INDEX idx_student_internship_student_id ON student_internship(student_id);
CREATE INDEX idx_student_internship_program_id ON student_internship(program_id);
CREATE INDEX idx_student_internship_status ON student_internship(status);
CREATE INDEX idx_learning_journey_student_id ON learning_journey(student_id);
CREATE INDEX idx_learning_journey_current_step ON learning_journey(current_step);

-- Referral and Affiliate Indexes
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliate_earnings_affiliate_id ON affiliate_earnings(affiliate_id);
CREATE INDEX idx_affiliate_earnings_status ON affiliate_earnings(status);

-- Payment and Order Indexes
CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_gateway_order_id ON orders(gateway_order_id);
CREATE INDEX idx_orders_referral_code ON orders(referral_code);
CREATE INDEX idx_orders_affiliate_code ON orders(affiliate_code);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_gateway_order_id ON payments(gateway_order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Assessment System Indexes
CREATE INDEX idx_assessment_questions_program_id ON assessment_questions(program_id);
CREATE INDEX idx_assessment_attempts_student_id ON assessment_attempts(student_id);
CREATE INDEX idx_assessment_attempts_program_id ON assessment_attempts(program_id);
CREATE INDEX idx_assessment_answers_attempt_id ON assessment_answers(attempt_id);

-- Task and Submission Indexes
CREATE INDEX idx_tasks_program_id ON tasks(program_id);
CREATE INDEX idx_tasks_task_type ON tasks(task_type);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id);
CREATE INDEX idx_task_submissions_status ON task_submissions(status);

-- Certificate Indexes
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_program_id ON certificates(program_id);

-- Session Management Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Content Management Indexes
CREATE INDEX idx_announcements_type ON announcements(announcement_type);
CREATE INDEX idx_announcements_audience ON announcements(target_audience);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);

-- =============================================================================
-- ⚙️ TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON internship_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON student_internship FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_submissions_updated_at BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_journey_updated_at BEFORE UPDATE ON learning_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 📊 USEFUL VIEWS FOR ANALYTICS
-- =============================================================================

-- Student progress overview
CREATE OR REPLACE VIEW student_progress_overview AS
SELECT 
    u.id as student_id,
    u.full_name as student_name,
    u.email,
    ip.title as program_title,
    si.status as enrollment_status,
    si.progress_percentage,
    si.start_date,
    si.expected_completion_date,
    si.certificate_issued,
    COUNT(ts.id) as total_submissions,
    COUNT(CASE WHEN ts.status = 'approved' THEN 1 END) as approved_submissions,
    AVG(ts.points_earned) as average_score
FROM users u
JOIN student_internship si ON u.id = si.student_id
JOIN internship_programs ip ON si.program_id = ip.id
LEFT JOIN task_submissions ts ON si.id = ts.enrollment_id
WHERE u.role = 'student'
GROUP BY u.id, u.full_name, u.email, ip.title, si.status, si.progress_percentage, 
         si.start_date, si.expected_completion_date, si.certificate_issued;

-- Program performance analytics
CREATE OR REPLACE VIEW program_performance AS
SELECT 
    ip.id as program_id,
    ip.title,
    ip.difficulty_level,
    ip.price,
    ip.final_price,
    COUNT(si.id) as total_enrollments,
    COUNT(CASE WHEN si.status = 'completed' THEN 1 END) as completions,
    COUNT(CASE WHEN si.certificate_issued = true THEN 1 END) as certificates_issued,
    ROUND(AVG(si.progress_percentage), 2) as average_progress,
    COUNT(CASE WHEN si.status = 'dropped' THEN 1 END) as dropouts,
    ROUND((COUNT(CASE WHEN si.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(si.id), 0)), 2) as completion_rate
FROM internship_programs ip
LEFT JOIN student_internship si ON ip.id = si.program_id
GROUP BY ip.id, ip.title, ip.difficulty_level, ip.price, ip.final_price;

-- Affiliate performance dashboard
CREATE OR REPLACE VIEW affiliate_performance AS
SELECT 
    u.full_name as affiliate_name,
    u.email,
    a.affiliate_code,
    a.total_referrals,
    a.successful_referrals,
    a.total_earnings,
    a.pending_earnings,
    a.paid_earnings,
    a.conversion_rate,
    COUNT(ae.id) as total_transactions,
    SUM(ae.commission_amount) as total_commissions
FROM affiliates a
JOIN users u ON a.user_id = u.id
LEFT JOIN affiliate_earnings ae ON a.id = ae.affiliate_id
GROUP BY u.full_name, u.email, a.affiliate_code, a.total_referrals, a.successful_referrals, 
         a.total_earnings, a.pending_earnings, a.paid_earnings, a.conversion_rate;

-- =============================================================================
-- 🎉 DATABASE SETUP COMPLETE
-- =============================================================================

-- Display setup completion message
DO $$
BEGIN
    RAISE NOTICE '🎉 WINST INTERNSHIP PORTAL DATABASE SETUP COMPLETE!';
    RAISE NOTICE '✅ All tables created with proper relationships';
    RAISE NOTICE '✅ Comprehensive indexes added for performance';
    RAISE NOTICE '✅ Triggers and functions implemented';
    RAISE NOTICE '✅ Analytics views created';
    RAISE NOTICE '📊 Ready for comprehensive internship management';
    RAISE NOTICE '🚀 Next step: Run the data population script';
END $$;