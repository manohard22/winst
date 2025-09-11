import { Client } from "pg";
import { randomBytes, pbkdf2Sync } from "crypto";

// Database configuration
const DB_CONFIG = {
  host: "localhost",
  port: 5432,
  database: "postgres", // Connect to default database first
  user: "postgres",
  password: "root",
};

const TARGET_DB = {
  name: "winst_portal_db",
  user: "winst_db_user",
  password: "root",
};

// Helper functions
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function generateRandomCode(prefix, length = 8) {
  return (
    prefix + randomBytes(length).toString("hex").toUpperCase().slice(0, length)
  );
}

async function setupDatabase() {
  console.log(
    "🚀 Setting up Winst Internship Portal Database with ALL Requirements..."
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
      // Terminate all connections to the target database before dropping
      await client.query(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${TARGET_DB.name}' AND pid <> pg_backend_pid();`
      );
      await client.query(`DROP DATABASE IF EXISTS ${TARGET_DB.name}`);
      await client.query(`DROP USER IF EXISTS ${TARGET_DB.user}`);
    } catch (error) {
      console.log("ℹ️ No existing database/user to clean up");
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

    // Connect to the new database as the target user
    const targetClient = new Client({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: TARGET_DB.name,
      user: TARGET_DB.user,
      password: TARGET_DB.password,
    });

    await targetClient.connect();
    console.log("✅ Connected to target database");

    // Create schema
    console.log("🏗️ Creating complete schema...");
    await createCompleteSchema(targetClient);

    // Insert comprehensive dummy data
    console.log("📝 Inserting comprehensive dummy data...");
    await insertComprehensiveDummyData(targetClient);

    // Verify data
    console.log("🔍 Verifying data...");
    await verifyCompleteData(targetClient);

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
    console.log("   Admin: admin@winst.com / admin123");
    console.log("   Student: student1@example.com / student123");
    console.log("   Mentor: mentor1@winst.com / mentor123");
    console.log("   Affiliate: affiliate1@example.com / affiliate123");

    console.log("\n✅ ALL 4 REQUIREMENTS IMPLEMENTED:");
    console.log("   🎯 1. Assessments: Questions, attempts, scoring system");
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

async function createCompleteSchema(client) {
  // Enable UUID extension
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // Create tables in proper order
  const schemaQueries = [
    // Users table
    `CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Technologies table
    `CREATE TABLE technologies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      icon_url VARCHAR(300),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Internship programs table
    `CREATE TABLE internship_programs (
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
    )`,

    // Program technologies mapping
    `CREATE TABLE program_technologies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
      technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(program_id, technology_id)
    )`,

    // Student internship enrollments
    `CREATE TABLE student_internship (
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
    )`,

    // Orders table
    `CREATE TABLE orders (
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
    )`,

    // Payments table
    `CREATE TABLE payments (
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
    )`,

    // Referrals table
    `CREATE TABLE referrals (
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
    )`,

    // Affiliates table
    `CREATE TABLE affiliates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      affiliate_code VARCHAR(20) UNIQUE NOT NULL,
      commission_rate DECIMAL(5,2) DEFAULT 25.00,
      total_referrals INTEGER DEFAULT 0,
      total_earnings DECIMAL(10,2) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Affiliate earnings
    `CREATE TABLE affiliate_earnings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      commission_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
      paid_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Assessment questions
    `CREATE TABLE assessment_questions (
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
    )`,

    // Assessment attempts
    `CREATE TABLE assessment_attempts (
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
    )`,

    // Assessment answers
    `CREATE TABLE assessment_answers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
      question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
      student_answer TEXT,
      is_correct BOOLEAN DEFAULT false,
      points_earned INTEGER DEFAULT 0,
      answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tasks table
    `CREATE TABLE tasks (
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
    )`,

    // Task submissions
    `CREATE TABLE task_submissions (
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
    )`,

    // Certificates
    `CREATE TABLE certificates (
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
    )`,

    // Learning journey
    `CREATE TABLE learning_journey (
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
    )`,

    // Course table
    `CREATE TABLE courses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      internship_program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      logo VARCHAR(500),
      duration_weeks INTEGER,
      prerequisites TEXT,
      learning_outcomes TEXT,
      technologies JSONB,
      difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
      max_students INTEGER DEFAULT 30,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE INDEX idx_courses_internship_program_id ON courses(internship_program_id)`,
    `CREATE INDEX idx_courses_title ON courses(title)`,
    `CREATE INDEX idx_courses_is_active ON courses(is_active)`,

    // Create indexes
    `CREATE INDEX idx_users_email ON users(email)`,
    `CREATE INDEX idx_users_role ON users(role)`,
    `CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id)`,
    `CREATE INDEX idx_referrals_code ON referrals(referral_code)`,
    `CREATE INDEX idx_affiliates_user_id ON affiliates(user_id)`,
    `CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code)`,
    `CREATE INDEX idx_assessment_attempts_student_id ON assessment_attempts(student_id)`,
    `CREATE INDEX idx_assessment_attempts_program_id ON assessment_attempts(program_id)`,
    `CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id)`,
    `CREATE INDEX idx_task_submissions_status ON task_submissions(status)`,
    `CREATE INDEX idx_certificates_student_id ON certificates(student_id)`,
    `CREATE INDEX idx_learning_journey_student_id ON learning_journey(student_id)`,
    `CREATE INDEX idx_orders_student_id ON orders(student_id)`,
    `CREATE INDEX idx_orders_status ON orders(status)`,

    // Create trigger function
    `CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql'`,

    // Apply triggers
    `CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_internship_programs_updated_at BEFORE UPDATE ON internship_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_student_internship_updated_at BEFORE UPDATE ON student_internship FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_task_submissions_updated_at BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
    `CREATE TRIGGER update_learning_journey_updated_at BEFORE UPDATE ON learning_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
  ];

  for (const query of schemaQueries) {
    await client.query(query);
  }
}

async function insertComprehensiveDummyData(client) {
  // Hash passwords
  const adminHash = hashPassword("admin123");
  const studentHash = hashPassword("student123");
  const mentorHash = hashPassword("mentor123");
  const affiliateHash = hashPassword("affiliate123");

  // Insert users
  await client.query(`
    INSERT INTO users (email, password_hash, first_name, last_name, phone, role, college_name, degree, branch, year_of_study, cgpa, is_active, email_verified) VALUES
    ('admin@winst.com', '${adminHash}', 'Admin', 'User', '+919876543216', 'admin', NULL, NULL, NULL, NULL, NULL, true, true),
    ('mentor1@winst.com', '${mentorHash}', 'John', 'Mentor', '+919876543217', 'mentor', 'Stanford University', 'M.S.', 'Computer Science', NULL, NULL, true, true),
    ('mentor2@winst.com', '${mentorHash}', 'Sarah', 'Advisor', '+919876543218', 'mentor', 'MIT', 'Ph.D.', 'Software Engineering', NULL, NULL, true, true),
    ('affiliate1@example.com', '${affiliateHash}', 'Alex', 'Marketer', '+919876543219', 'affiliate', 'IIM Bangalore', 'MBA', 'Marketing', NULL, NULL, true, true),
    ('affiliate2@example.com', '${affiliateHash}', 'Maria', 'Influencer', '+919876543220', 'affiliate', 'Delhi University', 'BA', 'Communications', NULL, NULL, true, true),
    ('student1@example.com', '${studentHash}', 'Rahul', 'Sharma', '+919876543210', 'student', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5, true, true),
    ('student2@example.com', '${studentHash}', 'Priya', 'Patel', '+919876543211', 'student', 'NIT Warangal', 'B.Tech', 'Electronics', 2, 8.8, true, true),
    ('student3@example.com', '${studentHash}', 'Amit', 'Singh', '+919876543212', 'student', 'BITS Pilani', 'B.Tech', 'Information Technology', 4, 9.1, true, true),
    ('student4@example.com', '${studentHash}', 'Neha', 'Gupta', '+919876543213', 'student', 'VIT Chennai', 'B.Tech', 'Computer Science', 3, 8.2, true, true),
    ('student5@example.com', '${studentHash}', 'Vikram', 'Reddy', '+919876543214', 'student', 'IIIT Hyderabad', 'B.Tech', 'CSE', 2, 9.0, true, true),
    ('student6@example.com', '${studentHash}', 'Ananya', 'Joshi', '+919876543215', 'student', 'NSIT Delhi', 'B.Tech', 'IT', 3, 8.7, true, true)
  `);

  // Insert technologies
  await client.query(`
    INSERT INTO technologies (name, category, description, icon_url) VALUES
    ('React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
    ('Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
    ('MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
    ('Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'),
    ('Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
    ('Django', 'Backend', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg'),
    ('PostgreSQL', 'Database', 'Advanced open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
    ('TypeScript', 'Frontend', 'Typed superset of JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg')
  `);

  // Insert internship programs
  const programResults = await client.query(`
    INSERT INTO internship_programs 
    (title, description, duration_weeks, difficulty_level, price, final_price, max_participants, requirements, learning_outcomes, image_url) 
    VALUES 
    ('Full Stack MERN Development', 'Master MongoDB, Express.js, React, and Node.js to build complete web applications', 12, 'intermediate', 2000.00, 2000.00, 50, 'Basic JavaScript knowledge, HTML, CSS fundamentals', 'Build full-stack applications, RESTful APIs, Database design, Authentication systems', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),
    ('Frontend Development with React', 'Become a React expert with modern hooks, state management, and best practices', 10, 'intermediate', 2000.00, 2000.00, 40, 'HTML, CSS, JavaScript basics', 'Advanced React concepts, Redux Toolkit, TypeScript integration, Component architecture', 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500'),
    ('Backend Development with Python Django', 'Learn backend development with Django framework and REST APIs', 12, 'intermediate', 2000.00, 2000.00, 30, 'Python basics, Programming fundamentals', 'Django framework mastery, REST API development, Database management, Authentication', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500'),
    ('UI/UX Design Mastery', 'Complete user interface and user experience design program', 8, 'beginner', 2000.00, 2000.00, 35, 'Basic design sense, Creativity', 'Design thinking, Figma mastery, User research, Prototyping, Design systems', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),
    ('Data Science with Python', 'Comprehensive data science program with machine learning', 14, 'advanced', 2000.00, 2000.00, 25, 'Python basics, Statistics knowledge, Mathematics', 'Data analysis, Machine learning, Python libraries, Data visualization, Model deployment', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500')
    RETURNING id, title
  `);

  const programIds = programResults.rows.reduce((acc, row) => {
    acc[row.title] = row.id;
    return acc;
  }, {});

  // Link technologies to programs
  await client.query(`
    INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES
    ('${programIds["Full Stack MERN Development"]}', (SELECT id FROM technologies WHERE name = 'React'), true),
    ('${programIds["Full Stack MERN Development"]}', (SELECT id FROM technologies WHERE name = 'Node.js'), true),
    ('${programIds["Full Stack MERN Development"]}', (SELECT id FROM technologies WHERE name = 'MongoDB'), true),
    ('${programIds["Full Stack MERN Development"]}', (SELECT id FROM technologies WHERE name = 'Express.js'), true),
    ('${programIds["Frontend Development with React"]}', (SELECT id FROM technologies WHERE name = 'React'), true),
    ('${programIds["Frontend Development with React"]}', (SELECT id FROM technologies WHERE name = 'TypeScript'), false),
    ('${programIds["Backend Development with Python Django"]}', (SELECT id FROM technologies WHERE name = 'Python'), true),
    ('${programIds["Backend Development with Python Django"]}', (SELECT id FROM technologies WHERE name = 'Django'), true),
    ('${programIds["Backend Development with Python Django"]}', (SELECT id FROM technologies WHERE name = 'PostgreSQL'), false),
    ('${programIds["Data Science with Python"]}', (SELECT id FROM technologies WHERE name = 'Python'), true)
  `);

  // Enroll students in programs
  await client.query(`
    INSERT INTO student_internship (student_id, program_id, status, start_date, mentor_id, progress_percentage) VALUES
    ((SELECT id FROM users WHERE email = 'student1@example.com'), '${programIds["Full Stack MERN Development"]}', 'in_progress', CURRENT_DATE - INTERVAL '15 days', (SELECT id FROM users WHERE email = 'mentor1@winst.com'), 45),
    ((SELECT id FROM users WHERE email = 'student2@example.com'), '${programIds["Frontend Development with React"]}', 'in_progress', CURRENT_DATE - INTERVAL '20 days', (SELECT id FROM users WHERE email = 'mentor2@winst.com'), 60),
    ((SELECT id FROM users WHERE email = 'student3@example.com'), '${programIds["Backend Development with Python Django"]}', 'enrolled', CURRENT_DATE - INTERVAL '5 days', (SELECT id FROM users WHERE email = 'mentor1@winst.com'), 10),
    ((SELECT id FROM users WHERE email = 'student4@example.com'), '${programIds["Full Stack MERN Development"]}', 'completed', CURRENT_DATE - INTERVAL '90 days', (SELECT id FROM users WHERE email = 'mentor2@winst.com'), 100),
    ((SELECT id FROM users WHERE email = 'student5@example.com'), '${programIds["UI/UX Design Mastery"]}', 'in_progress', CURRENT_DATE - INTERVAL '10 days', (SELECT id FROM users WHERE email = 'mentor1@winst.com'), 30),
    ((SELECT id FROM users WHERE email = 'student6@example.com'), '${programIds["Data Science with Python"]}', 'enrolled', CURRENT_DATE - INTERVAL '3 days', (SELECT id FROM users WHERE email = 'mentor2@winst.com'), 5)
  `);

  // Create orders for enrolled students
  await client.query(`
    INSERT INTO orders (student_id, program_id, order_number, amount, final_amount, status, payment_method, referral_code, affiliate_code, discount_type) VALUES
    ((SELECT id FROM users WHERE email = 'student1@example.com'), '${
      programIds["Full Stack MERN Development"]
    }', 'ORD-1001', 2000.00, 2000.00, 'paid', 'credit_card', NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'student2@example.com'), '${
      programIds["Frontend Development with React"]
    }', 'ORD-1002', 2000.00, 2000.00, 'paid', 'upi', NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'student3@example.com'), '${
      programIds["Backend Development with Python Django"]
    }', 'ORD-1003', 2000.00, 1501.00, 'paid', 'credit_card', '${generateRandomCode(
    "REF"
  )}', NULL, 'referral'),
    ((SELECT id FROM users WHERE email = 'student4@example.com'), '${
      programIds["Full Stack MERN Development"]
    }', 'ORD-1004', 2000.00, 1500.00, 'paid', 'net_banking', NULL, '${generateRandomCode(
    "AFF"
  )}', 'affiliate'),
    ((SELECT id FROM users WHERE email = 'student5@example.com'), '${
      programIds["UI/UX Design Mastery"]
    }', 'ORD-1005', 2000.00, 2000.00, 'paid', 'credit_card', NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'student6@example.com'), '${
      programIds["Data Science with Python"]
    }', 'ORD-1006', 2000.00, 2000.00, 'paid', 'upi', NULL, NULL, NULL)
  `);

  // Create payments for orders
  await client.query(`
    INSERT INTO payments (order_id, amount, payment_method, payment_gateway, status, processed_at, gateway_transaction_id) VALUES
    ((SELECT id FROM orders WHERE order_number = 'ORD-1001'), 2000.00, 'credit_card', 'razorpay', 'success', CURRENT_TIMESTAMP - INTERVAL '15 days', 'pay_${generateRandomCode(
      "",
      16
    )}'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-1002'), 2000.00, 'upi', 'razorpay', 'success', CURRENT_TIMESTAMP - INTERVAL '20 days', 'pay_${generateRandomCode(
      "",
      16
    )}'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-1003'), 1501.00, 'credit_card', 'stripe', 'success', CURRENT_TIMESTAMP - INTERVAL '5 days', 'pi_${generateRandomCode(
      "",
      16
    )}'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-1004'), 1500.00, 'net_banking', 'razorpay', 'success', CURRENT_TIMESTAMP - INTERVAL '90 days', 'pay_${generateRandomCode(
      "",
      16
    )}'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-1005'), 2000.00, 'credit_card', 'razorpay', 'success', CURRENT_TIMESTAMP - INTERVAL '10 days', 'pay_${generateRandomCode(
      "",
      16
    )}'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-1006'), 2000.00, 'upi', 'razorpay', 'success', CURRENT_TIMESTAMP - INTERVAL '3 days', 'pay_${generateRandomCode(
      "",
      16
    )}')
  `);

  // Create referral codes
  await client.query(`
    INSERT INTO referrals (referrer_id, referred_email, referral_code, status, discount_amount, used_at, expires_at) VALUES
    ((SELECT id FROM users WHERE email = 'student1@example.com'), 'friend1@example.com', '${generateRandomCode(
      "REF"
    )}', 'completed', 499.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '25 days'),
    ((SELECT id FROM users WHERE email = 'student2@example.com'), 'friend2@example.com', '${generateRandomCode(
      "REF"
    )}', 'pending', 499.00, NULL, CURRENT_TIMESTAMP + INTERVAL '30 days'),
    ((SELECT id FROM users WHERE email = 'student4@example.com'), 'friend3@example.com', '${generateRandomCode(
      "REF"
    )}', 'completed', 499.00, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '20 days'),
    ((SELECT id FROM users WHERE email = 'student5@example.com'), 'friend4@example.com', '${generateRandomCode(
      "REF"
    )}', 'pending', 499.00, NULL, CURRENT_TIMESTAMP + INTERVAL '28 days'),
    ((SELECT id FROM users WHERE email = 'student6@example.com'), 'friend5@example.com', '${generateRandomCode(
      "REF"
    )}', 'pending', 499.00, NULL, CURRENT_TIMESTAMP + INTERVAL '29 days')
  `);

  // Create affiliate accounts
  await client.query(`
    INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_referrals, total_earnings, status) VALUES
    ((SELECT id FROM users WHERE email = 'affiliate1@example.com'), '${generateRandomCode(
      "AFF"
    )}', 25.00, 8, 4000.00, 'active'),
    ((SELECT id FROM users WHERE email = 'affiliate2@example.com'), '${generateRandomCode(
      "AFF"
    )}', 25.00, 3, 1500.00, 'active'),
    ((SELECT id FROM users WHERE email = 'student1@example.com'), '${generateRandomCode(
      "AFF"
    )}', 20.00, 2, 800.00, 'active')
  `);

  // Create affiliate earnings
  await client.query(`
    INSERT INTO affiliate_earnings (affiliate_id, order_id, commission_amount, status, paid_at) VALUES
    ((SELECT id FROM affiliates WHERE user_id = (SELECT id FROM users WHERE email = 'affiliate1@example.com')), (SELECT id FROM orders WHERE order_number = 'ORD-1004'), 500.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '85 days'),
    ((SELECT id FROM affiliates WHERE user_id = (SELECT id FROM users WHERE email = 'affiliate2@example.com')), (SELECT id FROM orders WHERE order_number = 'ORD-1002'), 500.00, 'pending', NULL),
    ((SELECT id FROM affiliates WHERE user_id = (SELECT id FROM users WHERE email = 'student1@example.com')), (SELECT id FROM orders WHERE order_number = 'ORD-1006'), 400.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '1 day')
  `);

  // Create assessment questions for each program
  const assessmentQuestions = [
    // MERN Stack questions
    {
      program: "Full Stack MERN Development",
      questions: [
        {
          text: "What does MERN stand for?",
          options: [
            '["MongoDB, Express, React, Node.js", "MySQL, Express, React, Node.js", "MongoDB, Electron, React, Node.js"]',
          ],
          answer: "MongoDB, Express, React, Node.js",
          difficulty: "easy",
        },
        {
          text: "Which HTTP method is used to create new resources in REST API?",
          options: ['["GET", "POST", "PUT", "DELETE"]'],
          answer: "POST",
          difficulty: "easy",
        },
        {
          text: "What is JSX in React?",
          options: [
            '["JavaScript XML", "Java Syntax Extension", "JSON Extended"]',
          ],
          answer: "JavaScript XML",
          difficulty: "medium",
        },
        {
          text: "Which hook is used for state management in React?",
          options: ['["useEffect", "useState", "useContext"]'],
          answer: "useState",
          difficulty: "medium",
        },
        {
          text: "What is middleware in Express.js?",
          options: [
            '["Database connector", "Request processor", "View engine"]',
          ],
          answer: "Request processor",
          difficulty: "hard",
        },
      ],
    },
    // React questions
    {
      program: "Frontend Development with React",
      questions: [
        {
          text: "What is the virtual DOM in React?",
          options: [
            '["In-memory representation of real DOM", "A testing framework", "A routing library"]',
          ],
          answer: "In-memory representation of real DOM",
          difficulty: "medium",
        },
        {
          text: "Which hook is used for side effects?",
          options: ['["useState", "useEffect", "useContext"]'],
          answer: "useEffect",
          difficulty: "easy",
        },
        {
          text: "What is Redux used for?",
          options: ['["State management", "Styling", "Testing"]'],
          answer: "State management",
          difficulty: "medium",
        },
        {
          text: "What is the purpose of React.memo()?",
          options: [
            '["Performance optimization", "Error handling", "State management"]',
          ],
          answer: "Performance optimization",
          difficulty: "hard",
        },
      ],
    },
    // Django questions
    {
      program: "Backend Development with Python Django",
      questions: [
        {
          text: "What is Django ORM?",
          options: [
            '["Object-Relational Mapper", "Object-Runtime Manager", "Online Resource Manager"]',
          ],
          answer: "Object-Relational Mapper",
          difficulty: "easy",
        },
        {
          text: "Which file contains Django project settings?",
          options: ['["settings.py", "config.py", "setup.py"]'],
          answer: "settings.py",
          difficulty: "easy",
        },
        {
          text: "What is a Django view?",
          options: [
            '["Function that handles HTTP requests", "Database model", "Template file"]',
          ],
          answer: "Function that handles HTTP requests",
          difficulty: "medium",
        },
        {
          text: "What is Django middleware?",
          options: [
            '["Request/response processor", "Database connector", "Template engine"]',
          ],
          answer: "Request/response processor",
          difficulty: "hard",
        },
      ],
    },
  ];

  for (const programQuestions of assessmentQuestions) {
    const programId = programIds[programQuestions.program];
    if (programId) {
      for (let i = 0; i < programQuestions.questions.length; i++) {
        const q = programQuestions.questions[i];
        await client.query(`
          INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index)
          VALUES ('${programId}', '${q.text}', 'multiple_choice', '${
          q.options[0]
        }', '${q.answer}', 1, '${q.difficulty}', ${i + 1})
        `);
      }
    }
  }

  // Create assessment attempts
  await client.query(`
    INSERT INTO assessment_attempts (student_id, program_id, enrollment_id, total_questions, correct_answers, score_percentage, time_taken, status, completed_at)
    SELECT 
      si.student_id,
      si.program_id,
      si.id,
      (SELECT COUNT(*) FROM assessment_questions WHERE program_id = si.program_id),
      CASE 
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student1@example.com') THEN 4
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student2@example.com') THEN 3
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student4@example.com') THEN 5
        ELSE 2
      END,
      CASE 
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student1@example.com') THEN 80.00
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student2@example.com') THEN 75.00
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student4@example.com') THEN 100.00
        ELSE 50.00
      END,
      CASE 
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student1@example.com') THEN 25
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student2@example.com') THEN 30
        WHEN si.student_id = (SELECT id FROM users WHERE email = 'student4@example.com') THEN 20
        ELSE 35
      END,
      'completed',
      CURRENT_TIMESTAMP - INTERVAL '5 days'
    FROM student_internship si
    WHERE si.status IN ('in_progress', 'completed')
    LIMIT 4;
  `);

  // Create tasks for programs
  const taskData = [
    {
      program: "Full Stack MERN Development",
      title: "Environment Setup",
      description:
        "Set up development environment with Node.js, React, and MongoDB",
      type: "assignment",
      difficulty: "easy",
      points: 20,
    },
    {
      program: "Full Stack MERN Development",
      title: "Build Todo Application",
      description: "Create a complete todo application with CRUD operations",
      type: "project",
      difficulty: "medium",
      points: 100,
    },
    {
      program: "Full Stack MERN Development",
      title: "Authentication System",
      description: "Implement user authentication with JWT tokens",
      type: "project",
      difficulty: "hard",
      points: 150,
    },
    {
      program: "Frontend Development with React",
      title: "Component Library",
      description: "Build a reusable component library with Storybook",
      type: "project",
      difficulty: "medium",
      points: 100,
    },
    {
      program: "Frontend Development with React",
      title: "State Management",
      description: "Implement complex state management with Redux Toolkit",
      type: "assignment",
      difficulty: "hard",
      points: 80,
    },
    {
      program: "Backend Development with Python Django",
      title: "REST API Development",
      description: "Build a complete REST API with Django REST Framework",
      type: "project",
      difficulty: "medium",
      points: 120,
    },
    {
      program: "UI/UX Design Mastery",
      title: "Design System",
      description: "Create a comprehensive design system in Figma",
      type: "project",
      difficulty: "medium",
      points: 100,
    },
    {
      program: "Data Science with Python",
      title: "Data Analysis Project",
      description: "Perform comprehensive data analysis on real dataset",
      type: "project",
      difficulty: "hard",
      points: 150,
    },
  ];

  for (const task of taskData) {
    const programId = programIds[task.program];
    if (programId) {
      await client.query(`
        INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, instructions, estimated_hours)
        VALUES (
          '${programId}', 
          '${task.title}', 
          '${task.description}', 
          '${task.type}', 
          '${task.difficulty}', 
          ${task.points}, 
          CURRENT_TIMESTAMP + INTERVAL '14 days',
          'Complete the task as per the requirements and submit your work.',
          ${
            task.difficulty === "easy"
              ? 8
              : task.difficulty === "medium"
              ? 16
              : 24
          }
        )
      `);
    }
  }

  // Create task submissions - FIXED VERSION
  // Create task submissions - CORRECTED VERSION
  await client.query(`
  INSERT INTO task_submissions (task_id, student_id, submission_text, github_url, live_demo_url, status, points_earned, feedback, reviewed_by, submitted_at, reviewed_at)
  SELECT 
    t.id,
    si.student_id,
    'I have completed the "' || t.title || '" task successfully. Please find my implementation details below.',
    'https://github.com/student' || (ROW_NUMBER() OVER()) || '/' || LOWER(REPLACE(t.title, ' ', '-')),
    CASE WHEN t.task_type = 'project' THEN 'https://student' || (ROW_NUMBER() OVER()) || '-' || LOWER(REPLACE(t.title, ' ', '-')) || '.netlify.app' ELSE NULL END,
    CASE 
      WHEN (ROW_NUMBER() OVER()) <= 6 THEN 'approved'
      WHEN (ROW_NUMBER() OVER()) <= 8 THEN 'under_review'
      ELSE 'submitted'
    END,
    CASE 
      WHEN (ROW_NUMBER() OVER()) <= 6 THEN t.max_points * 0.85
      ELSE NULL
    END,
    CASE 
      WHEN (ROW_NUMBER() OVER()) <= 6 THEN 'Great work! Well implemented and documented. Minor improvements suggested.'
      ELSE NULL
    END,
    CASE 
      WHEN (ROW_NUMBER() OVER()) <= 6 THEN (SELECT id FROM users WHERE role = 'mentor' LIMIT 1)
      ELSE NULL
    END,
    CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 10 + 1) * INTERVAL '1 day'),
    CASE 
      WHEN (ROW_NUMBER() OVER()) <= 6 THEN CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 3 + 1) * INTERVAL '1 day')
      ELSE NULL
    END
  FROM tasks t
  JOIN student_internship si ON t.program_id = si.program_id
  WHERE si.status IN ('in_progress', 'completed')
  LIMIT 10;
`);
  // Create certificates for completed students
  await client.query(`
    INSERT INTO certificates (student_id, program_id, enrollment_id, certificate_number, certificate_url, assessment_score, project_score, final_grade, verification_code)
    SELECT 
      si.student_id,
      si.program_id,
      si.id,
      'CERT-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
      'https://certificates.winst.com/CERT-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0') || '.pdf',
      aa.score_percentage,
      85,
      'A',
      '${generateRandomCode("VERIFY", 12)}'
    FROM student_internship si
    LEFT JOIN assessment_attempts aa ON si.id = aa.enrollment_id
    WHERE si.status = 'completed'
  `);

  // Create learning journey entries
  await client.query(`
    INSERT INTO learning_journey (student_id, program_id, enrollment_id, current_step, progress_percentage, step_completed_at, next_step)
    SELECT 
      si.student_id,
      si.program_id,
      si.id,
      CASE 
        WHEN si.status = 'completed' THEN 'certificate_issued'
        WHEN EXISTS (SELECT 1 FROM task_submissions ts JOIN tasks t ON ts.task_id = t.id WHERE t.program_id = si.program_id AND ts.student_id = si.student_id AND ts.status = 'approved') THEN 'project_approved'
        WHEN EXISTS (SELECT 1 FROM assessment_attempts aa WHERE aa.enrollment_id = si.id AND aa.status = 'completed') THEN 'assessment_completed'
        ELSE 'enrolled'
      END,
      si.progress_percentage,
      CASE 
        WHEN si.status = 'completed' THEN CURRENT_TIMESTAMP - INTERVAL '1 day'
        ELSE CURRENT_TIMESTAMP - INTERVAL '5 days'
      END,
      CASE 
        WHEN si.status = 'completed' THEN NULL
        WHEN EXISTS (SELECT 1 FROM task_submissions ts JOIN tasks t ON ts.task_id = t.id WHERE t.program_id = si.program_id AND ts.student_id = si.student_id AND ts.status = 'approved') THEN 'certificate_eligible'
        WHEN EXISTS (SELECT 1 FROM assessment_attempts aa WHERE aa.enrollment_id = si.id AND aa.status = 'completed') THEN 'project_assigned'
        ELSE 'assessment_pending'
      END
    FROM student_internship si
  `);

  // Insert sample courses for Full Stack Development Track
  await client.query(`
    INSERT INTO courses (internship_program_id, title, description, logo, duration_weeks, prerequisites, learning_outcomes, technologies, difficulty_level, max_students) VALUES
    ('${programIds["Full Stack MERN Development"]}', 'MERN Stack Development', 'Complete full-stack development using MongoDB, Express.js, React.js, and Node.js. Build modern web applications with this powerful JavaScript stack.', 'https://example.com/logos/mern.png', 12, 'Basic JavaScript knowledge, HTML/CSS fundamentals', 'Build complete web applications, Master React components, Implement REST APIs, Database design with MongoDB', '["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "HTML", "CSS"]', 'intermediate', 25),
    ('${programIds["Full Stack MERN Development"]}', 'MEAN Stack Development', 'Full-stack development using MongoDB, Express.js, Angular, and Node.js. Create dynamic web applications with TypeScript and Angular framework.', 'https://example.com/logos/mean.png', 12, 'Basic JavaScript/TypeScript knowledge, HTML/CSS fundamentals', 'Master Angular framework, Build RESTful APIs, Database management, TypeScript proficiency', '["MongoDB", "Express.js", "Angular", "Node.js", "TypeScript", "HTML", "CSS"]', 'intermediate', 25),
    ('${programIds["Full Stack MERN Development"]}', 'React + .NET Development', 'Modern web development combining React frontend with .NET backend. Learn to build enterprise-level applications with Microsoft technologies.', 'https://example.com/logos/react-dotnet.png', 14, 'C# basics, JavaScript fundamentals, HTML/CSS', 'React component development, .NET API creation, Entity Framework, Authentication & Authorization', '["React.js", "C#", ".NET Core", "Entity Framework", "SQL Server", "JavaScript", "HTML", "CSS"]', 'advanced', 20),
    ('${programIds["Full Stack MERN Development"]}', 'Vue.js + Laravel', 'Full-stack development using Vue.js frontend with Laravel PHP backend. Build elegant and powerful web applications.', 'https://example.com/logos/vue-laravel.png', 12, 'PHP basics, JavaScript fundamentals, HTML/CSS', 'Vue.js mastery, Laravel framework, Eloquent ORM, API development', '["Vue.js", "Laravel", "PHP", "MySQL", "JavaScript", "HTML", "CSS", "Blade Templates"]', 'intermediate', 25)
  `);

  // Insert sample courses for Data Science Track
  await client.query(`
    INSERT INTO courses (internship_program_id, title, description, logo, duration_weeks, prerequisites, learning_outcomes, technologies, difficulty_level, max_students) VALUES
    ('${programIds["Data Science with Python"]}', 'Python Data Analysis', 'Master data analysis using Python with pandas, numpy, and matplotlib. Learn to extract insights from complex datasets.', 'https://example.com/logos/python-data.png', 10, 'Basic Python programming, Statistics fundamentals', 'Data manipulation with pandas, Statistical analysis, Data visualization, Report generation', '["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"]', 'beginner', 30),
    ('${programIds["Data Science with Python"]}', 'Machine Learning Fundamentals', 'Introduction to machine learning algorithms and implementations. Build predictive models and understand ML concepts.', 'https://example.com/logos/ml.png', 14, 'Python programming, Statistics, Linear Algebra basics', 'Supervised/Unsupervised learning, Model evaluation, Feature engineering, ML pipelines', '["Python", "Scikit-learn", "TensorFlow", "Pandas", "NumPy", "Matplotlib"]', 'intermediate', 25),
    ('${programIds["Data Science with Python"]}', 'Deep Learning with TensorFlow', 'Advanced deep learning concepts using TensorFlow. Build neural networks for complex problems like image recognition and NLP.', 'https://example.com/logos/tensorflow.png', 16, 'Machine Learning basics, Python proficiency, Mathematics', 'Neural networks, CNN, RNN, Transfer learning, Model deployment', '["TensorFlow", "Keras", "Python", "NumPy", "OpenCV", "NLTK"]', 'advanced', 20)
  `);
}

async function verifyCompleteData(client) {
  const verificationQueries = [
    {
      name: "Users",
      query: "SELECT COUNT(*) as count, role FROM users GROUP BY role",
    },
    {
      name: "Technologies",
      query: "SELECT COUNT(*) as count FROM technologies",
    },
    {
      name: "Programs",
      query: "SELECT COUNT(*) as count FROM internship_programs",
    },
    {
      name: "Enrollments",
      query:
        "SELECT COUNT(*) as count, status FROM student_internship GROUP BY status",
    },
    {
      name: "Orders",
      query: "SELECT COUNT(*) as count, status FROM orders GROUP BY status",
    },
    {
      name: "Payments",
      query: "SELECT COUNT(*) as count, status FROM payments GROUP BY status",
    },
    {
      name: "Assessment Questions",
      query: "SELECT COUNT(*) as count FROM assessment_questions",
    },
    {
      name: "Assessment Attempts",
      query:
        "SELECT COUNT(*) as count, status FROM assessment_attempts GROUP BY status",
    },
    {
      name: "Referrals",
      query: "SELECT COUNT(*) as count, status FROM referrals GROUP BY status",
    },
    {
      name: "Affiliates",
      query: "SELECT COUNT(*) as count, status FROM affiliates GROUP BY status",
    },
    {
      name: "Affiliate Earnings",
      query:
        "SELECT COUNT(*) as count, status FROM affiliate_earnings GROUP BY status",
    },
    { name: "Tasks", query: "SELECT COUNT(*) as count FROM tasks" },
    {
      name: "Task Submissions",
      query:
        "SELECT COUNT(*) as count, status FROM task_submissions GROUP BY status",
    },
    {
      name: "Certificates",
      query: "SELECT COUNT(*) as count FROM certificates",
    },
    {
      name: "Learning Journey",
      query: "SELECT COUNT(*) as count FROM learning_journey",
    },
  ];

  console.log("\n📊 Comprehensive Database Verification Results:");

  for (const { name, query } of verificationQueries) {
    try {
      const result = await client.query(query);
      if (result.rows.length > 1) {
        console.log(`   ✅ ${name}:`);
        result.rows.forEach((row) => {
          const statusKey = Object.keys(row).find((key) => key !== "count");
          console.log(
            `      - ${statusKey ? row[statusKey] : "total"}: ${row.count}`
          );
        });
      } else {
        console.log(`   ✅ ${name}: ${result.rows[0].count} records`);
      }
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`);
    }
  }

  // Verify all 4 requirements implementation
  try {
    const requirementCheck = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM assessment_questions) as assessments,
        (SELECT COUNT(*) FROM assessment_attempts WHERE status = 'completed') as completed_assessments,
        (SELECT COUNT(*) FROM referrals) as referrals,
        (SELECT COUNT(*) FROM referrals WHERE status = 'completed') as used_referrals,
        (SELECT COUNT(*) FROM affiliates) as affiliates,
        (SELECT COUNT(*) FROM affiliate_earnings) as affiliate_earnings,
        (SELECT COUNT(*) FROM task_submissions) as submissions,
        (SELECT COUNT(*) FROM task_submissions WHERE status = 'approved') as approved_submissions
    `);

    const req = requirementCheck.rows[0];
    console.log("\n🎯 ALL 4 REQUIREMENTS IMPLEMENTATION STATUS:");
    console.log(
      `   ${req.assessments > 0 ? "✅" : "❌"} 1. ASSESSMENTS SYSTEM:`
    );
    console.log(`      - Questions: ${req.assessments}`);
    console.log(`      - Completed Attempts: ${req.completed_assessments}`);
    console.log(`   ${req.referrals > 0 ? "✅" : "❌"} 2. REFERRAL SYSTEM:`);
    console.log(`      - Total Referral Codes: ${req.referrals}`);
    console.log(`      - Used Referrals: ${req.used_referrals}`);
    console.log(`   ${req.affiliates > 0 ? "✅" : "❌"} 3. AFFILIATE PROGRAM:`);
    console.log(`      - Affiliate Accounts: ${req.affiliates}`);
    console.log(`      - Earnings Records: ${req.affiliate_earnings}`);
    console.log(`   ${req.submissions > 0 ? "✅" : "❌"} 4. TASK SUBMISSIONS:`);
    console.log(`      - Total Submissions: ${req.submissions}`);
    console.log(`      - Approved Submissions: ${req.approved_submissions}`);

    const allImplemented =
      req.assessments > 0 &&
      req.referrals > 0 &&
      req.affiliates > 0 &&
      req.submissions > 0;

    if (allImplemented) {
      console.log(
        "\n🎉 ALL 4 REQUIREMENTS SUCCESSFULLY IMPLEMENTED WITH COMPREHENSIVE DATA!"
      );

      // Show some sample data
      const sampleData = await client.query(`
        SELECT 
          'Sample Users' as category,
          u.email,
          u.first_name,
          u.role
        FROM users u 
        WHERE u.role IN ('student', 'mentor', 'affiliate') 
        LIMIT 3
      `);

      console.log("\n📝 Sample Data Preview:");
      sampleData.rows.forEach((row) => {
        console.log(`   👤 ${row.role}: ${row.first_name} (${row.email})`);
      });
    } else {
      console.log(
        "\n⚠️  Some requirements need attention - check the logs above."
      );
    }
  } catch (error) {
    console.log("❌ Error checking requirements:", error.message);
  }
}

// Run the setup
setupDatabase();
