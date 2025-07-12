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
  name: "lucro_portal_fresh_db",
  user: "lucro_fresh_user",
  password: "lucro_secure_2025",
};

// Simple password hashing using crypto
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

// Generate unique codes
function generateReferralCode() {
  return "REF" + crypto.randomBytes(6).toString("hex").toUpperCase();
}

function generateAffiliateCode() {
  return "AFF" + crypto.randomBytes(6).toString("hex").toUpperCase();
}

function generateOrderNumber() {
  return "ORD" + Date.now() + Math.floor(Math.random() * 1000);
}

async function setupFreshDatabase() {
  console.log("🎯 Setting up Lucro Internship Portal - FRESH DATABASE");
  console.log("🔧 Core Infrastructure with 4 Major Features Implementation");
  console.log(
    "📊 Assessment System | 🤝 Referral Friend System | 💰 Affiliate Program | 📝 Task Submissions"
  );
  console.log("=".repeat(80));

  let client;

  try {
    // Connect to PostgreSQL as superuser
    client = new Client(DB_CONFIG);
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // Create database and user
    console.log("📊 Creating fresh database and user...");

    try {
      await client.query(`DROP DATABASE IF EXISTS ${TARGET_DB.name}`);
      await client.query(`DROP USER IF EXISTS ${TARGET_DB.user}`);
      console.log("🗑️ Cleaned up existing database and user");
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

    console.log("✅ Fresh database and user created successfully!");

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
    console.log("🔧 Configuring database permissions...");
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

    // Create fresh complete schema with all 4 features
    console.log(
      "🏗️ Creating fresh complete schema with all 4 major features..."
    );
    const freshSchemaPath = path.join(
      __dirname,
      "database",
      "fresh_complete_schema.sql"
    );

    if (fs.existsSync(freshSchemaPath)) {
      const freshSchema = fs.readFileSync(freshSchemaPath, "utf8");
      await targetClient.query(freshSchema);
      console.log("✅ Fresh complete schema created successfully!");
      console.log("   📊 Assessment System - READY");
      console.log("   🤝 Referral Friend System - READY");
      console.log("   💰 Affiliate Program - READY");
      console.log("   📝 Task Submissions System - READY");
    } else {
      throw new Error(
        "Fresh schema file not found! Please ensure fresh_complete_schema.sql exists."
      );
    }

    // Insert comprehensive dummy data with all 4 features
    console.log("📝 Inserting comprehensive dummy data with all features...");
    await createCompleteDummyData(targetClient);

    // Run verification queries
    console.log("🔍 Running comprehensive verification...");
    await runVerificationQueries(targetClient);

    await targetClient.end();

    console.log("\n🎉 FRESH DATABASE SETUP COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(80));
    console.log("🔧 Core Infrastructure: ✅ COMPLETED");
    console.log("📊 Assessment System: ✅ READY");
    console.log("🤝 Referral Friend System: ✅ READY");
    console.log("💰 Affiliate Program: ✅ READY");
    console.log("📝 Task Submissions: ✅ READY");
    console.log("=".repeat(80));

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
    console.log("   🔑 Admin: admin@lucro.com / admin123");
    console.log("   🎓 Student: john.doe@college.edu / student123");
    console.log("   👨‍🏫 Mentor: dr.smith@lucro.com / mentor123");
    console.log("   💼 Affiliate: alex.marketer@agency.com / affiliate123");

    console.log("\n🎯 Feature Test Data Available:");
    console.log("   📊 25+ Assessment Questions across programs");
    console.log("   🤝 5 Referral codes with ₹499 discount");
    console.log("   💰 5 Affiliate accounts with 25% commission");
    console.log("   📝 10 Tasks with comprehensive submissions");

    console.log("\n💡 Next Steps:");
    console.log(
      "   1. Update your .env file with the database connection details"
    );
    console.log("   2. Install dependencies: npm install");
    console.log("   3. Start the development server: npm run dev");
    console.log("   4. Access the portal and test all 4 major features");
  } catch (error) {
    console.error("❌ Fresh database setup failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

async function createCompleteDummyData(client) {
  // Hash passwords for different roles
  const adminHash = hashPassword("admin123");
  const studentHash = hashPassword("student123");
  const mentorHash = hashPassword("mentor123");
  const affiliateHash = hashPassword("affiliate123");

  console.log("👥 Creating users with different roles...");

  // Insert comprehensive users
  await client.query(`
    INSERT INTO users (email, password_hash, first_name, last_name, role, college_name, degree, branch, year_of_study, cgpa, linkedin_url, github_url, is_active, email_verified) VALUES
    
    -- Admin Users
    ('admin@lucro.com', '${adminHash}', 'Admin', 'Lucro', 'admin', NULL, NULL, NULL, NULL, NULL, 'https://linkedin.com/in/admin-lucro', NULL, true, true),
    
    -- Mentor Users
    ('dr.smith@lucro.com', '${mentorHash}', 'Dr. Robert', 'Smith', 'mentor', 'Stanford University', 'PhD', 'Computer Science', NULL, NULL, 'https://linkedin.com/in/dr-smith', 'https://github.com/drsmith', true, true),
    
    -- Student Users (9 students)
    ('john.doe@college.edu', '${studentHash}', 'John', 'Doe', 'student', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5, 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe', true, true),
    ('jane.smith@university.edu', '${studentHash}', 'Jane', 'Smith', 'student', 'NIT Trichy', 'B.Tech', 'Information Technology', 2, 9.1, 'https://linkedin.com/in/janesmith', 'https://github.com/janesmith', true, true),
    ('mike.johnson@college.edu', '${studentHash}', 'Mike', 'Johnson', 'student', 'BITS Pilani', 'B.E.', 'Computer Science', 4, 8.7, 'https://linkedin.com/in/mikejohnson', 'https://github.com/mikejohnson', true, true),
    ('sarah.wilson@university.edu', '${studentHash}', 'Sarah', 'Wilson', 'student', 'VIT Vellore', 'B.Tech', 'Electronics', 3, 8.9, 'https://linkedin.com/in/sarahwilson', 'https://github.com/sarahwilson', true, true),
    ('david.brown@college.edu', '${studentHash}', 'David', 'Brown', 'student', 'DTU Delhi', 'B.Tech', 'Software Engineering', 3, 8.3, 'https://linkedin.com/in/davidbrown', 'https://github.com/davidbrown', true, true),
    ('emily.davis@university.edu', '${studentHash}', 'Emily', 'Davis', 'student', 'IIIT Hyderabad', 'B.Tech', 'Computer Science', 2, 9.0, 'https://linkedin.com/in/emilydavis', 'https://github.com/emilydavis', true, true),
    ('alex.garcia@college.edu', '${studentHash}', 'Alex', 'Garcia', 'student', 'Manipal Institute', 'B.Tech', 'Information Technology', 4, 8.6, 'https://linkedin.com/in/alexgarcia', 'https://github.com/alexgarcia', true, true),
    ('lisa.martinez@university.edu', '${studentHash}', 'Lisa', 'Martinez', 'student', 'SRM University', 'B.Tech', 'Computer Science', 3, 8.8, 'https://linkedin.com/in/lisamartinez', 'https://github.com/lisamartinez', true, true),
    ('ryan.anderson@college.edu', '${studentHash}', 'Ryan', 'Anderson', 'student', 'Amity University', 'B.Tech', 'Information Technology', 2, 8.4, 'https://linkedin.com/in/ryananderson', 'https://github.com/ryananderson', true, true),
    
    -- Affiliate Users
    ('alex.marketer@agency.com', '${affiliateHash}', 'Alex', 'Marketer', 'affiliate', NULL, 'MBA', 'Marketing', NULL, NULL, 'https://linkedin.com/in/alex-marketer', NULL, true, true),
    
    -- Friend referral users (2 users)
    ('friend1@gmail.com', '${studentHash}', 'Friend', 'One', 'student', 'Delhi University', 'B.Sc', 'Computer Science', 2, 7.8, NULL, NULL, true, true),
    ('friend2@gmail.com', '${studentHash}', 'Friend', 'Two', 'student', 'Mumbai University', 'BCA', 'Computer Applications', 3, 8.2, NULL, NULL, true, true)
  `);

  console.log("🎓 Creating technologies and programs...");

  // Insert technologies
  await client.query(`
    INSERT INTO technologies (name, category, description, icon_url, is_active, sort_order) VALUES
    ('React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true, 1),
    ('Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true, 2),
    ('MongoDB', 'Database', 'NoSQL document-oriented database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', true, 3),
    ('Express.js', 'Backend', 'Fast, unopinionated, minimalist web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', true, 4),
    ('Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', true, 5),
    ('Django', 'Backend', 'High-level Python Web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', true, 6),
    ('PostgreSQL', 'Database', 'Open source object-relational database system', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', true, 7),
    ('JavaScript', 'Frontend', 'Programming language of the web', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', true, 8),
    ('HTML5', 'Frontend', 'Markup language for creating web pages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', true, 9),
    ('CSS3', 'Frontend', 'Style sheet language for describing presentation', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', true, 10),
    ('Flutter', 'Mobile', 'UI toolkit for building mobile applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', true, 11),
    ('Dart', 'Mobile', 'Programming language for Flutter', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', true, 12),
    ('Docker', 'DevOps', 'Platform for developing, shipping, and running applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', true, 13),
    ('AWS', 'Cloud', 'Amazon Web Services cloud platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', true, 14),
    ('Git', 'Tools', 'Distributed version control system', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', true, 15)
  `);

  // Insert internship programs
  await client.query(`
    INSERT INTO internship_programs (title, slug, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, current_participants, start_date, end_date, registration_deadline, certificate_provided, mentorship_included, project_based, remote_allowed, assessment_required, minimum_score_required, requirements, learning_outcomes, syllabus, image_url, featured, is_active) VALUES
    
    ('Full Stack MERN Development', 'full-stack-mern-development', 'Master MongoDB, Express.js, React, and Node.js to build modern web applications', 12, 'intermediate', 4999.00, 10, 4499.00, 50, 15, '2025-08-01', '2025-10-24', '2025-07-25', true, true, true, true, true, 75.00, 'Basic JavaScript knowledge, HTML/CSS fundamentals', 'Build full-stack web applications, RESTful APIs, Database design, Authentication systems', 'Week 1-2: JavaScript ES6+, Week 3-4: React Fundamentals, Week 5-6: Node.js & Express, Week 7-8: MongoDB & Mongoose, Week 9-10: Authentication & Security, Week 11-12: Deployment & Best Practices', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500', true, true),
    
    ('React Frontend Mastery', 'react-frontend-mastery', 'Become an expert in React.js with hooks, context, and modern patterns', 8, 'beginner', 2999.00, 15, 2549.00, 40, 22, '2025-07-15', '2025-09-09', '2025-07-10', true, true, true, true, true, 70.00, 'Basic HTML, CSS, and JavaScript knowledge', 'Master React components, hooks, state management, routing', 'Week 1-2: React Basics & JSX, Week 3-4: Components & Props, Week 5-6: Hooks & State Management, Week 7-8: Advanced Patterns & Optimization', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', true, true),
    
    ('Python Django Backend', 'python-django-backend', 'Build robust backend applications with Python and Django framework', 10, 'intermediate', 3999.00, 12, 3519.00, 35, 18, '2025-08-15', '2025-10-24', '2025-08-10', true, true, true, true, true, 75.00, 'Python basics, OOP concepts', 'Django framework, REST APIs, Database modeling, Authentication', 'Week 1-2: Python Advanced, Week 3-4: Django Basics, Week 5-6: Models & Database, Week 7-8: Views & Templates, Week 9-10: REST API & Deployment', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500', false, true),
    
    ('Node.js Backend Development', 'nodejs-backend-development', 'Create scalable server-side applications with Node.js and Express', 8, 'intermediate', 3499.00, 10, 3149.00, 30, 12, '2025-07-20', '2025-09-14', '2025-07-15', true, true, true, true, true, 72.00, 'JavaScript fundamentals, basic programming concepts', 'Server-side JavaScript, Express.js, API development, Database integration', 'Week 1-2: Node.js Fundamentals, Week 3-4: Express.js Framework, Week 5-6: Database Integration, Week 7-8: Authentication & Security', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500', false, true),
    
    ('Flutter Mobile App Development', 'flutter-mobile-app-development', 'Build cross-platform mobile applications using Flutter and Dart', 10, 'beginner', 4499.00, 8, 4139.00, 25, 8, '2025-09-01', '2025-11-10', '2025-08-25', true, true, true, true, true, 70.00, 'Basic programming knowledge, mobile app development interest', 'Flutter framework, Dart programming, Mobile UI/UX, App deployment', 'Week 1-2: Dart Programming, Week 3-4: Flutter Basics, Week 5-6: UI Development, Week 7-8: State Management, Week 9-10: API Integration & Deployment', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', true, true),
    
    ('UI/UX Design Fundamentals', 'ui-ux-design-fundamentals', 'Learn user interface and user experience design principles and tools', 6, 'beginner', 2499.00, 20, 1999.00, 45, 28, '2025-07-10', '2025-08-21', '2025-07-05', true, true, true, true, true, 65.00, 'Creative mindset, basic computer skills', 'Design principles, Figma/Adobe XD, User research, Prototyping', 'Week 1-2: Design Principles, Week 3-4: Figma Mastery, Week 5-6: User Research & Prototyping', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', false, true),
    
    ('Data Science with Python', 'data-science-with-python', 'Analyze data and build machine learning models using Python', 14, 'advanced', 5999.00, 5, 5699.00, 20, 6, '2025-09-15', '2025-12-22', '2025-09-10', true, true, true, true, true, 80.00, 'Python programming, Statistics basics, Mathematics fundamentals', 'Data analysis, Machine learning, Data visualization, Statistical modeling', 'Week 1-2: Python for Data Science, Week 3-4: Data Analysis with Pandas, Week 5-6: Data Visualization, Week 7-8: Statistics & Probability, Week 9-10: Machine Learning Basics, Week 11-12: Advanced ML Algorithms, Week 13-14: Real-world Projects', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', true, true),
    
    ('DevOps & Cloud Computing', 'devops-cloud-computing', 'Master DevOps practices and cloud platforms for modern deployment', 12, 'advanced', 5499.00, 7, 5114.00, 15, 4, '2025-10-01', '2025-12-24', '2025-09-25', true, true, true, true, true, 78.00, 'Linux basics, Programming experience, System administration knowledge', 'Docker, Kubernetes, AWS/Azure, CI/CD pipelines, Infrastructure as Code', 'Week 1-2: Linux & Shell Scripting, Week 3-4: Docker & Containerization, Week 5-6: Kubernetes Orchestration, Week 7-8: Cloud Platforms (AWS), Week 9-10: CI/CD Pipelines, Week 11-12: Monitoring & Security', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=500', false, true)
  `);

  console.log("🔗 Creating program-technology mappings...");

  // Get program and technology IDs for mapping
  const programs = await client.query(
    "SELECT id, slug FROM internship_programs"
  );
  const technologies = await client.query("SELECT id, name FROM technologies");

  // Create mappings (this is a simplified version - you might want to make it more sophisticated)
  const programTechMappings = [
    {
      slug: "full-stack-mern-development",
      techs: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript"],
    },
    {
      slug: "react-frontend-mastery",
      techs: ["React", "JavaScript", "HTML5", "CSS3"],
    },
    {
      slug: "python-django-backend",
      techs: ["Python", "Django", "PostgreSQL"],
    },
    {
      slug: "nodejs-backend-development",
      techs: ["Node.js", "Express.js", "JavaScript", "MongoDB"],
    },
    { slug: "flutter-mobile-app-development", techs: ["Flutter", "Dart"] },
    { slug: "data-science-with-python", techs: ["Python"] },
    { slug: "devops-cloud-computing", techs: ["Docker", "AWS", "Git"] },
  ];

  for (const mapping of programTechMappings) {
    const program = programs.rows.find((p) => p.slug === mapping.slug);
    if (program) {
      for (let i = 0; i < mapping.techs.length; i++) {
        const tech = technologies.rows.find((t) => t.name === mapping.techs[i]);
        if (tech) {
          await client.query(
            `
            INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level)
            VALUES ($1, $2, $3, $4)
          `,
            [
              program.id,
              tech.id,
              i === 0,
              i === 0 ? "advanced" : "intermediate",
            ]
          );
        }
      }
    }
  }

  console.log("🤝 Creating referral system data...");

  // Get user IDs for referral system
  const students = await client.query(
    "SELECT id, email FROM users WHERE role = 'student' LIMIT 5"
  );

  // Create referral codes
  for (let i = 0; i < 5; i++) {
    const referrer = students.rows[i];
    const referralCode = generateReferralCode();
    const status = i < 2 ? "completed" : "pending";

    await client.query(
      `
      INSERT INTO referrals (referrer_id, referred_email, referral_code, status, discount_amount, used_at, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        referrer.id,
        `referred${i + 1}@example.com`,
        referralCode,
        status,
        499.0,
        status === "completed" ? new Date() : null,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      ]
    );
  }

  console.log("💰 Creating affiliate program data...");

  // Create affiliate accounts
  const affiliateUsers = await client.query(
    "SELECT id FROM users WHERE role = 'affiliate'"
  );
  const someStudents = await client.query(
    "SELECT id FROM users WHERE role = 'student' LIMIT 3"
  );

  for (let i = 0; i < 5; i++) {
    const userId =
      i < affiliateUsers.rows.length
        ? affiliateUsers.rows[i].id
        : someStudents.rows[i % someStudents.rows.length].id;
    const affiliateCode = generateAffiliateCode();

    await client.query(
      `
      INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_referrals, successful_referrals, total_earnings, pending_earnings, paid_earnings, conversion_rate, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        userId,
        affiliateCode,
        25.0,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5000) + 1000,
        Math.floor(Math.random() * 2000) + 500,
        Math.floor(Math.random() * 3000) + 500,
        Math.floor(Math.random() * 50) + 10,
        "active",
      ]
    );
  }

  console.log("📚 Creating student enrollments and orders...");

  // Create student enrollments and orders
  const allStudents = await client.query(
    "SELECT id FROM users WHERE role = 'student'"
  );
  const allPrograms = await client.query(
    "SELECT id, final_price FROM internship_programs"
  );

  for (let i = 0; i < Math.min(8, allStudents.rows.length); i++) {
    const student = allStudents.rows[i];
    const program = allPrograms.rows[i % allPrograms.rows.length];
    const orderNumber = generateOrderNumber();

    // Create order
    const orderResult = await client.query(
      `
      INSERT INTO orders (student_id, program_id, order_number, amount, discount_amount, final_amount, status, payment_method, payment_gateway)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
      [
        student.id,
        program.id,
        orderNumber,
        program.final_price,
        0,
        program.final_price,
        "paid",
        "razorpay",
        "razorpay",
      ]
    );

    // Create payment
    await client.query(
      `
      INSERT INTO payments (order_id, amount, payment_method, payment_gateway, gateway_transaction_id, status, processed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        orderResult.rows[0].id,
        program.final_price,
        "razorpay",
        "razorpay",
        "txn_" + crypto.randomBytes(8).toString("hex"),
        "success",
        new Date(),
      ]
    );

    // Create enrollment
    await client.query(
      `
      INSERT INTO student_internship (student_id, program_id, status, progress_percentage, assessment_completed, assessment_score, assessment_passed, tasks_assigned, tasks_completed, tasks_passed, average_task_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        student.id,
        program.id,
        i < 3 ? "completed" : "in_progress",
        Math.floor(Math.random() * 100),
        true,
        75 + Math.floor(Math.random() * 25),
        true,
        5,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 4) + 1,
        80 + Math.floor(Math.random() * 20),
      ]
    );
  }

  console.log("📊 Creating assessment system data...");

  // Create assessment questions for each program
  const questionTemplates = [
    {
      text: "What is the primary purpose of {technology}?",
      type: "multiple_choice",
      difficulty: "easy",
      points: 1,
    },
    {
      text: "Which of the following best describes {technology} architecture?",
      type: "multiple_choice",
      difficulty: "medium",
      points: 2,
    },
    {
      text: "How do you implement authentication in {technology}?",
      type: "multiple_choice",
      difficulty: "hard",
      points: 3,
    },
    {
      text: "What are the key features of {technology}?",
      type: "multiple_choice",
      difficulty: "easy",
      points: 1,
    },
    {
      text: "Explain the lifecycle methods in {technology}",
      type: "short_answer",
      difficulty: "medium",
      points: 2,
    },
  ];

  for (const program of allPrograms.rows) {
    for (let i = 0; i < 5; i++) {
      const template = questionTemplates[i];
      await client.query(
        `
        INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, explanation, points, difficulty_level, topic, order_index, time_limit_seconds, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
        [
          program.id,
          template.text.replace("{technology}", "React"),
          template.type,
          template.type === "multiple_choice"
            ? JSON.stringify({
                A: "Option A - Correct answer",
                B: "Option B - Incorrect",
                C: "Option C - Incorrect",
                D: "Option D - Incorrect",
              })
            : null,
          "A",
          "This is the correct answer explanation",
          template.points,
          template.difficulty,
          "Fundamentals",
          i + 1,
          60,
          true,
        ]
      );
    }
  }

  // Create assessment attempts
  const enrollments = await client.query(
    "SELECT id, student_id, program_id FROM student_internship LIMIT 5"
  );

  for (const enrollment of enrollments.rows) {
    const attemptResult = await client.query(
      `
      INSERT INTO assessment_attempts (student_id, program_id, attempt_number, total_questions, answered_questions, correct_answers, score_percentage, max_possible_points, points_earned, time_taken_seconds, status, pass_status, completed_at, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `,
      [
        enrollment.student_id,
        enrollment.program_id,
        1,
        5,
        5,
        4,
        80.0,
        10,
        8,
        1800,
        "completed",
        "passed",
        new Date(),
        new Date(),
      ]
    );

    // Create assessment answers
    const questions = await client.query(
      "SELECT id FROM assessment_questions WHERE program_id = $1 LIMIT 5",
      [enrollment.program_id]
    );
    for (let i = 0; i < questions.rows.length; i++) {
      await client.query(
        `
        INSERT INTO assessment_answers (attempt_id, question_id, student_answer, is_correct, points_earned, time_taken_seconds, answer_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          attemptResult.rows[0].id,
          questions.rows[i].id,
          i < 4 ? "A" : "B", // 4 correct, 1 incorrect
          i < 4,
          i < 4 ? 2 : 0,
          Math.floor(Math.random() * 60) + 30,
          i + 1,
        ]
      );
    }
  }

  console.log("📝 Creating task submission system data...");

  // Create tasks for each program
  const taskTemplates = [
    {
      title: "Build a Simple Calculator",
      type: "assignment",
      difficulty: "easy",
      max_points: 100,
    },
    {
      title: "Create a Todo Application",
      type: "project",
      difficulty: "medium",
      max_points: 150,
    },
    {
      title: "Implement User Authentication",
      type: "assignment",
      difficulty: "hard",
      max_points: 200,
    },
    {
      title: "Design Database Schema",
      type: "assignment",
      difficulty: "medium",
      max_points: 120,
    },
    {
      title: "Final Project Presentation",
      type: "presentation",
      difficulty: "hard",
      max_points: 250,
    },
  ];

  for (const program of allPrograms.rows) {
    for (let i = 0; i < 2; i++) {
      // 2 tasks per program
      const template = taskTemplates[i];
      await client.query(
        `
        INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, passing_points, instructions, requirements, estimated_hours, is_mandatory, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
        [
          program.id,
          template.title,
          `Detailed description for ${template.title}. This task will help you understand key concepts and apply them practically.`,
          template.type,
          template.difficulty,
          template.max_points,
          Math.floor(template.max_points * 0.7),
          `Step-by-step instructions for completing ${template.title}`,
          `Requirements: 1. Code quality, 2. Documentation, 3. Best practices`,
          Math.floor(Math.random() * 20) + 10,
          true,
          i + 1,
          true,
        ]
      );
    }
  }

  // Create task submissions
  const tasks = await client.query(
    "SELECT id, program_id, max_points FROM tasks LIMIT 8"
  );
  const submissionStatuses = [
    "submitted",
    "under_review",
    "approved",
    "needs_revision",
  ];

  for (let i = 0; i < tasks.rows.length; i++) {
    const task = tasks.rows[i];
    const student = allStudents.rows[i % allStudents.rows.length];
    const status = submissionStatuses[i % submissionStatuses.length];

    await client.query(
      `
      INSERT INTO task_submissions (task_id, student_id, submission_title, submission_text, github_url, live_demo_url, technologies_used, challenges_faced, learning_outcomes, time_spent_hours, status, points_earned, feedback, final_grade)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `,
      [
        task.id,
        student.id,
        `My Solution for ${task.id}`,
        "This is my submission for the assigned task. I have implemented all required features and followed best practices.",
        `https://github.com/student${i + 1}/task-${task.id}`,
        `https://student${i + 1}-task-${task.id}.netlify.app`,
        "React, JavaScript, CSS3, HTML5",
        "The main challenge was implementing responsive design and state management.",
        "I learned about component lifecycle, state management, and modern JavaScript features.",
        Math.floor(Math.random() * 30) + 10,
        status,
        status === "approved" ? Math.floor(task.max_points * 0.9) : null,
        status === "approved"
          ? "Excellent work! Well implemented solution."
          : status === "needs_revision"
          ? "Good effort, but needs improvement in error handling."
          : null,
        status === "approved" ? "A" : null,
      ]
    );
  }

  console.log("🏆 Creating certificates...");

  // Create certificates for completed enrollments
  const completedEnrollments = await client.query(`
    SELECT si.id, si.student_id, si.program_id, si.assessment_score, si.average_task_score
    FROM student_internship si 
    WHERE si.status = 'completed' 
    LIMIT 3
  `);

  for (const enrollment of completedEnrollments.rows) {
    const certificateNumber =
      "CERT" + Date.now() + Math.floor(Math.random() * 1000);
    const verificationCode = crypto
      .randomBytes(16)
      .toString("hex")
      .toUpperCase();

    await client.query(
      `
      INSERT INTO certificates (student_id, program_id, enrollment_id, certificate_number, certificate_url, certificate_type, assessment_score, project_score, final_grade, verification_code, template_used)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        enrollment.student_id,
        enrollment.program_id,
        enrollment.id,
        certificateNumber,
        `https://certificates.lucro.com/${certificateNumber}.pdf`,
        "completion",
        enrollment.assessment_score,
        enrollment.average_task_score,
        "A",
        verificationCode,
        "completion_template_v1",
      ]
    );
  }

  console.log(
    "✅ Comprehensive dummy data with all 4 features created successfully!"
  );
}

async function runVerificationQueries(client) {
  const verificationQueries = [
    { name: "Users", query: "SELECT COUNT(*) as count FROM users" },
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
      query: "SELECT COUNT(*) as count FROM student_internship",
    },
    { name: "Orders", query: "SELECT COUNT(*) as count FROM orders" },
    { name: "Payments", query: "SELECT COUNT(*) as count FROM payments" },
    { name: "Referrals", query: "SELECT COUNT(*) as count FROM referrals" },
    { name: "Affiliates", query: "SELECT COUNT(*) as count FROM affiliates" },
    {
      name: "Assessment Questions",
      query: "SELECT COUNT(*) as count FROM assessment_questions",
    },
    {
      name: "Assessment Attempts",
      query: "SELECT COUNT(*) as count FROM assessment_attempts",
    },
    {
      name: "Assessment Answers",
      query: "SELECT COUNT(*) as count FROM assessment_answers",
    },
    { name: "Tasks", query: "SELECT COUNT(*) as count FROM tasks" },
    {
      name: "Task Submissions",
      query: "SELECT COUNT(*) as count FROM task_submissions",
    },
    {
      name: "Certificates",
      query: "SELECT COUNT(*) as count FROM certificates",
    },
  ];

  console.log("\n📊 Database Verification Results:");
  console.log("-".repeat(50));

  for (const { name, query } of verificationQueries) {
    try {
      const result = await client.query(query);
      const count = result.rows[0].count;
      console.log(
        `   ${name.padEnd(20)}: ${count.toString().padStart(3)} records`
      );
    } catch (error) {
      console.log(`   ${name.padEnd(20)}: ERROR - ${error.message}`);
    }
  }

  // Feature-specific verification
  console.log("\n🎯 Feature Verification:");
  console.log("-".repeat(50));

  // Referral system verification
  const referralStats = await client.query(`
    SELECT 
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
      SUM(CASE WHEN status = 'completed' THEN discount_amount ELSE 0 END) as total_discounts
    FROM referrals
  `);
  console.log(`   🤝 Referral System:`);
  console.log(
    `      Total Referrals: ${referralStats.rows[0].total_referrals}`
  );
  console.log(`      Completed: ${referralStats.rows[0].completed_referrals}`);
  console.log(
    `      Total Discounts: ₹${referralStats.rows[0].total_discounts}`
  );

  // Affiliate system verification
  const affiliateStats = await client.query(`
    SELECT 
      COUNT(*) as total_affiliates,
      SUM(total_earnings) as total_earnings,
      AVG(conversion_rate) as avg_conversion_rate
    FROM affiliates
  `);
  console.log(`   💰 Affiliate Program:`);
  console.log(
    `      Total Affiliates: ${affiliateStats.rows[0].total_affiliates}`
  );
  console.log(
    `      Total Earnings: ₹${Math.round(
      affiliateStats.rows[0].total_earnings || 0
    )}`
  );
  console.log(
    `      Avg Conversion: ${Math.round(
      affiliateStats.rows[0].avg_conversion_rate || 0
    )}%`
  );

  // Assessment system verification
  const assessmentStats = await client.query(`
    SELECT 
      COUNT(DISTINCT aa.id) as total_attempts,
      COUNT(CASE WHEN aa.pass_status = 'passed' THEN 1 END) as passed_attempts,
      AVG(aa.score_percentage) as avg_score
    FROM assessment_attempts aa
  `);
  console.log(`   📊 Assessment System:`);
  console.log(
    `      Total Attempts: ${assessmentStats.rows[0].total_attempts}`
  );
  console.log(`      Passed: ${assessmentStats.rows[0].passed_attempts}`);
  console.log(
    `      Avg Score: ${Math.round(assessmentStats.rows[0].avg_score || 0)}%`
  );

  // Task submission verification
  const taskStats = await client.query(`
    SELECT 
      COUNT(*) as total_submissions,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_submissions,
      AVG(points_earned) as avg_points
    FROM task_submissions
  `);
  console.log(`   📝 Task Submissions:`);
  console.log(
    `      Total Submissions: ${taskStats.rows[0].total_submissions}`
  );
  console.log(`      Approved: ${taskStats.rows[0].approved_submissions}`);
  console.log(
    `      Avg Points: ${Math.round(taskStats.rows[0].avg_points || 0)}`
  );

  console.log("-".repeat(50));
}

// Run the fresh database setup
setupFreshDatabase();
