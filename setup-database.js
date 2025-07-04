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
  console.log("🚀 Setting up Lucro Internship Portal Database...");

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

    // Read and execute schema
    console.log("🏗️ Creating tables and schema...");
    const schemaPath = path.join(__dirname, "database", "schema.sql");

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await targetClient.query(schema);
      console.log("✅ Schema created successfully!");
    } else {
      console.log("⚠️ Schema file not found, creating basic schema...");
      await createBasicSchema(targetClient);
    }

    // Insert basic data with proper password hashing
    console.log("📝 Inserting basic user data...");
    await createBasicData(targetClient);

    // Insert comprehensive dummy data
    console.log("📝 Inserting comprehensive dummy data...");
    await createComprehensiveDummyData(targetClient);

    // Verify data insertion
    console.log("🔍 Running verification queries...");
    const verificationQueries = [
      "SELECT COUNT(*) as users FROM users",
      "SELECT COUNT(*) as programs FROM internship_programs",
      "SELECT COUNT(*) as enrollments FROM student_internship",
      "SELECT COUNT(*) as orders FROM orders",
      "SELECT COUNT(*) as payments FROM payments",
    ];

    for (const query of verificationQueries) {
      try {
        const result = await targetClient.query(query);
        console.log(
          `   ${query.split(" ")[3]}: ${result.rows[0][query.split(" ")[3]]}`
        );
      } catch (error) {
        console.log(`   ${query.split(" ")[3]}: 0 (table not found)`);
      }
    }

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
    console.log("   Student: rahul@example.com / password123");
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

async function createBasicSchema(client) {
  const basicSchema = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
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
    CREATE TABLE IF NOT EXISTS technologies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        icon_url VARCHAR(300),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Internship programs table
    CREATE TABLE IF NOT EXISTS internship_programs (
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
    CREATE TABLE IF NOT EXISTS program_technologies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
        technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Student internship enrollments
    CREATE TABLE IF NOT EXISTS student_internship (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders table for payments
    CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES users(id) ON DELETE CASCADE,
        program_id UUID REFERENCES internship_programs(id) ON DELETE CASCADE,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        final_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(5) DEFAULT 'INR',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
        payment_method VARCHAR(50),
        payment_gateway VARCHAR(50),
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Payments table
    CREATE TABLE IF NOT EXISTS payments (
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

    -- Tasks/Assignments table
    CREATE TABLE IF NOT EXISTS tasks (
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
    CREATE TABLE IF NOT EXISTS task_submissions (
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

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_student_internship_student_id ON student_internship(student_id);
    CREATE INDEX IF NOT EXISTS idx_student_internship_program_id ON student_internship(program_id);
    CREATE INDEX IF NOT EXISTS idx_orders_student_id ON orders(student_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_submissions_student_id ON task_submissions(student_id);
  `;

  await client.query(basicSchema);
}

async function createBasicData(client) {
  // Hash passwords using crypto
  const adminPasswordHash = hashPassword("password123");
  const studentPasswordHash = hashPassword("password123");

  // First, clear existing data to avoid conflicts
  await client.query(
    "TRUNCATE TABLE task_submissions, tasks, student_internship, payments, orders, program_technologies, internship_programs, technologies, users RESTART IDENTITY CASCADE"
  );

  const basicData = `
    -- Insert admin user (password: password123)
    INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('admin@lucro.com', '${adminPasswordHash}', 'Admin', 'User', 'admin');

    -- Insert sample student (password: password123)
    INSERT INTO users (email, password_hash, first_name, last_name, role, college_name, degree, branch, year_of_study, cgpa) VALUES
    ('rahul@example.com', '${studentPasswordHash}', 'Rahul', 'Sharma', 'student', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5);

    -- Insert sample students
    INSERT INTO users (email, password_hash, first_name, last_name, role, college_name, degree, branch, year_of_study, cgpa) VALUES
    ('priya@example.com', '${studentPasswordHash}', 'Priya', 'Singh', 'student', 'NIT Trichy', 'B.Tech', 'Information Technology', 2, 9.1),
    ('amit@example.com', '${studentPasswordHash}', 'Amit', 'Kumar', 'student', 'BITS Pilani', 'B.E.', 'Computer Science', 4, 8.7),
    ('sneha@example.com', '${studentPasswordHash}', 'Sneha', 'Patel', 'student', 'VIT Vellore', 'B.Tech', 'Electronics', 3, 8.9);
  `;

  await client.query(basicData);
}

async function createComprehensiveDummyData(client) {
  // Insert Technologies
  await client.query(`
    INSERT INTO technologies (name, category, description, icon_url) VALUES
    ('React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
    ('Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
    ('Python', 'Programming Language', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
    ('JavaScript', 'Programming Language', 'Dynamic programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'),
    ('PostgreSQL', 'Database', 'Open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
    ('MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
    ('Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'),
    ('Tailwind CSS', 'Frontend', 'Utility-first CSS framework', 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg'),
    ('Docker', 'DevOps', 'Containerization platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
    ('AWS', 'Cloud', 'Amazon Web Services', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg')
    ON CONFLICT (name) DO NOTHING
  `);

  // Insert comprehensive internship programs (All priced at ₹2000)
  await client.query(`
    INSERT INTO internship_programs (title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, requirements, learning_outcomes, image_url) VALUES
    ('Full Stack Web Development', 'Complete full-stack development internship covering React, Node.js, and databases. Build real-world projects and gain industry experience.', 12, 'intermediate', 2000.00, 0, 2000.00, 50, 'Basic knowledge of HTML, CSS, JavaScript', 'Master React, Node.js, Express, MongoDB, RESTful APIs, Authentication, Deployment', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),
    ('Frontend Development with React', 'Specialized frontend development internship focusing on modern React development, state management, and responsive design.', 10, 'intermediate', 2000.00, 0, 2000.00, 40, 'HTML, CSS, JavaScript basics', 'Advanced React, Redux, TypeScript, Responsive Design, Performance Optimization', 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500'),
    ('Backend Development with Node.js', 'Master server-side development with Node.js, Express, and database integration for scalable web applications.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'JavaScript fundamentals, Basic programming', 'Node.js, Express.js, MongoDB, PostgreSQL, API Development, Authentication', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500'),
    ('UI/UX Design Internship', 'Learn user interface and experience design principles, design systems, and create stunning interfaces.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic design sense, Creativity', 'Figma, Adobe XD, Design Systems, Typography, Color Theory, Prototyping', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),
    ('Data Science with Python', 'Comprehensive data science internship with Python, covering data analysis, machine learning, and visualization.', 12, 'intermediate', 2000.00, 0, 2000.00, 30, 'Python basics, Statistics fundamentals', 'Python, Pandas, NumPy, Matplotlib, Scikit-learn, Machine Learning', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'),
    ('Mobile App Development', 'Cross-platform mobile development using React Native. Build apps for both iOS and Android.', 8, 'intermediate', 2000.00, 0, 2000.00, 35, 'React basics, JavaScript knowledge', 'React Native, Expo, Navigation, State Management, App Deployment', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500'),
    ('DevOps Engineering', 'Master DevOps practices including CI/CD, containerization, and cloud deployment.', 12, 'advanced', 2000.00, 0, 2000.00, 25, 'Linux basics, Programming experience', 'Docker, Kubernetes, Jenkins, AWS, Terraform, Monitoring', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500'),
    ('Digital Marketing', 'Complete digital marketing internship covering SEO, SEM, social media, and analytics.', 8, 'beginner', 2000.00, 0, 2000.00, 50, 'Basic computer knowledge, Communication skills', 'SEO, Google Ads, Facebook Marketing, Content Strategy, Analytics', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500')
    ON CONFLICT DO NOTHING
  `);

  // Insert sample enrollments
  const enrollmentQuery = `
    INSERT INTO student_internship (student_id, program_id, status, progress_percentage, enrollment_date) 
    SELECT 
      u.id,
      p.id,
      CASE 
        WHEN random() < 0.3 THEN 'completed'
        WHEN random() < 0.6 THEN 'in_progress'
        ELSE 'enrolled'
      END,
      CASE 
        WHEN random() < 0.3 THEN 100
        WHEN random() < 0.6 THEN floor(random() * 80 + 20)::int
        ELSE floor(random() * 30)::int
      END,
      NOW() - (random() * interval '90 days')
    FROM users u
    CROSS JOIN internship_programs p
    WHERE u.role = 'student' AND random() < 0.4
    ON CONFLICT DO NOTHING
  `;

  await client.query(enrollmentQuery);

  // Insert sample orders
  const orderQuery = `
    INSERT INTO orders (student_id, program_id, order_number, amount, discount_amount, final_amount, status)
    SELECT 
      si.student_id,
      si.program_id,
      'ORD-' || extract(epoch from NOW())::bigint || '-' || si.student_id::text,
      p.price,
      p.price * p.discount_percentage / 100,
      p.final_price,
      'paid'
    FROM student_internship si
    JOIN internship_programs p ON si.program_id = p.id
    WHERE random() < 0.8
    ON CONFLICT DO NOTHING
  `;

  await client.query(orderQuery);

  // Insert sample payments
  const paymentQuery = `
    INSERT INTO payments (order_id, amount, payment_method, payment_gateway, status, processed_at)
    SELECT 
      o.id,
      o.final_amount,
      'razorpay',
      'razorpay',
      'success',
      o.created_at + interval '5 minutes'
    FROM orders o
    WHERE o.status = 'paid'
    ON CONFLICT DO NOTHING
  `;

  await client.query(paymentQuery);
}

// Run the setup
setupDatabase();
