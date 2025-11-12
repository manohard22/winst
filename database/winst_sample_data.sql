-- =============================================================================
-- 🎯 WINST INTERNSHIP PORTAL - COMPREHENSIVE DATA POPULATION SCRIPT
-- =============================================================================
-- 📊 Realistic Dummy Data for Complete Testing and Development
-- 🚀 Run this AFTER the schema creation script
-- =============================================================================

BEGIN;

-- =============================================================================
-- 👥 USER DATA POPULATION
-- =============================================================================

-- Insert sample users with bcrypt hashed passwords (password: password123)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, college_name, degree, branch, year_of_study, cgpa, linkedin_url, github_url, is_active, email_verified) VALUES
-- Admin Users
('550e8400-e29b-41d4-a716-446655440000', 'admin@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Admin', 'User', '+91-9999999999', 'admin', 'Winst Institute', 'MBA', 'Management', NULL, 9.5, 'https://linkedin.com/in/admin-winst', 'https://github.com/winst-admin', true, true),
('550e8400-e29b-41d4-a716-446655440001', 'support@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Support', 'Team', '+91-9999999998', 'admin', 'Winst Institute', 'B.Tech', 'Computer Science', NULL, 8.9, 'https://linkedin.com/in/support-winst', 'https://github.com/winst-support', true, true),

-- Student Users
('550e8400-e29b-41d4-a716-446655440010', 'john.doe@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'John', 'Doe', '+91-9876543210', 'student', 'Delhi University', 'B.Tech', 'Computer Science', 3, 8.5, 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe', true, true),
('550e8400-e29b-41d4-a716-446655440011', 'jane.smith@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Jane', 'Smith', '+91-9876543211', 'student', 'Mumbai University', 'B.Tech', 'Information Technology', 2, 9.0, 'https://linkedin.com/in/janesmith', 'https://github.com/janesmith', true, true),
('550e8400-e29b-41d4-a716-446655440012', 'mike.wilson@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Mike', 'Wilson', '+91-9876543212', 'student', 'Bangalore University', 'MCA', 'Computer Applications', 1, 8.2, 'https://linkedin.com/in/mikewilson', 'https://github.com/mikewilson', true, true),
('550e8400-e29b-41d4-a716-446655440013', 'sarah.jones@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Sarah', 'Jones', '+91-9876543213', 'student', 'Chennai University', 'B.Sc', 'Computer Science', 3, 8.8, 'https://linkedin.com/in/sarahjones', 'https://github.com/sarahjones', true, true),
('550e8400-e29b-41d4-a716-446655440014', 'rahul.kumar@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Rahul', 'Kumar', '+91-9876543214', 'student', 'IIT Delhi', 'B.Tech', 'Electrical Engineering', 2, 9.2, 'https://linkedin.com/in/rahulkumar', 'https://github.com/rahulkumar', true, true),
('550e8400-e29b-41d4-a716-446655440015', 'priya.sharma@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Priya', 'Sharma', '+91-9876543215', 'student', 'NIT Warangal', 'B.Tech', 'Computer Science', 4, 8.7, 'https://linkedin.com/in/priyasharma', 'https://github.com/priyasharma', true, true),
('550e8400-e29b-41d4-a716-446655440016', 'amit.patel@gmail.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Amit', 'Patel', '+91-9876543216', 'student', 'VJTI Mumbai', 'B.Tech', 'Information Technology', 3, 8.9, 'https://linkedin.com/in/amitpatel', 'https://github.com/amitpatel', true, true),

-- Mentor Users
('550e8400-e29b-41d4-a716-446655440020', 'mentor1@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Dr. Rajesh', 'Gupta', '+91-9876543220', 'mentor', 'IIT Delhi', 'Ph.D', 'Computer Science', NULL, 9.5, 'https://linkedin.com/in/rajeshgupta', 'https://github.com/rajeshgupta', true, true),
('550e8400-e29b-41d4-a716-446655440021', 'mentor2@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Prof. Sneha', 'Agarwal', '+91-9876543221', 'mentor', 'IIT Bombay', 'M.Tech', 'Software Engineering', NULL, 9.2, 'https://linkedin.com/in/snehaagarwal', 'https://github.com/snehaagarwal', true, true),

-- Affiliate Users
('550e8400-e29b-41d4-a716-446655440030', 'affiliate1@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Marketing', 'Partner', '+91-9876543230', 'affiliate', 'Business School', 'MBA', 'Marketing', NULL, 8.5, 'https://linkedin.com/in/marketingpartner', 'https://github.com/marketingpartner', true, true),
('550e8400-e29b-41d4-a716-446655440031', 'affiliate2@winst.com', '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e', 'Content', 'Creator', '+91-9876543231', 'affiliate', 'Media Studies', 'B.A', 'Mass Communication', NULL, 8.0, 'https://linkedin.com/in/contentcreator', 'https://github.com/contentcreator', true, true);

-- =============================================================================
-- 🛠️ TECHNOLOGY STACK DATA
-- =============================================================================

INSERT INTO technologies (name, category, description, icon_url, is_active, sort_order) VALUES
-- Frontend Technologies
('JavaScript', 'Frontend', 'Programming language for web development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', true, 1),
('React', 'Frontend', 'JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true, 2),
('Vue.js', 'Frontend', 'Progressive JavaScript framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', true, 3),
('Angular', 'Frontend', 'Platform for building mobile and desktop web applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', true, 4),
('TypeScript', 'Frontend', 'Typed superset of JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', true, 5),
('HTML5', 'Frontend', 'Markup language for web pages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', true, 6),
('CSS3', 'Frontend', 'Stylesheet language for web design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', true, 7),
('Tailwind CSS', 'Frontend', 'Utility-first CSS framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', true, 8),

-- Backend Technologies
('Node.js', 'Backend', 'JavaScript runtime for server-side development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true, 10),
('Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', true, 11),
('Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', true, 12),
('Django', 'Backend', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', true, 13),
('Flask', 'Backend', 'Lightweight Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', true, 14),
('Java', 'Backend', 'Object-oriented programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', true, 15),
('Spring Boot', 'Backend', 'Java framework for enterprise applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', true, 16),

-- Database Technologies
('PostgreSQL', 'Database', 'Advanced open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', true, 20),
('MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', true, 21),
('MySQL', 'Database', 'Popular open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', true, 22),
('Redis', 'Database', 'In-memory data structure store', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', true, 23),

-- DevOps and Cloud
('Docker', 'DevOps', 'Platform for containerizing applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', true, 30),
('Kubernetes', 'DevOps', 'Container orchestration platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', true, 31),
('AWS', 'Cloud', 'Amazon Web Services cloud platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', true, 32),
('Google Cloud', 'Cloud', 'Google Cloud Platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg', true, 33),

-- Tools and Others
('Git', 'Tools', 'Distributed version control system', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', true, 40),
('GitHub', 'Tools', 'Git repository hosting service', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true, 41),
('VS Code', 'Tools', 'Source code editor', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', true, 42);

-- =============================================================================
-- 🎓 INTERNSHIP PROGRAMS DATA
-- =============================================================================

INSERT INTO internship_programs (id, title, slug, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, start_date, end_date, registration_deadline, requirements, learning_outcomes, syllabus, image_url, featured, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'Full Stack Web Development with MERN', 'full-stack-mern-development', 'Comprehensive program covering MongoDB, Express.js, React, and Node.js with real-world projects and industry mentorship. Build complete web applications from scratch with modern development practices.', 12, 'intermediate', 2500.00, 20, 2000.00, 30, '2025-01-15', '2025-04-15', '2025-01-10', 'Basic knowledge of HTML, CSS, and JavaScript. Understanding of programming fundamentals. Familiarity with command line interface.', 'Build responsive web applications, RESTful APIs, database integration, authentication systems, deploy to cloud platforms, version control with Git, modern JavaScript ES6+, state management, and testing.', 'Week 1-2: JavaScript Fundamentals & ES6+, Week 3-4: React Basics & Hooks, Week 5-6: Node.js & Express.js, Week 7-8: MongoDB & Database Design, Week 9-10: Full Stack Integration & Authentication, Week 11-12: Deployment & Best Practices', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800', true, true),

('770e8400-e29b-41d4-a716-446655440001', 'Frontend Development with React', 'react-frontend-mastery', 'Deep dive into React ecosystem including hooks, state management, routing, and performance optimization. Build modern, responsive user interfaces with industry best practices.', 8, 'beginner', 1800.00, 15, 1530.00, 25, '2025-02-01', '2025-03-30', '2025-01-25', 'Good understanding of JavaScript ES6+, HTML5, CSS3. Basic programming knowledge required.', 'Advanced React patterns, state management with Redux/Context, performance optimization, testing with Jest, modern frontend tooling, responsive design principles.', 'Week 1-2: React Fundamentals & JSX, Week 3-4: State Management & Hooks, Week 5-6: Routing & Navigation, Week 7-8: Testing & Deployment', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', true, true),

('770e8400-e29b-41d4-a716-446655440002', 'Backend Development with Python Django', 'python-django-backend', 'Learn server-side development with Python, Django framework, and database management. Focus on building scalable backend systems, RESTful APIs, and microservices architecture.', 10, 'intermediate', 2200.00, 10, 1980.00, 20, '2025-02-15', '2025-04-30', '2025-02-10', 'Basic programming knowledge. Understanding of Python basics is helpful but not required. Familiarity with databases.', 'Develop REST APIs, work with relational databases, implement authentication & authorization, testing, deployment of Python applications, Docker containerization.', 'Week 1-2: Python & Django Basics, Week 3-4: Models & Database Design, Week 5-6: Views & Templates, Week 7-8: REST API Development, Week 9-10: Testing & Deployment', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800', false, true),

('770e8400-e29b-41d4-a716-446655440003', 'DevOps and Cloud Computing with AWS', 'devops-cloud-computing', 'Master DevOps practices with Docker, Kubernetes, CI/CD pipelines, and AWS cloud services for modern application deployment and infrastructure management.', 14, 'advanced', 3000.00, 25, 2250.00, 15, '2025-03-01', '2025-06-15', '2025-02-25', 'Experience with Linux, basic understanding of web applications, familiarity with command line, basic networking knowledge.', 'Container orchestration, CI/CD implementation, cloud architecture, monitoring & logging, infrastructure as code, security best practices, cost optimization.', 'Week 1-2: Linux & Docker Fundamentals, Week 3-4: Kubernetes & Container Orchestration, Week 5-6: CI/CD Pipelines, Week 7-8: AWS Fundamentals, Week 9-10: Infrastructure as Code, Week 11-12: Monitoring & Logging, Week 13-14: Capstone Project', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', true, true),

('770e8400-e29b-41d4-a716-446655440004', 'Mobile App Development with React Native', 'react-native-mobile-dev', 'Build cross-platform mobile applications using React Native. Learn native mobile development concepts, API integration, and publish to app stores.', 10, 'intermediate', 2300.00, 15, 1955.00, 20, '2025-03-15', '2025-05-30', '2025-03-10', 'Solid React knowledge, JavaScript ES6+, basic understanding of mobile app concepts, experience with REST APIs.', 'Cross-platform mobile development, native module integration, app store deployment, performance optimization, offline functionality, push notifications.', 'Week 1-2: React Native Fundamentals, Week 3-4: Navigation & State Management, Week 5-6: Native APIs & Device Features, Week 7-8: Testing & Debugging, Week 9-10: App Store Deployment', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', false, true),

('770e8400-e29b-41d4-a716-446655440005', 'Data Science with Python', 'data-science-python', 'Comprehensive data science program covering Python, machine learning, data analysis, and visualization. Work with real datasets and build predictive models.', 16, 'intermediate', 3500.00, 30, 2450.00, 18, '2025-04-01', '2025-07-31', '2025-03-25', 'Basic programming knowledge, mathematics background (statistics helpful), familiarity with Python basics.', 'Data analysis with Pandas, machine learning with scikit-learn, data visualization, statistical analysis, deep learning basics, model deployment.', 'Week 1-2: Python for Data Science, Week 3-4: Data Analysis & Pandas, Week 5-6: Data Visualization, Week 7-8: Statistics & Probability, Week 9-10: Machine Learning Basics, Week 11-12: Advanced ML Algorithms, Week 13-14: Deep Learning Introduction, Week 15-16: Capstone Project', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', true, true);

-- =============================================================================
-- 🔗 PROGRAM-TECHNOLOGY MAPPING
-- =============================================================================

-- Full Stack MERN Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name IN ('React', 'Node.js', 'Express.js', 'MongoDB') THEN true ELSE false END,
  CASE 
    WHEN t.name IN ('React', 'Node.js') THEN 'advanced'
    WHEN t.name IN ('Express.js', 'MongoDB', 'JavaScript') THEN 'intermediate'
    ELSE 'beginner'
  END
FROM internship_programs p, technologies t
WHERE p.slug = 'full-stack-mern-development' 
  AND t.name IN ('React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3', 'Git');

-- React Frontend Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name IN ('React', 'JavaScript') THEN true ELSE false END,
  'advanced'
FROM internship_programs p, technologies t
WHERE p.slug = 'react-frontend-mastery' 
  AND t.name IN ('React', 'JavaScript', 'HTML5', 'CSS3', 'TypeScript', 'Git');

-- Python Django Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name IN ('Python', 'Django') THEN true ELSE false END,
  'advanced'
FROM internship_programs p, technologies t
WHERE p.slug = 'python-django-backend' 
  AND t.name IN ('Python', 'Django', 'PostgreSQL', 'Git');

-- DevOps Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name IN ('Docker', 'Kubernetes', 'AWS') THEN true ELSE false END,
  'advanced'
FROM internship_programs p, technologies t
WHERE p.slug = 'devops-cloud-computing' 
  AND t.name IN ('Docker', 'Kubernetes', 'AWS', 'Git');

-- React Native Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name IN ('React', 'JavaScript') THEN true ELSE false END,
  'advanced'
FROM internship_programs p, technologies t
WHERE p.slug = 'react-native-mobile-dev' 
  AND t.name IN ('React', 'JavaScript', 'TypeScript', 'Git');

-- Data Science Program Technologies
INSERT INTO program_technologies (program_id, technology_id, is_primary, proficiency_level) 
SELECT p.id, t.id, 
  CASE WHEN t.name = 'Python' THEN true ELSE false END,
  'advanced'
FROM internship_programs p, technologies t
WHERE p.slug = 'data-science-python' 
  AND t.name IN ('Python', 'PostgreSQL', 'Git');

-- =============================================================================
-- 📚 STUDENT ENROLLMENTS WITH PROGRESS
-- =============================================================================

INSERT INTO student_internship (id, student_id, program_id, status, progress_percentage, start_date, expected_completion_date, mentor_id) VALUES
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440000', 'in_progress', 65.5, '2025-01-15', '2025-04-15', '550e8400-e29b-41d4-a716-446655440020'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', 'in_progress', 45.0, '2025-02-01', '2025-03-30', '550e8400-e29b-41d4-a716-446655440021'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440002', 'completed', 100.0, '2024-11-15', '2025-01-30', '550e8400-e29b-41d4-a716-446655440020'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440000', 'enrolled', 15.0, '2025-01-15', '2025-04-15', '550e8400-e29b-41d4-a716-446655440020'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', 'in_progress', 25.0, '2025-03-01', '2025-06-15', '550e8400-e29b-41d4-a716-446655440021'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', 'completed', 100.0, '2024-12-01', '2025-01-30', '550e8400-e29b-41d4-a716-446655440021'),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440004', 'enrolled', 5.0, '2025-03-15', '2025-05-30', '550e8400-e29b-41d4-a716-446655440020');

-- =============================================================================
-- 🤝 REFERRAL SYSTEM DATA
-- =============================================================================

INSERT INTO referrals (referrer_id, referred_email, referral_code, status, discount_amount, expires_at, referred_user_id, used_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'friend1@gmail.com', 'JOHN2025REF', 'pending', 499.00, '2025-12-31', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440011', 'jane.smith@gmail.com', 'JANE2025REF', 'completed', 499.00, '2025-12-31', '550e8400-e29b-41d4-a716-446655440011', '2025-01-25 14:20:00'),
('550e8400-e29b-41d4-a716-446655440012', 'friend3@gmail.com', 'MIKE2025REF', 'pending', 499.00, '2025-12-31', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440013', 'sarah.jones@gmail.com', 'SARAH2025REF', 'completed', 499.00, '2025-12-31', '550e8400-e29b-41d4-a716-446655440013', '2025-01-10 10:30:00'),
('550e8400-e29b-41d4-a716-446655440014', 'friend5@gmail.com', 'RAHUL2025REF', 'pending', 499.00, '2025-12-31', NULL, NULL);

-- =============================================================================
-- 💰 AFFILIATE PROGRAM DATA
-- =============================================================================

INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_referrals, successful_referrals, total_earnings, status) VALUES
('550e8400-e29b-41d4-a716-446655440030', 'AFF2025001', 25.00, 8, 5, 2500.00, 'active'),
('550e8400-e29b-41d4-a716-446655440031', 'AFF2025002', 20.00, 12, 7, 3150.00, 'active');

-- =============================================================================
-- 💳 ORDERS AND PAYMENTS DATA
-- =============================================================================

INSERT INTO orders (id, student_id, program_id, order_number, amount, discount_amount, final_amount, status, payment_gateway, gateway_order_id, referral_code, discount_type) VALUES
('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440000', 'ORD-2025-001', 2500.00, 500.00, 2000.00, 'paid', 'razorpay', 'razorpay_order_001', 'SARAH2025REF', 'referral'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', 'ORD-2025-002', 1800.00, 270.00, 1530.00, 'paid', 'razorpay', 'razorpay_order_002', 'JANE2025REF', 'referral'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440002', 'ORD-2025-003', 2200.00, 220.00, 1980.00, 'paid', 'razorpay', 'razorpay_order_003', NULL, NULL),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440000', 'ORD-2025-004', 2500.00, 500.00, 2000.00, 'paid', 'razorpay', 'razorpay_order_004', NULL, NULL),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', 'ORD-2025-005', 3000.00, 750.00, 2250.00, 'paid', 'razorpay', 'razorpay_order_005', NULL, NULL),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', 'ORD-2025-006', 1800.00, 270.00, 1530.00, 'paid', 'razorpay', 'razorpay_order_006', NULL, NULL),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440004', 'ORD-2025-007', 2300.00, 345.00, 1955.00, 'pending', 'razorpay', 'razorpay_order_007', NULL, NULL);

INSERT INTO payments (order_id, amount, payment_method, payment_gateway, gateway_payment_id, gateway_order_id, status, processed_at) VALUES
('990e8400-e29b-41d4-a716-446655440000', 2000.00, 'card', 'razorpay', 'razorpay_payment_001', 'razorpay_order_001', 'success', '2025-01-10 10:30:00'),
('990e8400-e29b-41d4-a716-446655440001', 1530.00, 'upi', 'razorpay', 'razorpay_payment_002', 'razorpay_order_002', 'success', '2025-01-25 14:20:00'),
('990e8400-e29b-41d4-a716-446655440002', 1980.00, 'netbanking', 'razorpay', 'razorpay_payment_003', 'razorpay_order_003', 'success', '2025-02-08 09:15:00'),
('990e8400-e29b-41d4-a716-446655440003', 2000.00, 'card', 'razorpay', 'razorpay_payment_004', 'razorpay_order_004', 'success', '2025-01-12 16:45:00'),
('990e8400-e29b-41d4-a716-446655440004', 2250.00, 'upi', 'razorpay', 'razorpay_payment_005', 'razorpay_order_005', 'success', '2025-03-05 11:20:00'),
('990e8400-e29b-41d4-a716-446655440005', 1530.00, 'card', 'razorpay', 'razorpay_payment_006', 'razorpay_order_006', 'success', '2025-01-30 13:15:00');

-- =============================================================================
-- 📊 ASSESSMENT QUESTIONS DATA
-- =============================================================================

-- Full Stack MERN Assessment Questions
INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index) VALUES
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'What does MERN stack stand for?', 'multiple_choice', '["MongoDB, Express, React, Node.js", "MySQL, Express, React, Node.js", "MongoDB, Express, Redux, Node.js", "MongoDB, Express, React, Next.js"]', 'MongoDB, Express, React, Node.js', 2, 'easy', 1),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'Which HTTP method is used to create a new resource?', 'multiple_choice', '["GET", "POST", "PUT", "DELETE"]', 'POST', 2, 'easy', 2),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'What is JSX in React?', 'multiple_choice', '["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"]', 'JavaScript XML', 3, 'medium', 3),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'Which middleware is commonly used for parsing JSON in Express?', 'multiple_choice', '["body-parser", "express.json()", "json-parser", "Both A and B"]', 'Both A and B', 3, 'medium', 4),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'What is the purpose of useEffect hook in React?', 'multiple_choice', '["State management", "Side effects handling", "Component styling", "Event handling"]', 'Side effects handling', 4, 'hard', 5);

-- React Frontend Assessment Questions
INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index) VALUES
((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'), 'Which hook is used for state management in React?', 'multiple_choice', '["useEffect", "useState", "useContext", "useReducer"]', 'useState', 2, 'easy', 1),
((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'), 'What is the Virtual DOM?', 'multiple_choice', '["A virtual version of the HTML DOM", "A JavaScript library", "A CSS framework", "A database"]', 'A virtual version of the HTML DOM', 3, 'medium', 2),
((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'), 'Which of the following is true about React keys?', 'multiple_choice', '["Keys help React identify changed items", "Keys should be unique among siblings", "Keys improve performance", "All of the above"]', 'All of the above', 4, 'hard', 3);

-- Python Django Assessment Questions
INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index) VALUES
((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'), 'What is Django ORM?', 'multiple_choice', '["Object-Relational Mapping", "Online Resource Manager", "Operational Risk Management", "Object Resource Model"]', 'Object-Relational Mapping', 2, 'easy', 1),
((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'), 'Which file contains Django project settings?', 'multiple_choice', '["views.py", "models.py", "settings.py", "urls.py"]', 'settings.py', 2, 'easy', 2),
((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'), 'What is the purpose of Django middleware?', 'multiple_choice', '["Handle requests and responses", "Manage database connections", "Template rendering", "URL routing"]', 'Handle requests and responses', 3, 'medium', 3);

-- =============================================================================
-- 📝 TASKS AND ASSIGNMENTS DATA
-- =============================================================================

-- Full Stack MERN Tasks
INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, instructions, requirements, is_mandatory, order_index, created_by) VALUES
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'Build a Todo Application', 'Create a full-stack todo application using MERN stack with CRUD operations and user authentication.', 'project', 'medium', 100, '2025-03-15 23:59:59', 'Build a complete todo app with React frontend, Node.js backend, and MongoDB database. Include user registration, login, and todo management features.', 'Use React for frontend, Node.js/Express for backend, MongoDB for database, implement JWT authentication, responsive design, proper error handling', true, 1, '550e8400-e29b-41d4-a716-446655440000'),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'API Design and Implementation', 'Design and implement RESTful APIs for an e-commerce application.', 'assignment', 'hard', 80, '2025-03-30 23:59:59', 'Create comprehensive API documentation and implement all endpoints for product management, user management, and order processing.', 'Use Express.js, implement proper HTTP methods, status codes, error handling, input validation, and API documentation with Swagger', true, 2, '550e8400-e29b-41d4-a716-446655440000'),
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 'Database Schema Design', 'Design a comprehensive database schema for a social media platform.', 'assignment', 'medium', 60, '2025-04-05 23:59:59', 'Create MongoDB collections and relationships for users, posts, comments, likes, and followers.', 'Use MongoDB, design proper data structures, consider performance and scalability, include data validation', true, 3, '550e8400-e29b-41d4-a716-446655440000');

-- React Frontend Tasks
INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, instructions, requirements, is_mandatory, order_index, created_by) VALUES
((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'), 'React Component Library', 'Build a reusable component library with modern React patterns.', 'project', 'medium', 90, '2025-03-20 23:59:59', 'Create a collection of reusable React components with TypeScript, Storybook documentation, and unit tests.', 'Use React with hooks, TypeScript for type safety, Storybook for documentation, Jest for testing, proper component composition', true, 1, '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'), 'State Management Implementation', 'Implement complex state management using Context API and useReducer.', 'assignment', 'hard', 70, '2025-03-25 23:59:59', 'Build a shopping cart application with complex state management requirements.', 'Use Context API, useReducer hook, implement cart operations, persist state in localStorage', true, 2, '550e8400-e29b-41d4-a716-446655440001');

-- Python Django Tasks
INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, instructions, requirements, is_mandatory, order_index, created_by) VALUES
((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'), 'Django REST API Development', 'Build a comprehensive REST API for a blog application.', 'project', 'medium', 85, '2025-04-20 23:59:59', 'Create Django REST API with authentication, CRUD operations for posts, comments, and user management.', 'Use Django REST Framework, implement JWT authentication, pagination, filtering, and proper serializers', true, 1, '550e8400-e29b-41d4-a716-446655440000'),
((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'), 'Database Optimization', 'Optimize database queries and implement caching.', 'assignment', 'hard', 65, '2025-04-25 23:59:59', 'Analyze and optimize slow database queries, implement Redis caching for improved performance.', 'Use Django ORM efficiently, implement Redis caching, database indexing, query optimization techniques', true, 2, '550e8400-e29b-41d4-a716-446655440000');

-- =============================================================================
-- 📊 SAMPLE TASK SUBMISSIONS
-- =============================================================================

INSERT INTO task_submissions (task_id, student_id, enrollment_id, github_url, submission_text, technologies_used, status, points_earned, submitted_at, reviewed_by, reviewed_at, feedback) VALUES
((SELECT id FROM tasks WHERE title = 'Build a Todo Application'), '550e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440000', 'https://github.com/johndoe/mern-todo-app', 'Completed todo application with all required features including user authentication, CRUD operations, and responsive design. Added extra features like task categories and due dates.', '["React", "Node.js", "Express.js", "MongoDB", "JWT"]', 'approved', 95, '2025-03-10 18:30:00', '550e8400-e29b-41d4-a716-446655440020', '2025-03-12 10:15:00', 'Excellent work! Clean code structure, proper error handling, and good UI/UX design. The additional features show great initiative.'),

((SELECT id FROM tasks WHERE title = 'React Component Library'), '550e8400-e29b-41d4-a716-446655440011', '880e8400-e29b-41d4-a716-446655440001', 'https://github.com/janesmith/react-component-lib', 'Built comprehensive component library with 15 reusable components, full TypeScript support, and Storybook documentation. All components are tested with Jest.', '["React", "TypeScript", "Storybook", "Jest"]', 'approved', 88, '2025-03-18 16:45:00', '550e8400-e29b-41d4-a716-446655440021', '2025-03-20 14:20:00', 'Great component library! Good TypeScript usage and comprehensive testing. Documentation could be improved with more usage examples.'),

((SELECT id FROM tasks WHERE title = 'Django REST API Development'), '550e8400-e29b-41d4-a716-446655440012', '880e8400-e29b-41d4-a716-446655440002', 'https://github.com/mikewilson/django-blog-api', 'Complete blog API with authentication, CRUD operations, pagination, and filtering. Implemented automated testing and comprehensive documentation.', '["Python", "Django", "Django REST Framework", "PostgreSQL"]', 'approved', 92, '2025-04-18 20:15:00', '550e8400-e29b-41d4-a716-446655440020', '2025-04-20 09:30:00', 'Outstanding implementation! Excellent API design, comprehensive testing, and good documentation. Perfect example of REST best practices.');

-- =============================================================================
-- 🏆 CERTIFICATES DATA
-- =============================================================================

INSERT INTO certificates (student_id, program_id, enrollment_id, certificate_number, certificate_type, assessment_score, project_score, final_grade, verification_code, issued_at) VALUES
('550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'WINST-2025-CERT-001', 'completion', 85.5, 92.0, 'A', 'VERIFY-CERT-001-2025', '2025-02-01 15:30:00'),
('550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440005', 'WINST-2025-CERT-002', 'excellence', 92.0, 95.5, 'A+', 'VERIFY-CERT-002-2025', '2025-02-05 14:45:00');

-- =============================================================================
-- 📢 ANNOUNCEMENTS AND TESTIMONIALS
-- =============================================================================

INSERT INTO announcements (title, content, announcement_type, target_audience, is_active, created_by, priority) VALUES
('Welcome to Winst Internship Portal!', 'Welcome to our comprehensive internship program. We are excited to have you join our community of learners and future tech professionals. Explore our programs and start your journey to success!', 'general', 'all', true, '550e8400-e29b-41d4-a716-446655440000', 2),
('New MERN Stack Program Launched', 'We are excited to announce our new Full Stack Web Development with MERN program. Early bird discount of 20% available until January 10th! Limited seats available.', 'program_specific', 'students', true, '550e8400-e29b-41d4-a716-446655440000', 3),
('Upcoming Webinar: Modern React Patterns', 'Join our free webinar on Modern React Patterns and Best Practices. Date: January 20th, 2025 at 7 PM IST. Register now for exclusive insights from industry experts.', 'feature', 'all', true, '550e8400-e29b-41d4-a716-446655440000', 2),
('System Maintenance Notice', 'Scheduled maintenance on January 25th from 2 AM to 4 AM IST. Platform will be temporarily unavailable during this time. We apologize for any inconvenience.', 'maintenance', 'all', true, '550e8400-e29b-41d4-a716-446655440000', 1);

INSERT INTO testimonials (student_name, student_role, image_url, content, is_featured) VALUES
('Rahul Kumar', 'Software Engineer at Google', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Winst internship program completely transformed my career. The hands-on projects and mentorship helped me land my dream job at Google. The MERN stack program gave me all the skills I needed. Highly recommended!', true),
('Priya Sharma', 'Frontend Developer at Microsoft', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'The React mastery program gave me the confidence and skills to work on complex frontend projects. The instructors are amazing and always available to help. The project-based learning approach is fantastic!', true),
('Amit Patel', 'Full Stack Developer at Startup', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Best investment I made for my career. The practical approach and real-world projects prepared me for the industry challenges. Now I am leading a team of developers at a fast-growing startup!', false),
('Neha Singh', 'DevOps Engineer at Amazon', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'The DevOps program was comprehensive and up-to-date with industry standards. I learned everything from Docker to Kubernetes and AWS. Landed a job at Amazon within 2 months of completion. Amazing experience!', true),
('Arjun Mehta', 'Data Scientist at Flipkart', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'The Data Science program exceeded my expectations. Real datasets, practical machine learning projects, and excellent mentorship. Transitioned from mechanical engineering to data science successfully!', true),
('Kavya Reddy', 'Mobile App Developer at Zomato', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'React Native program was perfect for someone wanting to build mobile apps. Built 3 apps during the course and got hired by Zomato before completing the program. The industry connections are valuable!', false);

-- =============================================================================
-- 📊 LEARNING JOURNEY TRACKING
-- =============================================================================

INSERT INTO learning_journey (student_id, program_id, enrollment_id, current_step, progress_percentage, milestones_completed, current_milestone) VALUES
('550e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'tasks_in_progress', 65, '["enrolled", "assessment_completed", "tasks_assigned"]', 'Building MERN Todo Application'),
('550e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'tasks_in_progress', 45, '["enrolled", "assessment_completed"]', 'React Component Library'),
('550e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'completed', 100, '["enrolled", "assessment_completed", "tasks_completed", "project_approved", "certificate_issued"]', 'Program Completed'),
('550e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'assessment_pending', 15, '["enrolled"]', 'Take Assessment'),
('550e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 'assessment_completed', 25, '["enrolled", "assessment_completed"]', 'Starting DevOps Projects'),
('550e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440005', 'completed', 100, '["enrolled", "assessment_completed", "tasks_completed", "project_approved", "certificate_issued"]', 'Program Completed'),
('550e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440006', 'enrolled', 5, '["enrolled"]', 'Getting Started');

COMMIT;

-- =============================================================================
-- 🎉 DATA POPULATION COMPLETE
-- =============================================================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '🎉 WINST INTERNSHIP PORTAL DATA POPULATION COMPLETE!';
    RAISE NOTICE '📊 Database populated with comprehensive realistic data:';
    RAISE NOTICE '👥 Users: 12 (Admins, Students, Mentors, Affiliates)';
    RAISE NOTICE '🛠️ Technologies: 25+ (Frontend, Backend, Database, DevOps)';
    RAISE NOTICE '🎓 Programs: 6 comprehensive internship programs';
    RAISE NOTICE '📚 Enrollments: 7 student enrollments with progress';
    RAISE NOTICE '🤝 Referrals: 5 referral codes (some completed)';
    RAISE NOTICE '💰 Orders: 7 orders with payment tracking';
    RAISE NOTICE '📊 Assessments: 11 sample questions across programs';
    RAISE NOTICE '📝 Tasks: 7 realistic programming assignments';
    RAISE NOTICE '✅ Submissions: 3 completed task submissions';
    RAISE NOTICE '🏆 Certificates: 2 issued certificates';
    RAISE NOTICE '📢 Announcements: 4 platform announcements';
    RAISE NOTICE '⭐ Testimonials: 6 student success stories';
    RAISE NOTICE '🚀 Database is now ready for full application testing!';
END $$;