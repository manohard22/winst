const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Create a comprehensive database setup script
const setupCompleteDatabase = async () => {
  console.log('🚀 Starting complete database setup...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);

  // First connect to postgres database to create our target database
  const adminPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  let adminClient;
  try {
    adminClient = await adminPool.connect();
    
    // Drop database if exists and create new one
    console.log('🗑️  Dropping existing database if exists...');
    await adminClient.query(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`);
    
    console.log('🆕 Creating new database...');
    await adminClient.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    console.log('✅ Database created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating database:', error);
    throw error;
  } finally {
    if (adminClient) adminClient.release();
    await adminPool.end();
  }

  // Now connect to our new database
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  let client;
  try {
    client = await pool.connect();

    // Create UUID extension
    console.log('🔧 Creating UUID extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create complete schema
    console.log('📋 Creating database schema...');
    const schemaSQL = `
-- =============================================================================
-- 👥 CORE USER MANAGEMENT
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'mentor', 'affiliate')),
    college_name VARCHAR(200),
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    linkedin_profile VARCHAR(255),
    github_profile VARCHAR(255),
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🎓 PROGRAMS & TECHNOLOGIES
-- =============================================================================

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
-- 📚 ENROLLMENT & PROGRESS TRACKING
-- =============================================================================

CREATE TABLE student_internship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'suspended')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    certificate_issued BOOLEAN DEFAULT false,
    final_grade VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, program_id)
);

-- =============================================================================
-- 💰 PAYMENT & ORDER MANAGEMENT
-- =============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    referral_discount DECIMAL(10,2) DEFAULT 0.00,
    affiliate_discount DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_transaction_id VARCHAR(200),
    gateway_payment_id VARCHAR(200),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    gateway_response JSONB,
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🤝 REFERRAL FRIEND SYSTEM
-- =============================================================================

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
    referrer_reward DECIMAL(10,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💸 AFFILIATE PROGRAM SYSTEM
-- =============================================================================

CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    total_referrals INTEGER DEFAULT 0,
    successful_conversions INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
    bank_account_number VARCHAR(50),
    bank_ifsc_code VARCHAR(20),
    bank_account_holder_name VARCHAR(200),
    pan_number VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE affiliate_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    payout_date TIMESTAMP,
    payout_transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📝 TASKS & ASSESSMENTS
-- =============================================================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(20) DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'project', 'quiz', 'assessment', 'practical')),
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_points INTEGER DEFAULT 100,
    estimated_duration_hours INTEGER,
    due_date TIMESTAMP,
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER,
    instructions TEXT,
    resources JSONB,
    submission_format VARCHAR(50) DEFAULT 'file' CHECK (submission_format IN ('file', 'url', 'text', 'code')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    submission_content TEXT,
    submission_url VARCHAR(500),
    file_attachments JSONB,
    github_url VARCHAR(500),
    time_spent_hours INTEGER,
    attempt_number INTEGER DEFAULT 1,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'resubmitted')),
    points_earned INTEGER,
    feedback TEXT,
    detailed_feedback JSONB,
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
-- 🏆 CERTIFICATES
-- =============================================================================

CREATE TABLE internship_certificates (
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
-- 💬 TESTIMONIALS
-- =============================================================================

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(200) NOT NULL,
    student_role VARCHAR(200) NOT NULL,
    image_url VARCHAR(500),
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🔐 USER SESSIONS & SECURITY
-- =============================================================================

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

-- Technologies indexes
CREATE INDEX idx_technologies_category ON technologies(category);
CREATE INDEX idx_technologies_active ON technologies(is_active);

-- Enrollment indexes
CREATE INDEX idx_student_internship_student_id ON student_internship(student_id);
CREATE INDEX idx_student_internship_program_id ON student_internship(program_id);
CREATE INDEX idx_student_internship_status ON student_internship(status);

-- Referral system indexes
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- Order and payment indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Task and submission indexes
CREATE INDEX idx_tasks_program_id ON tasks(program_id);
CREATE INDEX idx_task_submissions_user_id ON task_submissions(user_id);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
    `;

    await client.query(schemaSQL);
    console.log('✅ Database schema created successfully!');

    // Insert dummy data
    console.log('📊 Inserting comprehensive dummy data...');
    
    // Insert users
    await client.query(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role, college_name, degree, field_of_study, year_of_study, cgpa, linkedin_profile, github_profile, is_active, email_verified) VALUES
      ('550e8400-e29b-41d4-a716-446655440000', 'admin@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Admin', 'User', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true),
      ('550e8400-e29b-41d4-a716-446655440001', 'student1@winst.com', '8a0bb5e689cca85efd698ad50520d105:890727178552c5da0013c68f0b58e546f4e378fb2a4343101e1590e3e49b36121a2335460d0381a0386244692d033ec2b0032682bf099df29a006360772d1accd', 'Rahul', 'Kumar', 'student', 'Delhi University', 'B.Tech', 'Computer Science', 3, 8.5, 'https://linkedin.com/in/rahul-kumar', 'https://github.com/rahul-kumar', true, true),
      ('550e8400-e29b-41d4-a716-446655440002', 'student2@winst.com', '8a0bb5e689cca85efd698ad50520d105:890727178552c5da0013c68f0b58e546f4e378fb2a4343101e1590e3e49b36121a2335460d0381a0386244692d033ec2b0032682bf099df29a006360772d1accd', 'Priya', 'Sharma', 'student', 'Mumbai University', 'BCA', 'Computer Applications', 2, 7.8, 'https://linkedin.com/in/priya-sharma', 'https://github.com/priya-sharma', true, true),
      ('550e8400-e29b-41d4-a716-446655440003', 'mentor@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Dr. Amit', 'Verma', 'mentor', 'IIT Delhi', 'PhD', 'Computer Science', NULL, NULL, 'https://linkedin.com/in/dr-amit-verma', 'https://github.com/dr-amit', true, true),
      ('550e8400-e29b-41d4-a716-446655440004', 'affiliate@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Ravi', 'Gupta', 'affiliate', 'Bangalore University', 'MBA', 'Marketing', NULL, NULL, 'https://linkedin.com/in/ravi-gupta', NULL, true, true)
    `);

    // Insert technologies
    await client.query(`
      INSERT INTO technologies (id, name, category, description, icon_url, is_active, sort_order) VALUES
      ('660e8400-e29b-41d4-a716-446655440000', 'JavaScript', 'Frontend', 'Programming language for web development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', true, 1),
      ('660e8400-e29b-41d4-a716-446655440001', 'React', 'Frontend', 'JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true, 2),
      ('660e8400-e29b-41d4-a716-446655440002', 'Node.js', 'Backend', 'JavaScript runtime for server-side development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true, 3),
      ('660e8400-e29b-41d4-a716-446655440003', 'Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', true, 4),
      ('660e8400-e29b-41d4-a716-446655440004', 'PostgreSQL', 'Database', 'Advanced open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', true, 5),
      ('660e8400-e29b-41d4-a716-446655440005', 'MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', true, 6),
      ('660e8400-e29b-41d4-a716-446655440006', 'Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', true, 7),
      ('660e8400-e29b-41d4-a716-446655440007', 'Django', 'Backend', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', true, 8),
      ('660e8400-e29b-41d4-a716-446655440008', 'HTML5', 'Frontend', 'Markup language for web pages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', true, 9),
      ('660e8400-e29b-41d4-a716-446655440009', 'CSS3', 'Frontend', 'Stylesheet language for web design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', true, 10),
      ('660e8400-e29b-41d4-a716-446655440010', 'Vue.js', 'Frontend', 'Progressive JavaScript framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', true, 11),
      ('660e8400-e29b-41d4-a716-446655440011', 'Angular', 'Frontend', 'TypeScript-based web application framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', true, 12),
      ('660e8400-e29b-41d4-a716-446655440012', 'Java', 'Backend', 'Object-oriented programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', true, 13),
      ('660e8400-e29b-41d4-a716-446655440013', 'Spring Boot', 'Backend', 'Java framework for enterprise applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', true, 14),
      ('660e8400-e29b-41d4-a716-446655440014', 'MySQL', 'Database', 'Popular relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', true, 15),
      ('660e8400-e29b-41d4-a716-446655440015', 'Redis', 'Database', 'In-memory data structure store', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', true, 16),
      ('660e8400-e29b-41d4-a716-446655440016', 'Docker', 'DevOps', 'Containerization platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', true, 17),
      ('660e8400-e29b-41d4-a716-446655440017', 'AWS', 'Cloud', 'Amazon Web Services cloud platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', true, 18),
      ('660e8400-e29b-41d4-a716-446655440018', 'Git', 'DevOps', 'Version control system', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', true, 19),
      ('660e8400-e29b-41d4-a716-446655440019', 'TypeScript', 'Frontend', 'Typed superset of JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', true, 20)
    `);

    // Insert internship programs
    await client.query(`
      INSERT INTO internship_programs (id, title, slug, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, current_participants, requirements, learning_outcomes, featured, is_active) VALUES
      ('770e8400-e29b-41d4-a716-446655440000', 'Full Stack Web Development with MERN', 'full-stack-mern-development', 'Comprehensive program covering frontend and backend development with React, Node.js, Express, and MongoDB. Build real-world applications and gain industry-ready skills.', 12, 'intermediate', 3000.00, 20, 2400.00, 30, 8, 'Basic knowledge of HTML, CSS, and JavaScript. Familiarity with programming concepts.', 'Build responsive web applications, RESTful APIs, database integration, deployment strategies, and modern development workflows.', true, true),
      ('770e8400-e29b-41d4-a716-446655440001', 'React Frontend Mastery', 'react-frontend-mastery', 'Deep dive into React ecosystem including hooks, state management, routing, and performance optimization. Build modern user interfaces.', 8, 'intermediate', 2500.00, 15, 2125.00, 25, 5, 'Good understanding of JavaScript ES6+, HTML, CSS, and basic React knowledge.', 'Advanced React patterns, state management with Redux/Context, performance optimization, testing, and modern frontend tooling.', true, true),
      ('770e8400-e29b-41d4-a716-446655440002', 'Python Django Backend Development', 'python-django-backend', 'Learn server-side development with Python and Django. Focus on building scalable backend systems and RESTful APIs.', 10, 'beginner', 2800.00, 25, 2100.00, 20, 3, 'Basic programming knowledge. Understanding of Python basics is helpful but not required.', 'Develop REST APIs, work with databases, implement authentication, testing, and deployment of Python applications.', true, true),
      ('770e8400-e29b-41d4-a716-446655440003', 'Node.js Backend Development', 'nodejs-backend-development', 'Master backend development with Node.js, Express, and modern JavaScript. Build scalable server-side applications.', 9, 'intermediate', 2600.00, 10, 2340.00, 22, 7, 'Solid understanding of JavaScript fundamentals and basic web development concepts.', 'Build RESTful APIs, implement authentication, work with databases, and deploy Node.js applications.', false, true),
      ('770e8400-e29b-41d4-a716-446655440004', 'Java Spring Boot Enterprise Development', 'java-spring-boot-enterprise', 'Enterprise-level Java development with Spring Boot, microservices, and cloud deployment. Perfect for aspiring enterprise developers.', 14, 'advanced', 3500.00, 30, 2450.00, 15, 2, 'Solid understanding of Java fundamentals, OOP concepts, and basic web development knowledge.', 'Build enterprise applications, implement microservices architecture, work with Spring ecosystem, and deploy to cloud platforms.', false, true)
    `);

    // Insert program-technology mappings
    await client.query(`
      INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) VALUES
      -- Full Stack MERN
      ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', true, 'intermediate'), -- React
      ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', true, 'intermediate'), -- Node.js
      ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', true, 'intermediate'), -- Express.js
      ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005', true, 'intermediate'), -- MongoDB
      ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', false, 'advanced'), -- JavaScript
      
      -- React Frontend Mastery
      ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', true, 'advanced'), -- React
      ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', true, 'advanced'), -- JavaScript
      ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440019', false, 'intermediate'), -- TypeScript
      ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440008', false, 'intermediate'), -- HTML5
      ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440009', false, 'intermediate'), -- CSS3
      
      -- Python Django Backend
      ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006', true, 'intermediate'), -- Python
      ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440007', true, 'intermediate'), -- Django
      ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', false, 'beginner'), -- PostgreSQL
      
      -- Node.js Backend
      ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', true, 'advanced'), -- Node.js
      ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', true, 'advanced'), -- Express.js
      ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', false, 'advanced'), -- JavaScript
      ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', false, 'intermediate'), -- PostgreSQL
      
      -- Java Spring Boot
      ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440012', true, 'advanced'), -- Java
      ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440013', true, 'advanced'), -- Spring Boot
      ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440014', false, 'intermediate') -- MySQL
    `);

    // Insert student enrollments
    await client.query(`
      INSERT INTO student_internship (student_id, program_id, status, progress_percentage, start_date) VALUES
      ('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440000', 'in_progress', 45.50, '2024-01-15'),
      ('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'enrolled', 12.25, '2024-02-01')
    `);

    // Insert testimonials
    await client.query(`
      INSERT INTO testimonials (student_name, student_role, image_url, content, is_featured) VALUES
      ('Rahul Kumar', 'Software Engineer at Google', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60', 'Winst helped me land my dream internship and eventually a full-time role at Google! The mentorship and practical projects were invaluable.', true),
      ('Priya Sharma', 'Frontend Developer at Microsoft', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60', 'The React mastery program transformed my coding skills. I went from beginner to confident developer in just 8 weeks!', true),
      ('Amit Patel', 'Full Stack Developer at Flipkart', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60', 'Amazing program structure and real-world projects. The Django backend course prepared me for enterprise development.', false),
      ('Sneha Reddy', 'Tech Lead at Swiggy', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60', 'Winst internship was a game-changer for my career. The industry connections and portfolio projects made all the difference.', true),
      ('Vikash Singh', 'DevOps Engineer at Zomato', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60', 'The comprehensive curriculum and hands-on experience helped me transition from student to professional seamlessly.', false)
    `);

    // Insert sample announcements
    await client.query(`
      INSERT INTO announcements (title, content, announcement_type, target_audience, is_active, priority, created_by) VALUES
      ('🎉 Welcome to Winst Internship Portal!', 'We are excited to have you on board. Explore our comprehensive internship programs and start your journey to become an industry-ready developer.', 'general', 'students', true, 1, '550e8400-e29b-41d4-a716-446655440000'),
      ('🚀 New React Mastery Program Launched', 'We have launched an advanced React mastery program focusing on hooks, performance optimization, and modern development practices. Early bird discount available!', 'feature', 'all', true, 2, '550e8400-e29b-41d4-a716-446655440000'),
      ('📚 Assignment Submission Guidelines', 'Please ensure to follow the submission guidelines for all assignments. Include proper documentation and follow coding standards for better evaluation.', 'general', 'students', true, 1, '550e8400-e29b-41d4-a716-446655440003')
    `);

    console.log('✅ All dummy data inserted successfully!');

    // Test the technologies API query
    console.log('🧪 Testing technologies API query...');
    const result = await client.query('SELECT COUNT(*) FROM technologies WHERE is_active = true');
    console.log(`✅ Found ${result.rows[0].count} active technologies`);

    // Get sample technologies
    const sampleTech = await client.query('SELECT name, category FROM technologies WHERE is_active = true ORDER BY sort_order LIMIT 5');
    console.log('📋 Sample technologies:');
    sampleTech.rows.forEach(tech => {
      console.log(`   - ${tech.name} (${tech.category})`);
    });

    console.log('🎉 Complete database setup finished successfully!');
    console.log('');
    console.log('📊 Database Summary:');
    
    // Get counts for all major tables
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const techCount = await client.query('SELECT COUNT(*) FROM technologies');
    const programCount = await client.query('SELECT COUNT(*) FROM internship_programs');
    const enrollmentCount = await client.query('SELECT COUNT(*) FROM student_internship');
    const testimonialCount = await client.query('SELECT COUNT(*) FROM testimonials');
    
    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   💻 Technologies: ${techCount.rows[0].count}`);
    console.log(`   🎓 Programs: ${programCount.rows[0].count}`);
    console.log(`   📚 Enrollments: ${enrollmentCount.rows[0].count}`);
    console.log(`   💬 Testimonials: ${testimonialCount.rows[0].count}`);
    console.log('');
    console.log('✅ Your database is ready! Start the backend server with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    if (client) client.release();
    await pool.end();
  }
};

// Execute the setup
setupCompleteDatabase().catch(console.error);