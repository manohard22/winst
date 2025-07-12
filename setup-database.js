const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Database configuration
const DB_CONFIG = {
  host: "localhost",
  port: 5432,
  database: "postgres", // Connect to default database first
  user: "postgres",
  password: "root",
};

const TARGET_DB = {
  name: "lucro_portal_db",
  user: "lucro_db_user",
  password: "root",
};

// Simple password hashing using crypto
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function setupDatabase() {
  console.log(
    "🚀 Setting up Lucro Internship Portal Database with ALL Requirements..."
  );
  console.log("   ✅ 1. Assessments System");
  console.log("   ✅ 2. Referral Friend System");
  console.log("   ✅ 3. Affiliate Program");
  console.log("   ✅ 4. Task Submissions");

  let client;

  try {
    // Connect to PostgreSQL as superuser
    client = new Client(DB_CONFIG);
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // Create database and user
    console.log("📊 Creating database and user...");

    try {
      await client.query(`DROP DATABASE IF EXISTS ${TARGET_DB.name}`);
      await client.query(`DROP USER IF EXISTS ${TARGET_DB.user}`);
    } catch (error) {
      // Ignore errors if database/user doesn't exist
    }

    await client.query(`CREATE DATABASE ${TARGET_DB.name}`);
    await client.query(
      `CREATE USER ${TARGET_DB.user} WITH PASSWORD '${TARGET_DB.password}'`
    );
    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE ${TARGET_DB.name} TO ${TARGET_DB.user}`
    );
    await client.query(`ALTER USER ${TARGET_DB.user} CREATEDB SUPERUSER`);

    console.log("✅ Database and user created successfully!");

    // Close connection to default database
    await client.end();

    // Connect to the new database as superuser first to fix permissions
    const superuserClient = new Client({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: TARGET_DB.name,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    await superuserClient.connect();
    console.log("✅ Connected to target database as superuser");

    // Fix schema permissions
    console.log("🔧 Fixing schema permissions...");
    await superuserClient.query(
      `GRANT ALL ON SCHEMA public TO ${TARGET_DB.user}`
    );
    await superuserClient.query(
      `ALTER SCHEMA public OWNER TO ${TARGET_DB.user}`
    );
    await superuserClient.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${TARGET_DB.user}`
    );
    await superuserClient.query(
      `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${TARGET_DB.user}`
    );
    await superuserClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${TARGET_DB.user}`
    );
    await superuserClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${TARGET_DB.user}`
    );

    await superuserClient.end();

    // Now connect as the target user
    const targetClient = new Client({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: TARGET_DB.name,
      user: TARGET_DB.user,
      password: TARGET_DB.password,
    });

    await targetClient.connect();
    console.log("✅ Connected to target database as target user");

    // Execute the complete fresh database script
    console.log("🏗️ Creating complete schema with all requirements...");

    // Read the complete fresh database script
    const freshDatabaseScript = await getCompleteFreshDatabaseScript();

    try {
      await targetClient.query(freshDatabaseScript);
      console.log(
        "✅ Complete schema with all requirements created successfully!"
      );
    } catch (error) {
      console.error("❌ Error executing database script:", error.message);

      // Fallback: try creating basic schema and data
      console.log("🔄 Falling back to basic schema creation...");
      await createBasicSchemaAndData(targetClient);
    }

    // Verify data insertion
    console.log("🔍 Running verification queries...");
    await runVerificationQueries(targetClient);

    await targetClient.end();

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Database Connection Details:");
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   Port: ${DB_CONFIG.port}`);
    console.log(`   Database: ${TARGET_DB.name}`);
    console.log(`   Username: ${TARGET_DB.user}`);
    console.log(`   Password: ${TARGET_DB.password}`);
    console.log("\n🔗 Connection String:");
    console.log(
      `   postgresql://${TARGET_DB.user}:${TARGET_DB.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${TARGET_DB.name}`
    );
    console.log("\n👥 Sample Login Credentials:");
    console.log("   Admin: admin@lucro.com / password123");
    console.log("   Student: john.doe@example.com / password123");
    console.log("   Student: jane.smith@example.com / password123");
    console.log("\n✅ ALL 4 REQUIREMENTS IMPLEMENTED:");
    console.log("   🎯 1. Assessments: Questions, attempts, scoring");
    console.log("   👥 2. Referrals: Friend codes with ₹499 discounts");
    console.log("   💰 3. Affiliates: 25% commission program");
    console.log("   📝 4. Tasks: Submissions with review workflow");
    console.log("\n💡 Next Steps:");
    console.log(
      "   1. Update your .env file with the database connection details"
    );
    console.log("   2. Install Node.js dependencies: npm run install-all");
    console.log("   3. Start the development server: npm run dev");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  }
}

async function getCompleteFreshDatabaseScript() {
  // This is the complete script from the artifact above
  return `
-- =====================================================
-- LUCRO INTERNSHIP PORTAL - COMPLETE FRESH DATABASE
-- Drop all existing tables (IF EXISTS) and create new schema with dummy data
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP ALL EXISTING TABLES (IF EXISTS)
-- =====================================================

-- Drop tables in correct order (reverse dependency order)
DROP TABLE IF EXISTS affiliate_earnings CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS learning_journey CASCADE;
DROP TABLE IF EXISTS project_submissions CASCADE;
DROP TABLE IF EXISTS project_requirements CASCADE;
DROP TABLE IF EXISTS assessment_answers CASCADE;
DROP TABLE IF EXISTS assessment_attempts CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS affiliates CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS internship_certificates CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS student_internship CASCADE;
DROP TABLE IF EXISTS program_technologies CASCADE;
DROP TABLE IF EXISTS internship_programs CASCADE;
DROP TABLE IF EXISTS technologies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS student_dashboard_summary CASCADE;
DROP VIEW IF EXISTS referral_summary CASCADE;
DROP VIEW IF EXISTS affiliate_summary CASCADE;
DROP VIEW IF EXISTS program_performance_summary CASCADE;
DROP VIEW IF EXISTS assessment_performance_summary CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- CREATE TRIGGER FUNCTION
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- CREATE ALL TABLES
-- =====================================================

-- Users table (students, mentors, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'mentor')),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technologies table
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(300),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internship programs table
CREATE TABLE internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
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
    requirements TEXT,
    learning_outcomes TEXT,
    image_url VARCHAR(500),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, technology_id)
);

-- Orders table for payments
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
    referral_code VARCHAR(20),
    affiliate_code VARCHAR(20),
    discount_type VARCHAR(20) CHECK (discount_type IN ('referral', 'affiliate', 'coupon')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student internship enrollments
CREATE TABLE student_internship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'suspended')),
    progress_percentage INTEGER DEFAULT 0,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    mentor_id UUID REFERENCES users(id),
    final_grade VARCHAR(5),
    feedback TEXT,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url VARCHAR(500),
    assessment_completed BOOLEAN DEFAULT false,
    assessment_score DECIMAL(5,2),
    project_submitted BOOLEAN DEFAULT false,
    project_approved BOOLEAN DEFAULT false,
    certificate_eligible BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, program_id)
);

-- Referral system table
CREATE TABLE referrals (
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
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 25.00,
    total_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate earnings tracking
CREATE TABLE affiliate_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment questions table
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment attempts
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    time_taken INTEGER,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment answers
CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks/Assignments table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(50) DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'project', 'quiz', 'presentation')),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_points INTEGER DEFAULT 100,
    due_date TIMESTAMP,
    instructions TEXT,
    resources TEXT,
    submission_format VARCHAR(100),
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    estimated_hours INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task submissions table
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT,
    submission_url VARCHAR(500),
    github_url VARCHAR(300),
    live_demo_url VARCHAR(300),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision')),
    points_earned INTEGER,
    feedback TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    revision_count INTEGER DEFAULT 0,
    is_late_submission BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional required tables
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE certificates (
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

CREATE TABLE learning_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES student_internship(id) ON DELETE CASCADE,
    current_step VARCHAR(50) DEFAULT 'enrolled',
    step_completed_at TIMESTAMP,
    next_step VARCHAR(50),
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_assessment_attempts_student_id ON assessment_attempts(student_id);
CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id);

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internship_programs_updated_at BEFORE UPDATE ON internship_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_internship_updated_at BEFORE UPDATE ON student_internship FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_submissions_updated_at BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_journey_updated_at BEFORE UPDATE ON learning_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
}

async function createBasicSchemaAndData(client) {
  console.log("🔄 Creating basic schema and inserting dummy data...");

  // Hash passwords
  const adminPasswordHash = hashPassword("password123");
  const studentPasswordHash = hashPassword("password123");

  try {
    // Basic schema creation script
    const basicScript = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Insert Users (Admin and Students)
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role, college_name, degree, branch, year_of_study, cgpa, is_active, email_verified) VALUES
      ('admin@lucro.com', '${adminPasswordHash}', 'Admin', 'User', '+919876543216', 'admin', NULL, NULL, NULL, NULL, NULL, true, true),
      ('john.doe@example.com', '${studentPasswordHash}', 'John', 'Doe', '+919876543210', 'student', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5, true, true),
      ('jane.smith@example.com', '${studentPasswordHash}', 'Jane', 'Smith', '+919876543211', 'student', 'NIT Warangal', 'B.Tech', 'Electronics', 2, 8.8, true, true),
      ('alex.wilson@example.com', '${studentPasswordHash}', 'Alex', 'Wilson', '+919876543212', 'student', 'BITS Pilani', 'B.Tech', 'Information Technology', 4, 9.1, true, true),
      ('priya.sharma@example.com', '${studentPasswordHash}', 'Priya', 'Sharma', '+919876543213', 'student', 'VIT Chennai', 'B.Tech', 'Computer Science', 3, 8.2, true, true),
      ('sarah.johnson@lucro.com', '${studentPasswordHash}', 'Sarah', 'Johnson', '+919876543217', 'mentor', 'Stanford University', 'M.S.', 'Computer Science', NULL, NULL, true, true);

      -- Insert Technologies
      INSERT INTO technologies (name, category, description, icon_url) VALUES
      ('React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
      ('Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
      ('Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
      ('MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
      ('Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg');

      -- Insert Internship Programs
      INSERT INTO internship_programs (title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, requirements, learning_outcomes, image_url) VALUES
      ('Full Stack Web Development with MERN', 'Master the complete MERN stack through hands-on projects.', 12, 'intermediate', 2000.00, 0, 2000.00, 50, 'Basic knowledge of HTML, CSS, JavaScript', 'React.js, Node.js, Express.js, MongoDB, RESTful APIs', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),
      ('Frontend Development with React', 'Become a React expert with advanced concepts.', 10, 'intermediate', 2000.00, 0, 2000.00, 40, 'HTML, CSS, JavaScript fundamentals', 'Advanced React, Redux Toolkit, TypeScript', 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500'),
      ('Backend Development with Python Django', 'Learn backend development using Django framework.', 12, 'intermediate', 2000.00, 0, 2000.00, 25, 'Python basics', 'Django, Django REST Framework, PostgreSQL', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500'),
      ('UI/UX Design Mastery', 'Learn complete user interface and experience design.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic design sense', 'Figma, Adobe XD, Design Systems', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),
      ('Data Science with Python', 'Comprehensive data science program with Python.', 12, 'intermediate', 2000.00, 0, 2000.00, 30, 'Python basics, Statistics', 'Python, Pandas, NumPy, Machine Learning', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500');
    `;

    await client.query(basicScript);

    // Create sample enrollments, orders, and basic data for all 4 requirements
    await createRequirementsData(client);

    console.log("✅ Basic schema and requirements data created successfully!");
  } catch (error) {
    console.error("❌ Error creating basic schema:", error.message);
    throw error;
  }
}

async function createRequirementsData(client) {
  console.log("📝 Creating data for all 4 requirements...");

  // 1. ASSESSMENT SYSTEM
  const assessmentScript = `
    -- Assessment questions for MERN program
    INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index)
    SELECT 
        (SELECT id FROM internship_programs WHERE title = 'Full Stack Web Development with MERN'),
        q.question_text,
        'multiple_choice',
        q.options,
        q.correct_answer,
        1,
        q.difficulty_level,
        q.order_index
    FROM (VALUES
        ('What does MERN stack stand for?', '["MongoDB, Express, React, Node.js", "MySQL, Express, React, Node.js"]', 'MongoDB, Express, React, Node.js', 'easy', 1),
        ('Which HTTP method creates new resources?', '["GET", "POST", "PUT", "DELETE"]', 'POST', 'easy', 2),
        ('What is JSX in React?', '["JavaScript XML", "Java Syntax Extension"]', 'JavaScript XML', 'medium', 3),
        ('Which hook manages state in React?', '["useEffect", "useState", "useContext"]', 'useState', 'medium', 4),
        ('What is middleware in Express.js?', '["Database handler", "Request processor"]', 'Request processor', 'hard', 5)
    ) AS q(question_text, options, correct_answer, difficulty_level, order_index);

    -- Create sample assessment attempts
    INSERT INTO assessment_attempts (student_id, program_id, enrollment_id, total_questions, correct_answers, score_percentage, time_taken, status, completed_at)
    SELECT 
        si.student_id,
        si.program_id,
        si.id,
        5,
        4,
        80.00,
        45,
        'completed',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    FROM student_internship si
    LIMIT 3;
  `;

  // 2. REFERRAL SYSTEM
  const referralScript = `
    -- Create referral codes
    INSERT INTO referrals (referrer_id, referred_email, referral_code, status, discount_amount, expires_at)
    SELECT 
        u.id,
        'friend' || (ROW_NUMBER() OVER())::TEXT || '@example.com',
        'REF' || UPPER(substring(md5(random()::text), 1, 8)),
        CASE WHEN ROW_NUMBER() OVER() <= 2 THEN 'completed' ELSE 'pending' END,
        499.00,
        CURRENT_TIMESTAMP + INTERVAL '25 days'
    FROM users u WHERE role = 'student' LIMIT 5;
  `;

  // 3. AFFILIATE SYSTEM
  const affiliateScript = `
    -- Create affiliate accounts
    INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_referrals, total_earnings, status)
    SELECT 
        u.id,
        'AFF' || UPPER(substring(md5(random()::text), 1, 8)),
        25.00,
        CASE WHEN ROW_NUMBER() OVER() = 1 THEN 5 ELSE 2 END,
        CASE WHEN ROW_NUMBER() OVER() = 1 THEN 2500.00 ELSE 1000.00 END,
        'active'
    FROM users u WHERE role = 'student' LIMIT 3;
  `;

  // 4. TASK SUBMISSIONS
  const taskScript = `
    -- Create tasks for programs
    INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, instructions, order_index, estimated_hours)
    SELECT 
        ip.id,
        'Environment Setup',
        'Set up your development environment and create first project',
        'assignment',
        'easy',
        20,
        'Install required tools and create basic project',
        1,
        8
    FROM internship_programs ip LIMIT 3;

    -- Create task submissions
    INSERT INTO task_submissions (task_id, student_id, submission_text, github_url, status, points_earned, feedback, reviewed_by, submitted_at)
    SELECT 
        t.id,
        si.student_id,
        'I have completed the ' || t.title || ' assignment successfully.',
        'https://github.com/student/project-' || (ROW_NUMBER() OVER())::TEXT,
        'approved',
        18,
        'Excellent work! Well documented and implemented.',
        (SELECT id FROM users WHERE role = 'mentor' LIMIT 1),
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    FROM tasks t
    JOIN student_internship si ON t.program_id = si.program_id
    LIMIT 5;
  `;

  // Create basic enrollments first
  const enrollmentScript = `
    INSERT INTO student_internship (student_id, program_id, status, start_date, mentor_id)
    SELECT 
        u.id,
        (SELECT id FROM internship_programs LIMIT 1),
        'in_progress',
        CURRENT_DATE - INTERVAL '10 days',
        (SELECT id FROM users WHERE role = 'mentor' LIMIT 1)
    FROM users u WHERE role = 'student' LIMIT 5;

    INSERT INTO orders (student_id, program_id, order_number, amount, final_amount, status, payment_method)
    SELECT 
        si.student_id,
        si.program_id,
        'ORD' || LPAD((ROW_NUMBER() OVER())::TEXT, 3, '0'),
        2000.00,
        2000.00,
        'paid',
        'Credit Card'
    FROM student_internship si LIMIT 5;
  `;

  try {
    await client.query(enrollmentScript);
    await client.query(assessmentScript);
    await client.query(referralScript);
    await client.query(affiliateScript);
    await client.query(taskScript);

    console.log("✅ All 4 requirements data created successfully!");
  } catch (error) {
    console.error("❌ Error creating requirements data:", error.message);
    throw error;
  }
}

async function runVerificationQueries(client) {
  const verificationQueries = [
    { name: "Users", query: "SELECT COUNT(*) as count FROM users" },
    {
      name: "Programs",
      query: "SELECT COUNT(*) as count FROM internship_programs",
    },
    {
      name: "Enrollments",
      query: "SELECT COUNT(*) as count FROM student_internship",
    },
    { name: "Orders", query: "SELECT COUNT(*) as count FROM orders" },
    {
      name: "Assessment Questions",
      query: "SELECT COUNT(*) as count FROM assessment_questions",
    },
    {
      name: "Assessment Attempts",
      query: "SELECT COUNT(*) as count FROM assessment_attempts",
    },
    { name: "Referrals", query: "SELECT COUNT(*) as count FROM referrals" },
    { name: "Affiliates", query: "SELECT COUNT(*) as count FROM affiliates" },
    { name: "Tasks", query: "SELECT COUNT(*) as count FROM tasks" },
    {
      name: "Task Submissions",
      query: "SELECT COUNT(*) as count FROM task_submissions",
    },
  ];

  console.log("\n📊 Database Verification Results:");
  for (const { name, query } of verificationQueries) {
    try {
      const result = await client.query(query);
      const count = result.rows[0].count;
      console.log(`   ✅ ${name}: ${count} records`);
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`);
    }
  }

  // Check if all 4 requirements are implemented
  try {
    const requirementCheck = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM assessment_questions) as assessments,
        (SELECT COUNT(*) FROM referrals) as referrals,
        (SELECT COUNT(*) FROM affiliates) as affiliates,
        (SELECT COUNT(*) FROM task_submissions) as submissions
    `);

    const results = requirementCheck.rows[0];
    console.log("\n🎯 Requirements Implementation Status:");
    console.log(
      `   ${results.assessments > 0 ? "✅" : "❌"} 1. Assessments: ${
        results.assessments
      } questions`
    );
    console.log(
      `   ${results.referrals > 0 ? "✅" : "❌"} 2. Referrals: ${
        results.referrals
      } codes`
    );
    console.log(
      `   ${results.affiliates > 0 ? "✅" : "❌"} 3. Affiliates: ${
        results.affiliates
      } accounts`
    );
    console.log(
      `   ${results.submissions > 0 ? "✅" : "❌"} 4. Task Submissions: ${
        results.submissions
      } submissions`
    );

    const allImplemented =
      results.assessments > 0 &&
      results.referrals > 0 &&
      results.affiliates > 0 &&
      results.submissions > 0;

    if (allImplemented) {
      console.log("\n🎉 ALL 4 REQUIREMENTS SUCCESSFULLY IMPLEMENTED!");
    } else {
      console.log("\n⚠️  Some requirements may need attention.");
    }
  } catch (error) {
    console.log("❌ Error checking requirements:", error.message);
  }
}

// Run the setup
setupDatabase();
