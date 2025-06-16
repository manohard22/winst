-- LUCRO INTERNSHIP PORTAL DUMMY DATA
-- Insert sample data for development and testing

-- Insert Roles
INSERT INTO roles (role_name) VALUES 
('admin'),
('student'),
('mentor');

-- Insert Technologies
INSERT INTO technologies (tech_name, description, duration_months, price, is_active) VALUES 
('Web Development', 'Full-stack web development with React, Node.js, and MongoDB', 6, 15000.00, TRUE),
('Data Science', 'Machine learning, data analysis, and AI with Python and R', 8, 20000.00, TRUE),
('Mobile Development', 'Native and cross-platform mobile app development', 6, 18000.00, TRUE),
('Digital Marketing', 'SEO, social media marketing, and digital advertising', 4, 12000.00, TRUE),
('Cloud Computing', 'AWS, Azure, and Google Cloud platform training', 5, 16000.00, TRUE),
('Cybersecurity', 'Ethical hacking, network security, and penetration testing', 6, 22000.00, TRUE),
('DevOps', 'CI/CD, containerization, and infrastructure automation', 5, 17000.00, TRUE),
('UI/UX Design', 'User interface and user experience design principles', 4, 14000.00, TRUE);

-- Insert Admin Users
INSERT INTO users (full_name, email, password_hash, phone, education_level, field_of_study, address, role_id, last_login, is_active) VALUES 
('Rajesh Kumar', 'admin@lucro.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543210', 'postgraduate', 'Computer Science', 'Bangalore, Karnataka', 1, '2024-01-21 10:30:00', TRUE),
('Priya Sharma', 'priya.admin@lucro.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543211', 'graduate', 'Information Technology', 'Mumbai, Maharashtra', 1, '2024-01-20 14:15:00', TRUE);

-- Insert Student Users
INSERT INTO users (full_name, email, password_hash, phone, education_level, field_of_study, address, role_id, last_login, is_active) VALUES 
('Rahul Kumar', 'rahul@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543220', 'undergraduate', 'Computer Science', 'Bangalore, Karnataka', 2, '2024-01-20 09:45:00', TRUE),
('Priya Patel', 'priya@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543221', 'graduate', 'Mathematics', 'Mumbai, Maharashtra', 2, '2024-01-19 16:20:00', TRUE),
('Amit Singh', 'amit@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543222', 'undergraduate', 'Information Technology', 'Pune, Maharashtra', 2, '2024-01-18 11:30:00', TRUE),
('Sneha Reddy', 'sneha@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543223', 'graduate', 'Business Administration', 'Hyderabad, Telangana', 2, '2024-01-20 08:15:00', TRUE),
('Arjun Gupta', 'arjun@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543224', 'postgraduate', 'Computer Science', 'Delhi, India', 2, '2024-01-21 07:45:00', TRUE),
('Kavya Nair', 'kavya@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543225', 'undergraduate', 'Electronics', 'Kochi, Kerala', 2, '2024-01-19 13:20:00', TRUE),
('Vikram Joshi', 'vikram@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543226', 'graduate', 'Mechanical Engineering', 'Chennai, Tamil Nadu', 2, '2024-01-18 15:10:00', TRUE),
('Ananya Sharma', 'ananya@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543227', 'undergraduate', 'Computer Applications', 'Jaipur, Rajasthan', 2, '2024-01-20 12:30:00', TRUE),
('Rohan Mehta', 'rohan@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543228', 'graduate', 'Data Science', 'Ahmedabad, Gujarat', 2, '2024-01-19 10:45:00', TRUE),
('Divya Agarwal', 'divya@example.com', '$2b$10$rQZ8kHWKtGKVQZ8kHWKtGOyJ8kHWKtGKVQZ8kHWKtGKVQZ8kHWKtG', '+91 9876543229', 'undergraduate', 'Information Systems', 'Kolkata, West Bengal', 2, '2024-01-17 14:20:00', TRUE);

-- Insert Student Internships
INSERT INTO student_internship (student_id, tech_id, start_date, end_date, status, progress_percentage, mentor_assigned, enrollment_date) VALUES 
(3, 1, '2024-01-15', '2024-07-15', 'active', 75, 'Sarah Johnson', '2024-01-15 10:00:00'),
(4, 2, '2024-01-10', '2024-09-10', 'active', 60, 'Michael Chen', '2024-01-10 11:30:00'),
(5, 3, '2023-12-01', '2024-06-01', 'completed', 100, 'Lisa Wang', '2023-12-01 09:15:00'),
(6, 4, '2024-01-20', '2024-05-20', 'pending', 0, 'David Brown', '2024-01-20 14:45:00'),
(7, 5, '2023-11-15', '2024-04-15', 'active', 85, 'Jennifer Davis', '2023-11-15 16:20:00'),
(8, 6, '2024-01-05', '2024-07-05', 'active', 45, 'Robert Wilson', '2024-01-05 12:10:00'),
(9, 7, '2024-01-12', '2024-06-12', 'active', 30, 'Emily Taylor', '2024-01-12 13:30:00'),
(10, 8, '2024-01-08', '2024-05-08', 'active', 55, 'James Anderson', '2024-01-08 15:45:00'),
(11, 1, '2023-12-20', '2024-06-20', 'active', 70, 'Sarah Johnson', '2023-12-20 10:30:00'),
(12, 2, '2024-01-18', '2024-09-18', 'active', 25, 'Michael Chen', '2024-01-18 11:15:00');

-- Insert Orders
INSERT INTO orders (student_id, tech_id, order_date, total_amount, discount_amount, final_amount, status, order_description) VALUES 
(3, 1, '2024-01-15 09:30:00', 20000.00, 5000.00, 15000.00, 'paid', 'Web Development Internship Program Fee'),
(4, 2, '2024-01-10 10:15:00', 25000.00, 5000.00, 20000.00, 'paid', 'Data Science Internship Program Fee'),
(5, 3, '2023-12-01 11:20:00', 22000.00, 4000.00, 18000.00, 'paid', 'Mobile Development Internship Program Fee'),
(6, 4, '2024-01-20 14:30:00', 15000.00, 3000.00, 12000.00, 'pending', 'Digital Marketing Internship Program Fee'),
(7, 5, '2023-11-15 16:10:00', 20000.00, 4000.00, 16000.00, 'paid', 'Cloud Computing Internship Program Fee'),
(8, 6, '2024-01-05 12:00:00', 25000.00, 3000.00, 22000.00, 'paid', 'Cybersecurity Internship Program Fee'),
(9, 7, '2024-01-12 13:20:00', 20000.00, 3000.00, 17000.00, 'paid', 'DevOps Internship Program Fee'),
(10, 8, '2024-01-08 15:30:00', 17000.00, 3000.00, 14000.00, 'paid', 'UI/UX Design Internship Program Fee'),
(11, 1, '2023-12-20 10:20:00', 20000.00, 5000.00, 15000.00, 'paid', 'Web Development Internship Program Fee'),
(12, 2, '2024-01-18 11:10:00', 25000.00, 5000.00, 20000.00, 'paid', 'Data Science Internship Program Fee');

-- Insert Payments
INSERT INTO payments (order_id, amount, payment_date, payment_method, payment_status, transaction_id, payment_gateway, gateway_response) VALUES 
(1, 15000.00, '2024-01-15 09:45:00', 'UPI', 'completed', 'TXN123456789', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456789"}'),
(2, 20000.00, '2024-01-10 10:30:00', 'Credit Card', 'completed', 'TXN123456790', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456790"}'),
(3, 18000.00, '2023-12-01 11:35:00', 'UPI', 'completed', 'TXN123456791', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456791"}'),
(4, 12000.00, '2024-01-20 14:45:00', 'Bank Transfer', 'pending', 'TXN123456792', 'Manual', '{"status": "pending", "reference": "NEFT123456"}'),
(5, 16000.00, '2023-11-15 16:25:00', 'Debit Card', 'completed', 'TXN123456793', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456793"}'),
(6, 22000.00, '2024-01-05 12:15:00', 'UPI', 'completed', 'TXN123456794', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456794"}'),
(7, 17000.00, '2024-01-12 13:35:00', 'Credit Card', 'completed', 'TXN123456795', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456795"}'),
(8, 14000.00, '2024-01-08 15:45:00', 'UPI', 'completed', 'TXN123456796', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456796"}'),
(9, 15000.00, '2023-12-20 10:35:00', 'Debit Card', 'completed', 'TXN123456797', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456797"}'),
(10, 20000.00, '2024-01-18 11:25:00', 'UPI', 'completed', 'TXN123456798', 'Razorpay', '{"status": "success", "gateway_txn_id": "pay_123456798"}');

-- Insert Tasks
INSERT INTO tasks (title, description, tech_id, assigned_to, created_by, due_date, status, points, created_at) VALUES 
-- Web Development Tasks
('HTML & CSS Fundamentals', 'Create a responsive landing page using HTML5 and CSS3', 1, 3, 1, '2024-01-25', 'completed', 100, '2024-01-15 10:00:00'),
('JavaScript Basics', 'Build an interactive calculator using vanilla JavaScript', 1, 3, 1, '2024-02-05', 'completed', 150, '2024-01-20 11:00:00'),
('React Components', 'Create a todo application using React hooks', 1, 3, 1, '2024-02-15', 'in_progress', 200, '2024-01-25 12:00:00'),
('Node.js API', 'Build a RESTful API using Node.js and Express', 1, 3, 1, '2024-02-25', 'pending', 250, '2024-02-01 13:00:00'),
('Full Stack Project', 'Develop a complete CRUD application', 1, 3, 1, '2024-03-10', 'pending', 300, '2024-02-10 14:00:00'),

-- Data Science Tasks
('Python Fundamentals', 'Complete Python programming basics and data structures', 2, 4, 1, '2024-01-30', 'completed', 120, '2024-01-10 10:30:00'),
('Data Analysis with Pandas', 'Analyze a dataset using Pandas and NumPy', 2, 4, 1, '2024-02-10', 'completed', 180, '2024-01-20 11:30:00'),
('Data Visualization', 'Create interactive charts using Matplotlib and Seaborn', 2, 4, 1, '2024-02-20', 'in_progress', 200, '2024-02-01 12:30:00'),
('Machine Learning Model', 'Build a predictive model using scikit-learn', 2, 4, 1, '2024-03-05', 'pending', 280, '2024-02-15 13:30:00'),
('Deep Learning Project', 'Implement a neural network using TensorFlow', 2, 4, 1, '2024-03-20', 'pending', 350, '2024-03-01 14:30:00'),

-- Mobile Development Tasks
('Flutter Setup', 'Set up Flutter development environment', 3, 5, 1, '2023-12-15', 'completed', 80, '2023-12-01 09:00:00'),
('Basic UI Components', 'Create basic Flutter widgets and layouts', 3, 5, 1, '2023-12-25', 'completed', 120, '2023-12-10 10:00:00'),
('State Management', 'Implement state management using Provider', 3, 5, 1, '2024-01-10', 'completed', 180, '2023-12-20 11:00:00'),
('API Integration', 'Connect app to REST API and handle responses', 3, 5, 1, '2024-01-25', 'completed', 220, '2024-01-05 12:00:00'),
('Final Mobile App', 'Complete mobile application with all features', 3, 5, 1, '2024-02-10', 'completed', 400, '2024-01-20 13:00:00'),

-- Cloud Computing Tasks
('AWS Basics', 'Learn AWS fundamentals and create EC2 instance', 5, 7, 1, '2023-12-01', 'completed', 100, '2023-11-15 10:00:00'),
('Docker Containerization', 'Containerize an application using Docker', 5, 7, 1, '2023-12-15', 'completed', 150, '2023-11-25 11:00:00'),
('Kubernetes Deployment', 'Deploy application on Kubernetes cluster', 5, 7, 1, '2024-01-05', 'completed', 200, '2023-12-10 12:00:00'),
('CI/CD Pipeline', 'Set up automated deployment pipeline', 5, 7, 1, '2024-01-20', 'in_progress', 250, '2023-12-25 13:00:00'),
('Cloud Architecture', 'Design scalable cloud infrastructure', 5, 7, 1, '2024-02-05', 'pending', 300, '2024-01-10 14:00:00');

-- Insert Task Submissions
INSERT INTO task_submissions (task_id, student_id, submission_text, submission_url, submitted_at, feedback, grade, reviewed_by, reviewed_at) VALUES 
(1, 3, 'Completed responsive landing page with modern design', 'https://github.com/rahul/landing-page', '2024-01-24 15:30:00', 'Excellent work! Clean code and responsive design.', 'A+', 1, '2024-01-25 10:00:00'),
(2, 3, 'Interactive calculator with all basic operations', 'https://github.com/rahul/calculator', '2024-02-04 16:45:00', 'Good implementation of JavaScript concepts.', 'A', 1, '2024-02-05 11:30:00'),
(6, 4, 'Python basics completed with all exercises', 'https://github.com/priya/python-basics', '2024-01-29 14:20:00', 'Strong foundation in Python programming.', 'A', 1, '2024-01-30 09:15:00'),
(7, 4, 'Comprehensive data analysis of sales dataset', 'https://github.com/priya/data-analysis', '2024-02-09 17:30:00', 'Thorough analysis with good insights.', 'A+', 1, '2024-02-10 10:45:00'),
(11, 5, 'Flutter environment successfully configured', 'https://github.com/amit/flutter-setup', '2023-12-14 12:00:00', 'Perfect setup and documentation.', 'A+', 1, '2023-12-15 08:30:00'),
(12, 5, 'Beautiful UI components with proper styling', 'https://github.com/amit/flutter-ui', '2023-12-24 18:15:00', 'Great attention to UI/UX details.', 'A', 1, '2023-12-25 09:00:00'),
(13, 5, 'State management implemented correctly', 'https://github.com/amit/state-management', '2024-01-09 19:45:00', 'Excellent understanding of state management.', 'A+', 1, '2024-01-10 10:30:00'),
(14, 5, 'API integration working perfectly', 'https://github.com/amit/api-integration', '2024-01-24 20:30:00', 'Smooth API integration with error handling.', 'A', 1, '2024-01-25 11:15:00'),
(15, 5, 'Complete mobile app with all required features', 'https://github.com/amit/final-app', '2024-02-09 21:00:00', 'Outstanding final project! Professional quality.', 'A+', 1, '2024-02-10 12:00:00'),
(16, 7, 'AWS EC2 instance created and configured', 'https://github.com/arjun/aws-basics', '2023-11-30 13:45:00', 'Good understanding of AWS fundamentals.', 'A', 1, '2023-12-01 09:30:00'),
(17, 7, 'Application successfully containerized', 'https://github.com/arjun/docker-app', '2023-12-14 16:20:00', 'Clean Docker implementation.', 'A', 1, '2023-12-15 10:15:00'),
(18, 7, 'Kubernetes deployment working correctly', 'https://github.com/arjun/k8s-deploy', '2024-01-04 17:30:00', 'Complex deployment handled well.', 'A+', 1, '2024-01-05 11:45:00');

-- Insert Login Sessions
INSERT INTO login_sessions (user_id, login_time, logout_time, ip_address, user_agent) VALUES 
(1, '2024-01-21 10:30:00', '2024-01-21 18:45:00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(3, '2024-01-20 09:45:00', '2024-01-20 17:30:00', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(4, '2024-01-19 16:20:00', '2024-01-19 22:15:00', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(5, '2024-01-18 11:30:00', '2024-01-18 19:45:00', '192.168.1.103', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'),
(7, '2024-01-21 07:45:00', '2024-01-21 16:30:00', '192.168.1.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

-- Insert Certificates
INSERT INTO internship_certificates (student_id, tech_id, issue_date, certificate_url, certificate_number, remarks, issued_by, is_verified) VALUES 
(5, 3, '2024-02-15', 'https://certificates.lucro.com/cert_AMT_MOB_001.pdf', 'LUCRO-MOB-2024-001', 'Completed with distinction. Excellent project work.', 1, TRUE),
(7, 5, '2024-02-20', 'https://certificates.lucro.com/cert_ARJ_CLD_001.pdf', 'LUCRO-CLD-2024-001', 'Outstanding performance in cloud technologies.', 1, TRUE);
