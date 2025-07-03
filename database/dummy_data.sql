-- Lucro Internship Portal Dummy Data
-- Insert sample data for testing and development

-- Insert Technologies
INSERT INTO technologies (id, name, category, description, icon_url) VALUES
(uuid_generate_v4(), 'React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
(uuid_generate_v4(), 'Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
(uuid_generate_v4(), 'Python', 'Programming Language', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
(uuid_generate_v4(), 'JavaScript', 'Programming Language', 'Dynamic programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'),
(uuid_generate_v4(), 'PostgreSQL', 'Database', 'Open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
(uuid_generate_v4(), 'MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
(uuid_generate_v4(), 'Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'),
(uuid_generate_v4(), 'Tailwind CSS', 'Frontend', 'Utility-first CSS framework', 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg'),
(uuid_generate_v4(), 'Docker', 'DevOps', 'Containerization platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
(uuid_generate_v4(), 'AWS', 'Cloud', 'Amazon Web Services', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg');

-- Insert Admin Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified) VALUES
(uuid_generate_v4(), 'admin@lucro.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Admin', 'User', '+91-9876543210', 'admin', true, true),
(uuid_generate_v4(), 'mentor@lucro.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'John', 'Mentor', '+91-9876543211', 'mentor', true, true);

-- Insert Student Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, date_of_birth, gender, college_name, degree, branch, year_of_study, cgpa, linkedin_url, github_url, is_active, email_verified) VALUES
(uuid_generate_v4(), 'rahul@example.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Rahul', 'Sharma', '+91-9876543212', 'student', '2001-05-15', 'Male', 'IIT Delhi', 'B.Tech', 'Computer Science', 3, 8.5, 'https://linkedin.com/in/rahul-sharma', 'https://github.com/rahulsharma', true, true),
(uuid_generate_v4(), 'priya@example.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Priya', 'Patel', '+91-9876543213', 'student', '2002-08-22', 'Female', 'NIT Surat', 'B.Tech', 'Information Technology', 2, 9.1, 'https://linkedin.com/in/priya-patel', 'https://github.com/priyapatel', true, true),
(uuid_generate_v4(), 'amit@example.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Amit', 'Kumar', '+91-9876543214', 'student', '2000-12-10', 'Male', 'BITS Pilani', 'B.Tech', 'Electronics', 4, 8.8, 'https://linkedin.com/in/amit-kumar', 'https://github.com/amitkumar', true, true),
(uuid_generate_v4(), 'sneha@example.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Sneha', 'Singh', '+91-9876543215', 'student', '2001-03-18', 'Female', 'VIT Vellore', 'B.Tech', 'Computer Science', 3, 8.2, 'https://linkedin.com/in/sneha-singh', 'https://github.com/snehasingh', true, true),
(uuid_generate_v4(), 'vikash@example.com', '$2b$10$rOzJaHq.V8ZhAoQGZqGzKOKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Vikash', 'Gupta', '+91-9876543216', 'student', '2002-01-25', 'Male', 'DTU Delhi', 'B.Tech', 'Software Engineering', 2, 8.7, 'https://linkedin.com/in/vikash-gupta', 'https://github.com/vikashgupta', true, true);

-- Insert Internship Programs
INSERT INTO internship_programs (id, title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, start_date, end_date, registration_deadline, requirements, learning_outcomes, image_url) VALUES
(uuid_generate_v4(), 'Full Stack Web Development', 'Complete full-stack development program covering React, Node.js, and databases. Build real-world projects and gain industry experience.', 12, 'intermediate', 15000.00, 20, 12000.00, 50, '2024-02-01', '2024-04-26', '2024-01-25', 'Basic knowledge of HTML, CSS, JavaScript', 'Master React, Node.js, Express, MongoDB, RESTful APIs, Authentication, Deployment', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),
(uuid_generate_v4(), 'Python Data Science', 'Comprehensive data science program with Python, covering data analysis, machine learning, and visualization.', 10, 'beginner', 12000.00, 15, 10200.00, 40, '2024-02-15', '2024-04-26', '2024-02-08', 'Basic programming knowledge', 'Python fundamentals, Pandas, NumPy, Matplotlib, Scikit-learn, Machine Learning basics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'),
(uuid_generate_v4(), 'Mobile App Development', 'Learn to build cross-platform mobile applications using React Native and modern development practices.', 8, 'intermediate', 10000.00, 10, 9000.00, 30, '2024-03-01', '2024-04-26', '2024-02-22', 'JavaScript knowledge, React basics', 'React Native, Mobile UI/UX, API integration, App deployment, Performance optimization', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'),
(uuid_generate_v4(), 'DevOps Engineering', 'Master DevOps practices including CI/CD, containerization, cloud deployment, and infrastructure management.', 14, 'advanced', 18000.00, 25, 13500.00, 25, '2024-02-10', '2024-05-18', '2024-02-03', 'Linux basics, Programming experience', 'Docker, Kubernetes, AWS, CI/CD pipelines, Infrastructure as Code, Monitoring', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500'),
(uuid_generate_v4(), 'UI/UX Design', 'Complete design program covering user research, wireframing, prototyping, and modern design tools.', 6, 'beginner', 8000.00, 30, 5600.00, 35, '2024-03-15', '2024-04-26', '2024-03-08', 'No prior experience required', 'Design thinking, Figma, Adobe XD, User research, Prototyping, Design systems', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500');

-- Get technology and program IDs for mapping
DO $$
DECLARE
    react_id UUID;
    nodejs_id UUID;
    python_id UUID;
    js_id UUID;
    postgres_id UUID;
    mongo_id UUID;
    express_id UUID;
    tailwind_id UUID;
    docker_id UUID;
    aws_id UUID;
    
    fullstack_id UUID;
    datascience_id UUID;
    mobile_id UUID;
    devops_id UUID;
    uiux_id UUID;
BEGIN
    -- Get technology IDs
    SELECT id INTO react_id FROM technologies WHERE name = 'React';
    SELECT id INTO nodejs_id FROM technologies WHERE name = 'Node.js';
    SELECT id INTO python_id FROM technologies WHERE name = 'Python';
    SELECT id INTO js_id FROM technologies WHERE name = 'JavaScript';
    SELECT id INTO postgres_id FROM technologies WHERE name = 'PostgreSQL';
    SELECT id INTO mongo_id FROM technologies WHERE name = 'MongoDB';
    SELECT id INTO express_id FROM technologies WHERE name = 'Express.js';
    SELECT id INTO tailwind_id FROM technologies WHERE name = 'Tailwind CSS';
    SELECT id INTO docker_id FROM technologies WHERE name = 'Docker';
    SELECT id INTO aws_id FROM technologies WHERE name = 'AWS';
    
    -- Get program IDs
    SELECT id INTO fullstack_id FROM internship_programs WHERE title = 'Full Stack Web Development';
    SELECT id INTO datascience_id FROM internship_programs WHERE title = 'Python Data Science';
    SELECT id INTO mobile_id FROM internship_programs WHERE title = 'Mobile App Development';
    SELECT id INTO devops_id FROM internship_programs WHERE title = 'DevOps Engineering';
    SELECT id INTO uiux_id FROM internship_programs WHERE title = 'UI/UX Design';
    
    -- Insert program-technology mappings
    INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES
    (fullstack_id, react_id, true),
    (fullstack_id, nodejs_id, true),
    (fullstack_id, js_id, true),
    (fullstack_id, express_id, false),
    (fullstack_id, mongo_id, false),
    (fullstack_id, tailwind_id, false),
    
    (datascience_id, python_id, true),
    
    (mobile_id, react_id, true),
    (mobile_id, js_id, true),
    
    (devops_id, docker_id, true),
    (devops_id, aws_id, true),
    (devops_id, nodejs_id, false);
END $$;

-- Insert Student Internship Enrollments
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    student4_id UUID;
    student5_id UUID;
    mentor_id UUID;
    
    fullstack_id UUID;
    datascience_id UUID;
    mobile_id UUID;
    devops_id UUID;
    uiux_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO student1_id FROM users WHERE email = 'rahul@example.com';
    SELECT id INTO student2_id FROM users WHERE email = 'priya@example.com';
    SELECT id INTO student3_id FROM users WHERE email = 'amit@example.com';
    SELECT id INTO student4_id FROM users WHERE email = 'sneha@example.com';
    SELECT id INTO student5_id FROM users WHERE email = 'vikash@example.com';
    SELECT id INTO mentor_id FROM users WHERE email = 'mentor@lucro.com';
    
    -- Get program IDs
    SELECT id INTO fullstack_id FROM internship_programs WHERE title = 'Full Stack Web Development';
    SELECT id INTO datascience_id FROM internship_programs WHERE title = 'Python Data Science';
    SELECT id INTO mobile_id FROM internship_programs WHERE title = 'Mobile App Development';
    SELECT id INTO devops_id FROM internship_programs WHERE title = 'DevOps Engineering';
    SELECT id INTO uiux_id FROM internship_programs WHERE title = 'UI/UX Design';
    
    -- Insert enrollments
    INSERT INTO student_internship (student_id, program_id, status, progress_percentage, start_date, mentor_id) VALUES
    (student1_id, fullstack_id, 'in_progress', 65, '2024-02-01', mentor_id),
    (student2_id, datascience_id, 'in_progress', 80, '2024-02-15', mentor_id),
    (student3_id, devops_id, 'completed', 100, '2024-02-10', mentor_id),
    (student4_id, mobile_id, 'in_progress', 45, '2024-03-01', mentor_id),
    (student5_id, uiux_id, 'enrolled', 10, '2024-03-15', mentor_id);
END $$;

-- Insert Orders
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    student4_id UUID;
    student5_id UUID;
    
    fullstack_id UUID;
    datascience_id UUID;
    mobile_id UUID;
    devops_id UUID;
    uiux_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO student1_id FROM users WHERE email = 'rahul@example.com';
    SELECT id INTO student2_id FROM users WHERE email = 'priya@example.com';
    SELECT id INTO student3_id FROM users WHERE email = 'amit@example.com';
    SELECT id INTO student4_id FROM users WHERE email = 'sneha@example.com';
    SELECT id INTO student5_id FROM users WHERE email = 'vikash@example.com';
    
    -- Get program IDs
    SELECT id INTO fullstack_id FROM internship_programs WHERE title = 'Full Stack Web Development';
    SELECT id INTO datascience_id FROM internship_programs WHERE title = 'Python Data Science';
    SELECT id INTO mobile_id FROM internship_programs WHERE title = 'Mobile App Development';
    SELECT id INTO devops_id FROM internship_programs WHERE title = 'DevOps Engineering';
    SELECT id INTO uiux_id FROM internship_programs WHERE title = 'UI/UX Design';
    
    -- Insert orders
    INSERT INTO orders (student_id, program_id, order_number, amount, discount_amount, final_amount, status, payment_method) VALUES
    (student1_id, fullstack_id, 'ORD-2024-001', 15000.00, 3000.00, 12000.00, 'paid', 'razorpay'),
    (student2_id, datascience_id, 'ORD-2024-002', 12000.00, 1800.00, 10200.00, 'paid', 'razorpay'),
    (student3_id, devops_id, 'ORD-2024-003', 18000.00, 4500.00, 13500.00, 'paid', 'paytm'),
    (student4_id, mobile_id, 'ORD-2024-004', 10000.00, 1000.00, 9000.00, 'paid', 'razorpay'),
    (student5_id, uiux_id, 'ORD-2024-005', 8000.00, 2400.00, 5600.00, 'paid', 'gpay');
END $$;

-- Insert Payments
DO $$
DECLARE
    order_rec RECORD;
BEGIN
    FOR order_rec IN SELECT id, final_amount FROM orders LOOP
        INSERT INTO payments (order_id, amount, payment_method, payment_gateway, gateway_transaction_id, status, processed_at) VALUES
        (order_rec.id, order_rec.final_amount, 'upi', 'razorpay', 'txn_' || substr(order_rec.id::text, 1, 8), 'success', CURRENT_TIMESTAMP - INTERVAL '1 day');
    END LOOP;
END $$;

-- Insert Tasks
DO $$
DECLARE
    fullstack_id UUID;
    datascience_id UUID;
    mobile_id UUID;
BEGIN
    SELECT id INTO fullstack_id FROM internship_programs WHERE title = 'Full Stack Web Development';
    SELECT id INTO datascience_id FROM internship_programs WHERE title = 'Python Data Science';
    SELECT id INTO mobile_id FROM internship_programs WHERE title = 'Mobile App Development';
    
    INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, order_index) VALUES
    (fullstack_id, 'HTML/CSS Portfolio', 'Create a personal portfolio website using HTML and CSS', 'assignment', 'easy', 100, CURRENT_TIMESTAMP + INTERVAL '7 days', 1),
    (fullstack_id, 'JavaScript Todo App', 'Build a todo application using vanilla JavaScript', 'project', 'medium', 150, CURRENT_TIMESTAMP + INTERVAL '14 days', 2),
    (fullstack_id, 'React Component Library', 'Create reusable React components', 'assignment', 'medium', 200, CURRENT_TIMESTAMP + INTERVAL '21 days', 3),
    (fullstack_id, 'Full Stack E-commerce', 'Build a complete e-commerce application', 'project', 'hard', 300, CURRENT_TIMESTAMP + INTERVAL '35 days', 4),
    
    (datascience_id, 'Data Analysis with Pandas', 'Analyze a dataset using Pandas library', 'assignment', 'easy', 100, CURRENT_TIMESTAMP + INTERVAL '7 days', 1),
    (datascience_id, 'Machine Learning Model', 'Build and train a ML model', 'project', 'medium', 200, CURRENT_TIMESTAMP + INTERVAL '14 days', 2),
    (datascience_id, 'Data Visualization Dashboard', 'Create interactive visualizations', 'project', 'hard', 250, CURRENT_TIMESTAMP + INTERVAL '21 days', 3),
    
    (mobile_id, 'React Native Setup', 'Setup development environment and create first app', 'assignment', 'easy', 50, CURRENT_TIMESTAMP + INTERVAL '3 days', 1),
    (mobile_id, 'Navigation App', 'Implement navigation between screens', 'assignment', 'medium', 100, CURRENT_TIMESTAMP + INTERVAL '10 days', 2),
    (mobile_id, 'Complete Mobile App', 'Build a full-featured mobile application', 'project', 'hard', 300, CURRENT_TIMESTAMP + INTERVAL '28 days', 3);
END $$;

-- Insert Task Submissions
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    task_rec RECORD;
BEGIN
    SELECT id INTO student1_id FROM users WHERE email = 'rahul@example.com';
    SELECT id INTO student2_id FROM users WHERE email = 'priya@example.com';
    
    -- Get some tasks and insert submissions
    FOR task_rec IN SELECT id FROM tasks LIMIT 5 LOOP
        INSERT INTO task_submissions (task_id, student_id, submission_text, github_url, status, points_earned) VALUES
        (task_rec.id, student1_id, 'Completed the assignment as per requirements', 'https://github.com/rahulsharma/task-' || substr(task_rec.id::text, 1, 8), 'approved', 85),
        (task_rec.id, student2_id, 'Submitted the project with additional features', 'https://github.com/priyapatel/task-' || substr(task_rec.id::text, 1, 8), 'approved', 92);
    END LOOP;
END $$;

-- Insert Certificates
DO $$
DECLARE
    completed_internship_id UUID;
BEGIN
    SELECT id INTO completed_internship_id FROM student_internship WHERE status = 'completed' LIMIT 1;
    
    IF completed_internship_id IS NOT NULL THEN
        INSERT INTO internship_certificates (student_internship_id, certificate_number, issue_date, verification_code, issued_by) VALUES
        (completed_internship_id, 'LUCRO-2024-001', CURRENT_DATE, 'VERIFY-' || substr(completed_internship_id::text, 1, 8), (SELECT id FROM users WHERE role = 'admin' LIMIT 1));
    END IF;
END $$;

-- Insert Announcements
INSERT INTO announcements (title, content, announcement_type, target_audience, priority, created_by) VALUES
('Welcome to Lucro Internship Portal', 'Welcome to our comprehensive internship management system. We are excited to have you on board!', 'general', 'all', 1, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('New Python Data Science Batch Starting', 'Registration is now open for our Python Data Science internship program. Limited seats available!', 'program_specific', 'students', 2, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('System Maintenance Scheduled', 'The portal will be under maintenance on Sunday from 2 AM to 4 AM IST.', 'maintenance', 'all', 3, (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Update program participant counts
UPDATE internship_programs SET current_participants = (
    SELECT COUNT(*) FROM student_internship WHERE program_id = internship_programs.id
);
