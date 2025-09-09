-- Enhanced Winst Internship Portal Database Schema
-- Additional tables for referral, assessment, and project submission

-- Referral system table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    discount_amount DECIMAL(10,2) DEFAULT 499.00,
    used_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate system table
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 25.00, -- 25% commission
    total_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate earnings tracking
CREATE TABLE IF NOT EXISTS affiliate_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
    options JSONB, -- For multiple choice options
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment attempts
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    time_taken INTEGER, -- in minutes
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment answers
CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project requirements table
CREATE TABLE IF NOT EXISTS project_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    evaluation_criteria TEXT,
    estimated_duration_weeks INTEGER DEFAULT 4,
    max_score INTEGER DEFAULT 100,
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project submissions table
CREATE TABLE IF NOT EXISTS project_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    project_requirement_id UUID REFERENCES project_requirements(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    github_url VARCHAR(300) NOT NULL,
    live_demo_url VARCHAR(300),
    documentation_url VARCHAR(300),
    video_demo_url VARCHAR(300),
    technologies_used TEXT,
    challenges_faced TEXT,
    learning_outcomes TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision')),
    score INTEGER,
    feedback TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate generation tracking
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_url VARCHAR(500),
    assessment_score DECIMAL(5,2),
    project_score INTEGER,
    final_grade VARCHAR(5),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT true,
    verification_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning journey tracking
CREATE TABLE IF NOT EXISTS learning_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    current_step VARCHAR(50) DEFAULT 'enrolled' CHECK (current_step IN ('enrolled', 'assessment_pending', 'assessment_completed', 'project_assigned', 'project_submitted', 'project_approved', 'certificate_issued')),
    step_completed_at TIMESTAMP,
    next_step VARCHAR(50),
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add referral_code and affiliate_code to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) CHECK (discount_type IN ('referral', 'affiliate', 'coupon'));

-- Add assessment and project completion tracking to student_internship
ALTER TABLE student_internship ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN DEFAULT false;
ALTER TABLE student_internship ADD COLUMN IF NOT EXISTS assessment_score DECIMAL(5,2);
ALTER TABLE student_internship ADD COLUMN IF NOT EXISTS project_submitted BOOLEAN DEFAULT false;
ALTER TABLE student_internship ADD COLUMN IF NOT EXISTS project_approved BOOLEAN DEFAULT false;
ALTER TABLE student_internship ADD COLUMN IF NOT EXISTS certificate_eligible BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student_id ON assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_program_id ON assessment_attempts(program_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_student_id ON project_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_journey_student_id ON learning_journey(student_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_requirements_updated_at BEFORE UPDATE ON project_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_submissions_updated_at BEFORE UPDATE ON project_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_journey_updated_at BEFORE UPDATE ON learning_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
