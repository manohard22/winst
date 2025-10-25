-- 🎯 WINST INTERNSHIP PORTAL - COMPREHENSIVE DUMMY DATA
-- 📝 Includes Multiple Choice Questions | 🔗 GitHub Submissions | 🏆 Certificates | 🔗 LinkedIn Sharing

-- Clear existing data (in dependency order)
TRUNCATE TABLE 
    certificate_shares,
    quiz_submissions,
    project_submissions,
    task_submissions,
    certificates,
    quiz_questions,
    tasks,
    enrollments,
    referrals,
    payments,
    orders,
    program_technologies,
    programs,
    technologies,
    users
RESTART IDENTITY CASCADE;

-- =============================================================================
-- 👥 DUMMY USERS (Students & Admins)
-- =============================================================================

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, linkedin_profile, github_profile, is_active, email_verified) VALUES
-- Admin Users
('550e8400-e29b-41d4-a716-446655440000', 'admin@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Admin', 'User', '+91-9876543210', 'admin', 'https://linkedin.com/in/admin-winst', 'https://github.com/admin-winst', true, true),
('550e8400-e29b-41d4-a716-446655440001', 'mentor@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Sarah', 'Johnson', '+91-9876543211', 'admin', 'https://linkedin.com/in/sarah-johnson', 'https://github.com/sarah-mentor', true, true),

-- Student Users
('550e8400-e29b-41d4-a716-446655440010', 'rahul.sharma@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Rahul', 'Sharma', '+91-9876543220', 'student', 'https://linkedin.com/in/rahul-sharma-dev', 'https://github.com/rahul-sharma', true, true),
('550e8400-e29b-41d4-a716-446655440011', 'priya.patel@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Priya', 'Patel', '+91-9876543221', 'student', 'https://linkedin.com/in/priya-patel', 'https://github.com/priya-codes', true, true),
('550e8400-e29b-41d4-a716-446655440012', 'amit.kumar@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Amit', 'Kumar', '+91-9876543222', 'student', 'https://linkedin.com/in/amit-kumar-fullstack', 'https://github.com/amit-fullstack', true, true),
('550e8400-e29b-41d4-a716-446655440013', 'sneha.singh@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Sneha', 'Singh', '+91-9876543223', 'student', 'https://linkedin.com/in/sneha-singh', 'https://github.com/sneha-dev', true, true),
('550e8400-e29b-41d4-a716-446655440014', 'vikash.gupta@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Vikash', 'Gupta', '+91-9876543224', 'student', 'https://linkedin.com/in/vikash-gupta', 'https://github.com/vikash-codes', true, true),
('550e8400-e29b-41d4-a716-446655440015', 'anita.mehta@gmail.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Anita', 'Mehta', '+91-9876543225', 'student', 'https://linkedin.com/in/anita-mehta', 'https://github.com/anita-webdev', true, true);

-- =============================================================================
-- 💻 TECHNOLOGIES
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
-- 📚 INTERNSHIP PROGRAMS
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

-- =============================================================================
-- 🔗 PROGRAM TECHNOLOGIES MAPPING
-- =============================================================================

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

-- =============================================================================
-- 🤝 REFERRAL SYSTEM DATA
-- =============================================================================

INSERT INTO referrals (id, referrer_id, referred_email, referred_user_id, referral_code, discount_amount, status, expires_at, used_at) VALUES
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'priya.patel@gmail.com', '550e8400-e29b-41d4-a716-446655440011', 'REF12A4B5C', 499.00, 'completed', '2025-11-13 23:59:59', '2025-09-20 14:30:00'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'amit.kumar@gmail.com', '550e8400-e29b-41d4-a716-446655440012', 'REF98F7G6H', 499.00, 'completed', '2025-11-15 23:59:59', '2025-09-25 10:15:00'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'sneha.singh@gmail.com', '550e8400-e29b-41d4-a716-446655440013', 'REF45X2Y8Z', 499.00, 'completed', '2025-11-20 23:59:59', '2025-10-01 16:45:00'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'friend@example.com', null, 'REF33M9N7P', 499.00, 'pending', '2025-11-25 23:59:59', null),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', 'colleague@example.com', null, 'REF77K5L3Q', 499.00, 'pending', '2025-12-01 23:59:59', null);

-- =============================================================================
-- 💰 ORDERS & PAYMENTS
-- =============================================================================

INSERT INTO orders (id, user_id, program_id, order_number, base_amount, discount_amount, final_amount, referral_code, discount_type, status) VALUES
('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440000', 'ORD-2025-001', 2000.00, 0.00, 2000.00, null, null, 'paid'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', 'ORD-2025-002', 2000.00, 499.00, 1501.00, 'REF12A4B5C', 'referral', 'paid'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440000', 'ORD-2025-003', 2000.00, 499.00, 1501.00, 'REF98F7G6H', 'referral', 'paid'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440002', 'ORD-2025-004', 2000.00, 499.00, 1501.00, 'REF45X2Y8Z', 'referral', 'paid'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', 'ORD-2025-005', 2000.00, 0.00, 2000.00, null, null, 'paid'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', 'ORD-2025-006', 2000.00, 0.00, 2000.00, null, null, 'paid');

INSERT INTO payments (id, order_id, payment_id, payment_method, amount, currency, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 'pay_razorpay_001', 'razorpay', 2000.00, 'INR', 'completed'),
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'pay_razorpay_002', 'razorpay', 1501.00, 'INR', 'completed'),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'pay_razorpay_003', 'razorpay', 1501.00, 'INR', 'completed'),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'pay_razorpay_004', 'razorpay', 1501.00, 'INR', 'completed'),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440004', 'pay_razorpay_005', 'razorpay', 2000.00, 'INR', 'completed'),
('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440005', 'pay_razorpay_006', 'razorpay', 2000.00, 'INR', 'completed');

-- =============================================================================
-- 📚 ENROLLMENTS
-- =============================================================================

INSERT INTO enrollments (id, user_id, program_id, order_id, status, progress_percentage, start_date, expected_completion_date, actual_completion_date, certificate_issued) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 'completed', 100.00, '2025-08-01', '2025-11-01', '2025-10-25', true),
('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'active', 75.00, '2025-09-01', '2025-11-10', null, false),
('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440002', 'active', 60.00, '2025-09-15', '2025-12-15', null, false),
('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', 'active', 45.00, '2025-10-01', '2025-12-30', null, false),
('bb0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', 'active', 30.00, '2025-10-05', '2025-12-05', null, false),
('bb0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440005', 'active', 20.00, '2025-10-10', '2025-12-20', null, false);

-- =============================================================================
-- 📝 TASKS (Quiz, Project, Assignment Types)
-- =============================================================================

INSERT INTO tasks (id, program_id, title, description, task_type, instructions, max_score, passing_score, due_date, is_mandatory, order_sequence, github_required) VALUES

-- Full Stack Web Development Tasks
('cc0e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 'JavaScript Fundamentals Quiz', 'Test your knowledge of JavaScript basics, ES6+ features, and modern JavaScript concepts.', 'quiz', 'Answer all questions carefully. You need 60% to pass.', 100, 60, '2025-11-15 23:59:59', true, 1, false),

('cc0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440000', 'React Todo App Project', 'Build a fully functional todo application using React with CRUD operations, local storage, and responsive design.', 'project', 'Create a React todo app with add, edit, delete, and mark complete functionality. Use modern React hooks and implement responsive design. Deploy on GitHub Pages or Netlify.', 100, 70, '2025-12-01 23:59:59', true, 2, true),

('cc0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440000', 'Backend API Development', 'Create a RESTful API using Node.js and Express with authentication and database integration.', 'project', 'Build a complete backend API with user authentication, CRUD operations, and database integration. Include proper error handling and API documentation.', 100, 75, '2025-12-15 23:59:59', true, 3, true),

-- Python Backend Development Tasks
('cc0e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440001', 'Python Basics Assessment', 'Comprehensive quiz covering Python syntax, data structures, and OOP concepts.', 'quiz', 'Complete all questions within the time limit. Focus on practical Python applications.', 100, 65, '2025-11-20 23:59:59', true, 1, false),

('cc0e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', 'Django Blog Application', 'Create a complete blog application with user authentication, post creation, and commenting system.', 'project', 'Build a Django blog with user registration, login, create/edit/delete posts, commenting system, and admin panel. Implement proper URL routing and templates.', 100, 75, '2025-12-10 23:59:59', true, 2, true),

-- Java Enterprise Development Tasks
('cc0e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440002', 'Java & Spring Boot Quiz', 'Test your understanding of Java fundamentals and Spring Boot concepts.', 'quiz', 'Answer questions about Java OOP, Spring Boot annotations, dependency injection, and enterprise patterns.', 100, 70, '2025-11-25 23:59:59', true, 1, false),

('cc0e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440002', 'E-commerce Microservice', 'Develop a microservice for an e-commerce platform using Spring Boot with proper architecture.', 'project', 'Create a microservice handling product catalog, inventory management, and order processing. Implement proper REST APIs, database integration, and error handling.', 100, 80, '2025-12-30 23:59:59', true, 2, true),

-- React Frontend Mastery Tasks
('cc0e8400-e29b-41d4-a716-446655440030', '770e8400-e29b-41d4-a716-446655440003', 'Advanced React Concepts Quiz', 'Deep dive into React hooks, context API, performance optimization, and modern patterns.', 'quiz', 'Test your knowledge of advanced React concepts, hooks, state management, and performance optimization techniques.', 100, 75, '2025-11-30 23:59:59', true, 1, false),

('cc0e8400-e29b-41d4-a716-446655440031', '770e8400-e29b-41d4-a716-446655440003', 'React Dashboard Application', 'Build a comprehensive admin dashboard with charts, tables, and real-time updates using React.', 'project', 'Create a responsive admin dashboard with data visualization, user management, real-time updates, and modern UI components. Use React hooks, context API, and state management.', 100, 85, '2025-12-20 23:59:59', true, 2, true);

-- =============================================================================
-- 🧠 QUIZ QUESTIONS (Multiple Choice)
-- =============================================================================

-- JavaScript Fundamentals Quiz Questions
INSERT INTO quiz_questions (id, task_id, question_text, question_type, options, correct_answers, explanation, points, order_sequence) VALUES

('dd0e8400-e29b-41d4-a716-446655440000', 'cc0e8400-e29b-41d4-a716-446655440000', 'Which of the following are valid ways to declare variables in JavaScript?', 'multiple_choice', 
'["var name = ''John''", "let age = 25", "const PI = 3.14", "variable count = 10"]', '[0, 1, 2]', 
'var, let, and const are valid variable declaration keywords in JavaScript. "variable" is not a valid keyword.', 10, 1),

('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440000', 'What does the "=== operator" do in JavaScript?', 'single_choice',
'["Assigns a value", "Checks for equality with type conversion", "Checks for strict equality without type conversion", "Compares object references"]', '[2]',
'The === operator checks for strict equality, comparing both value and type without any type conversion.', 10, 2),

('dd0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440000', 'Which ES6+ features improve JavaScript code readability?', 'multiple_choice',
'["Arrow functions", "Template literals", "Destructuring", "All of the above"]', '[0, 1, 2, 3]',
'All these ES6+ features (arrow functions, template literals, and destructuring) significantly improve code readability and maintainability.', 15, 3),

('dd0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440000', 'JavaScript is a compiled language.', 'true_false',
'["True", "False"]', '[1]',
'JavaScript is an interpreted language, not compiled. It is executed by JavaScript engines at runtime.', 10, 4),

-- Python Basics Assessment Questions
('dd0e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440010', 'Which of the following are Python built-in data types?', 'multiple_choice',
'["list", "tuple", "dictionary", "array"]', '[0, 1, 2]',
'list, tuple, and dictionary are built-in Python data types. "array" is available through the array module or NumPy, but not built-in.', 10, 1),

('dd0e8400-e29b-41d4-a716-446655440011', 'cc0e8400-e29b-41d4-a716-446655440010', 'What is the correct way to define a class in Python?', 'single_choice',
'["class MyClass:", "Class MyClass()", "define MyClass:", "create MyClass:"]', '[0]',
'The correct syntax to define a class in Python is "class ClassName:" followed by the class body.', 10, 2),

('dd0e8400-e29b-41d4-a716-446655440012', 'cc0e8400-e29b-41d4-a716-446655440010', 'Python supports multiple inheritance.', 'true_false',
'["True", "False"]', '[0]',
'Python does support multiple inheritance, allowing a class to inherit from multiple parent classes.', 10, 3),

-- Java & Spring Boot Quiz Questions
('dd0e8400-e29b-41d4-a716-446655440020', 'cc0e8400-e29b-41d4-a716-446655440020', 'Which Spring Boot annotations are used for REST controllers?', 'multiple_choice',
'["@RestController", "@Controller", "@RequestMapping", "@Component"]', '[0, 2]',
'@RestController and @RequestMapping are commonly used for REST controllers. @RestController combines @Controller and @ResponseBody.', 15, 1),

('dd0e8400-e29b-41d4-a716-446655440021', 'cc0e8400-e29b-41d4-a716-446655440020', 'What is dependency injection in Spring?', 'single_choice',
'["A design pattern for managing object dependencies", "A way to inject SQL queries", "A method to create databases", "A technique for error handling"]', '[0]',
'Dependency injection is a design pattern where dependencies are provided to an object rather than the object creating them itself.', 15, 2),

-- Advanced React Concepts Quiz Questions
('dd0e8400-e29b-41d4-a716-446655440030', 'cc0e8400-e29b-41d4-a716-446655440030', 'Which React hooks are used for state management?', 'multiple_choice',
'["useState", "useEffect", "useContext", "useReducer"]', '[0, 2, 3]',
'useState, useContext, and useReducer are primarily used for state management. useEffect is for side effects.', 15, 1),

('dd0e8400-e29b-41d4-a716-446655440031', 'cc0e8400-e29b-41d4-a716-446655440030', 'What is the purpose of React.memo()?', 'single_choice',
'["To memorize function results", "To prevent unnecessary re-renders", "To create memoized components", "To optimize memory usage"]', '[1]',
'React.memo() is a higher-order component that prevents unnecessary re-renders by memoizing the component result.', 15, 2);

-- =============================================================================
-- 📝 QUIZ SUBMISSIONS (Student Answers)
-- =============================================================================

INSERT INTO quiz_submissions (user_id, task_id, question_id, selected_answers, is_correct, points_earned) VALUES
-- Rahul's JavaScript quiz submissions
('550e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440000', 'dd0e8400-e29b-41d4-a716-446655440000', '[0, 1, 2]', true, 10),
('550e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440000', 'dd0e8400-e29b-41d4-a716-446655440001', '[2]', true, 10),
('550e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440000', 'dd0e8400-e29b-41d4-a716-446655440002', '[0, 1, 2, 3]', true, 15),
('550e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440000', 'dd0e8400-e29b-41d4-a716-446655440003', '[1]', true, 10),

-- Priya's Python quiz submissions
('550e8400-e29b-41d4-a716-446655440011', 'cc0e8400-e29b-41d4-a716-446655440010', 'dd0e8400-e29b-41d4-a716-446655440010', '[0, 1, 2]', true, 10),
('550e8400-e29b-41d4-a716-446655440011', 'cc0e8400-e29b-41d4-a716-446655440010', 'dd0e8400-e29b-41d4-a716-446655440011', '[0]', true, 10),
('550e8400-e29b-41d4-a716-446655440011', 'cc0e8400-e29b-41d4-a716-446655440010', 'dd0e8400-e29b-41d4-a716-446655440012', '[0]', true, 10);

-- =============================================================================
-- 🔗 PROJECT SUBMISSIONS (GitHub URLs)
-- =============================================================================

INSERT INTO project_submissions (id, user_id, task_id, enrollment_id, github_url, live_demo_url, project_title, project_description, technologies_used, submission_notes, status, score, feedback, reviewer_id, submitted_at, reviewed_at) VALUES

('ee0e8400-e29b-41d4-a716-446655440000', 
'550e8400-e29b-41d4-a716-446655440010', 
'cc0e8400-e29b-41d4-a716-446655440001', 
'bb0e8400-e29b-41d4-a716-446655440000',
'https://github.com/rahul-sharma/react-todo-app',
'https://rahul-todo-app.netlify.app',
'React Todo Application',
'A fully functional todo application built with React featuring CRUD operations, local storage persistence, and responsive design. Includes task filtering, completion tracking, and clean UI.',
'["React", "JavaScript", "CSS3", "HTML5", "Local Storage"]',
'Implemented all required features with additional enhancements like task categories and dark mode toggle.',
'approved', 92, 'Excellent work! Clean code structure, good use of React hooks, and great UI/UX. The additional features show initiative.', '550e8400-e29b-41d4-a716-446655440001', '2025-10-20 15:30:00', '2025-10-22 10:15:00'),

('ee0e8400-e29b-41d4-a716-446655440001',
'550e8400-e29b-41d4-a716-446655440010',
'cc0e8400-e29b-41d4-a716-446655440002',
'bb0e8400-e29b-41d4-a716-446655440000',
'https://github.com/rahul-sharma/node-express-api',
'https://rahul-api.herokuapp.com',
'Task Management API',
'RESTful API built with Node.js and Express featuring JWT authentication, CRUD operations for tasks, user management, and PostgreSQL integration.',
'["Node.js", "Express.js", "PostgreSQL", "JWT", "bcrypt"]',
'Complete API with proper error handling, validation, and comprehensive documentation using Swagger.',
'approved', 88, 'Good API design and implementation. Well-structured code with proper error handling. Documentation is comprehensive.', '550e8400-e29b-41d4-a716-446655440001', '2025-10-25 14:20:00', '2025-10-26 09:30:00'),

('ee0e8400-e29b-41d4-a716-446655440002',
'550e8400-e29b-41d4-a716-446655440011',
'cc0e8400-e29b-41d4-a716-446655440011',
'bb0e8400-e29b-41d4-a716-446655440001',
'https://github.com/priya-codes/django-blog',
'https://priya-blog.herokuapp.com',
'Django Blog Application',
'Complete blog application with user authentication, post creation/editing, commenting system, categories, and responsive design.',
'["Python", "Django", "PostgreSQL", "Bootstrap", "HTML/CSS"]',
'Implemented additional features like post categories, search functionality, and user profiles.',
'approved', 85, 'Well-structured Django application with good use of class-based views. Clean UI and additional features are appreciated.', '550e8400-e29b-41d4-a716-446655440001', '2025-10-15 16:45:00', '2025-10-17 11:20:00'),

('ee0e8400-e29b-41d4-a716-446655440003',
'550e8400-e29b-41d4-a716-446655440012',
'cc0e8400-e29b-41d4-a716-446655440001',
'bb0e8400-e29b-41d4-a716-446655440002',
'https://github.com/amit-fullstack/react-todo-deluxe',
'https://amit-todo-deluxe.vercel.app',
'Advanced Todo Manager',
'Enhanced todo application with drag-and-drop functionality, multiple project support, team collaboration features, and real-time updates.',
'["React", "TypeScript", "Tailwind CSS", "Socket.io", "Node.js"]',
'Went beyond basic requirements to create a comprehensive task management solution with team features.',
'approved', 95, 'Outstanding project! Exceeded expectations with advanced features. Excellent code quality and innovative approach to the assignment.', '550e8400-e29b-41d4-a716-446655440001', '2025-10-18 13:15:00', '2025-10-20 08:45:00'),

('ee0e8400-e29b-41d4-a716-446655440004',
'550e8400-e29b-41d4-a716-446655440014',
'cc0e8400-e29b-41d4-a716-446655440031',
'bb0e8400-e29b-41d4-a716-446655440004',
'https://github.com/vikash-codes/react-admin-dashboard',
'https://vikash-admin-dashboard.netlify.app',
'React Admin Dashboard',
'Comprehensive admin dashboard with data visualization, user management, real-time analytics, and responsive design using modern React patterns.',
'["React", "TypeScript", "Chart.js", "Tailwind CSS", "React Query"]',
'Implemented real-time data updates, interactive charts, and excellent responsive design. Used modern React patterns throughout.',
'under_review', null, null, null, '2025-10-10 12:30:00', null);

-- =============================================================================
-- 🏆 CERTIFICATES
-- =============================================================================

INSERT INTO certificates (id, user_id, program_id, enrollment_id, certificate_number, student_name, program_title, completion_date, issue_date, certificate_url, verification_code, is_valid, template_used, metadata) VALUES

('ff0e8400-e29b-41d4-a716-446655440000',
'550e8400-e29b-41d4-a716-446655440010',
'770e8400-e29b-41d4-a716-446655440000',
'bb0e8400-e29b-41d4-a716-446655440000',
'WINST-CERT-2025-001',
'Rahul Sharma',
'Full Stack Web Development',
'2025-10-25',
'2025-10-26',
'/certificates/WINST-CERT-2025-001.pdf',
'VERIFY-RAHUL-2025-FS001',
true,
'fullstack_template',
'{"final_score": 90, "completion_time": "12 weeks", "specializations": ["React Development", "Node.js APIs", "Database Design"], "mentor": "Sarah Johnson"}');

-- =============================================================================
-- 🔗 CERTIFICATE SHARING DATA
-- =============================================================================

INSERT INTO certificate_shares (id, certificate_id, user_id, platform, shared_at, share_url, metadata) VALUES

('gg0e8400-e29b-41d4-a716-446655440000',
'ff0e8400-e29b-41d4-a716-446655440000',
'550e8400-e29b-41d4-a716-446655440010',
'linkedin',
'2025-10-26 14:30:00',
'https://linkedin.com/in/rahul-sharma-dev/posts/certificate-achievement',
'{"post_id": "linkedin_post_12345", "engagement": {"likes": 45, "comments": 8, "shares": 12}}'),

('gg0e8400-e29b-41d4-a716-446655440001',
'ff0e8400-e29b-41d4-a716-446655440000',
'550e8400-e29b-41d4-a716-446655440010',
'twitter',
'2025-10-26 15:15:00',
'https://twitter.com/rahul_dev/status/tweet_id_67890',
'{"tweet_id": "tweet_67890", "engagement": {"likes": 23, "retweets": 5, "replies": 3}}'),

('gg0e8400-e29b-41d4-a716-446655440002',
'ff0e8400-e29b-41d4-a716-446655440000',
'550e8400-e29b-41d4-a716-446655440010',
'download',
'2025-10-26 16:00:00',
null,
'{"download_count": 3, "download_format": "PDF"}');

-- Data insertion completed successfully
SELECT 'Comprehensive dummy data inserted successfully with all enhanced features!' as status,
       'Includes: Users, Programs, Technologies, Enrollments, Quiz Questions, Project Submissions, Certificates, and LinkedIn Sharing' as features;