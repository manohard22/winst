const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Database configuration
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Connect to default database first
  user: 'postgres',
  password: 'root'
};

const TARGET_DB = {
  name: 'lucro_portal_db_1',
  user: 'lucro_db_user_1',
  password: 'root'
};

// Simple password hashing using crypto
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function setupDatabase() {
  console.log('🚀 Setting up Lucro Internship Portal Database...');
  
  let client;
  
  try {
    // Connect to PostgreSQL as superuser
    client = new Client(DB_CONFIG);
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create database and user
    console.log('📊 Creating database and user...');
    
    try {
      await client.query(`DROP DATABASE IF EXISTS ${TARGET_DB.name}`);
      await client.query(`DROP USER IF EXISTS ${TARGET_DB.user}`);
    } catch (error) {
      // Ignore errors if database/user doesn't exist
    }

    await client.query(`CREATE DATABASE ${TARGET_DB.name}`);
    await client.query(`CREATE USER ${TARGET_DB.user} WITH PASSWORD '${TARGET_DB.password}'`);
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${TARGET_DB.name} TO ${TARGET_DB.user}`);
    await client.query(`ALTER USER ${TARGET_DB.user} CREATEDB SUPERUSER`);
    
    console.log('✅ Database and user created successfully!');
    
    // Close connection to default database
    await client.end();

    // Connect to the new database as superuser first to fix permissions
    const superuserClient = new Client({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: TARGET_DB.name,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    await superuserClient.connect();
    console.log('✅ Connected to target database as superuser');

    // Fix schema permissions
    console.log('🔧 Fixing schema permissions...');
    await superuserClient.query(`GRANT ALL ON SCHEMA public TO ${TARGET_DB.user}`);
    await superuserClient.query(`ALTER SCHEMA public OWNER TO ${TARGET_DB.user}`);
    await superuserClient.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${TARGET_DB.user}`);
    await superuserClient.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${TARGET_DB.user}`);
    await superuserClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${TARGET_DB.user}`);
    await superuserClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${TARGET_DB.user}`);
    
    await superuserClient.end();

    // Now connect as the target user
    const targetClient = new Client({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: TARGET_DB.name,
      user: TARGET_DB.user,
      password: TARGET_DB.password
    });

    await targetClient.connect();
    console.log('✅ Connected to target database as target user');

    // Read and execute schema
    console.log('🏗️ Creating tables and schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await targetClient.query(schema);
      console.log('✅ Schema created successfully!');
    } else {
      console.log('⚠️ Schema file not found, creating basic schema...');
      await createBasicSchema(targetClient);
    }

    // Insert basic data with proper password hashing
    console.log('📝 Inserting basic user data...');
    await createBasicData(targetClient);

    // Read and execute dummy data
    console.log('📝 Inserting additional dummy data...');
    const dummyDataPath = path.join(__dirname, 'database', 'dummy_data.sql');
    
    if (fs.existsSync(dummyDataPath)) {
      const dummyData = fs.readFileSync(dummyDataPath, 'utf8');
      await targetClient.query(dummyData);
      console.log('✅ Dummy data inserted successfully!');
    }

    // Verify data insertion
    console.log('🔍 Running verification queries...');
    const verificationQueries = [
      'SELECT COUNT(*) as users FROM users',
      'SELECT COUNT(*) as programs FROM internship_programs',
      'SELECT COUNT(*) as enrollments FROM student_internship',
      'SELECT COUNT(*) as orders FROM orders',
      'SELECT COUNT(*) as payments FROM payments'
    ];

    for (const query of verificationQueries) {
      try {
        const result = await targetClient.query(query);
        console.log(`   ${query.split(' ')[3]}: ${result.rows[0][query.split(' ')[3]]}`);
      } catch (error) {
        console.log(`   ${query.split(' ')[3]}: 0 (table not found)`);
      }
    }

    await targetClient.end();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Connection Details:');
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   Port: ${DB_CONFIG.port}`);
    console.log(`   Database: ${TARGET_DB.name}`);
    console.log(`   Username: ${TARGET_DB.user}`);
    console.log(`   Password: ${TARGET_DB.password}`);
    console.log('\n🔗 Connection String:');
    console.log(`   postgresql://${TARGET_DB.user}:${TARGET_DB.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${TARGET_DB.name}`);
    console.log('\n👥 Sample Login Credentials:');
    console.log('   Admin: admin@lucro.com / password123');
    console.log('   Student: rahul@example.com / password123');
    console.log('\n💡 Next Steps:');
    console.log('   1. Update your .env file with the database connection details');
    console.log('   2. Install Node.js dependencies: npm run install-all');
    console.log('   3. Start the development server: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
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
        order_number VARCHAR(50) UNIQUE NOT NULL,
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
  const adminPasswordHash = hashPassword('password123');
  const studentPasswordHash = hashPassword('password123');

  const basicData = `
    -- Insert admin user (password: password123)
    INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('admin@lucro.com', '${adminPasswordHash}', 'Admin', 'User', 'admin')
    ON CONFLICT (email) DO NOTHING;

    -- Insert sample student (password: password123)
    INSERT INTO users (email, password_hash, first_name, last_name, role, college_name, degree, branch, year_of_study, cgpa) VALUES
    ('rahul@example.com', '${studentPasswordHash}', 'Rahul', 'Sharma', 'student', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5)
    ON CONFLICT (email) DO NOTHING;
  `;

  await client.query(basicData);
}

// Run the setup
setupDatabase();
