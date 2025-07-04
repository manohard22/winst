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
(uuid_generate_v4(), 'AWS', 'Cloud', 'Amazon Web Services', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg')
ON CONFLICT (name) DO NOTHING;

-- Clear existing data first
TRUNCATE TABLE task_submissions, tasks, student_internship, payments, orders, program_technologies, internship_programs, technologies RESTART IDENTITY CASCADE;

-- Insert comprehensive internship programs with varied types and pricing (All priced at ₹2000)
INSERT INTO internship_programs (id, title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, requirements, learning_outcomes, image_url) VALUES
-- Full Stack Development
(uuid_generate_v4(), 'Full Stack Web Development', 'Complete full-stack development internship covering React, Node.js, and databases. Build real-world projects and gain industry experience.', 12, 'intermediate', 2000.00, 0, 2000.00, 50, 'Basic knowledge of HTML, CSS, JavaScript', 'Master React, Node.js, Express, MongoDB, RESTful APIs, Authentication, Deployment', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),

-- Frontend Development
(uuid_generate_v4(), 'Frontend Development with React', 'Specialized frontend development internship focusing on modern React development, state management, and responsive design.', 10, 'intermediate', 2000.00, 0, 2000.00, 40, 'HTML, CSS, JavaScript basics', 'Advanced React, Redux, TypeScript, Responsive Design, Performance Optimization', 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500'),

(uuid_generate_v4(), 'Frontend Development with Vue.js', 'Learn modern frontend development using Vue.js ecosystem including Vuex, Vue Router, and component architecture.', 8, 'beginner', 2000.00, 0, 2000.00, 35, 'Basic JavaScript knowledge', 'Vue.js, Vuex, Vue Router, Component Design, Frontend Testing', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500'),

-- Backend Development
(uuid_generate_v4(), 'Backend Development with Node.js', 'Master server-side development with Node.js, Express, and database integration for scalable web applications.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'JavaScript fundamentals, Basic programming', 'Node.js, Express.js, MongoDB, PostgreSQL, API Development, Authentication', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500'),

(uuid_generate_v4(), 'Backend Development with Python', 'Comprehensive backend development internship using Python, Django/Flask, and modern database technologies.', 12, 'intermediate', 2000.00, 0, 2000.00, 25, 'Python basics, Programming fundamentals', 'Django, Flask, PostgreSQL, REST APIs, Testing, Deployment', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500'),

-- UI/UX Design
(uuid_generate_v4(), 'UI Design Internship', 'Learn user interface design principles, design systems, and create stunning visual interfaces for web and mobile.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic design sense, Creativity', 'Figma, Adobe XD, Design Systems, Typography, Color Theory, Prototyping', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),

(uuid_generate_v4(), 'UX Research & Design', 'Comprehensive UX design internship covering user research, wireframing, prototyping, and usability testing.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Design thinking, Basic psychology', 'User Research, Wireframing, Prototyping, Usability Testing, Design Thinking', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500'),

(uuid_generate_v4(), 'Product Design Internship', 'End-to-end product design internship from concept to launch, including user research and visual design.', 12, 'advanced', 2000.00, 0, 2000.00, 20, 'Design portfolio, UX/UI basics', 'Product Strategy, User Journey Mapping, Design Systems, Prototyping, A/B Testing', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500'),

-- Mobile Development
(uuid_generate_v4(), 'iOS Development Internship', 'Native iOS app development using Swift and Xcode. Build real iOS applications for the App Store.', 10, 'intermediate', 22000.00, 15, 18700.00, 25, 'Programming basics, Mac access', 'Swift, Xcode, iOS SDK, Core Data, App Store Deployment', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'),

(uuid_generate_v4(), 'Android Development Internship', 'Native Android development using Kotlin and Android Studio. Create modern Android applications.', 10, 'intermediate', 20000.00, 12, 17600.00, 30, 'Java/Kotlin basics, Programming fundamentals', 'Kotlin, Android Studio, Material Design, Firebase, Play Store Publishing', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=500'),

(uuid_generate_v4(), 'React Native Development', 'Cross-platform mobile development using React Native. Build apps for both iOS and Android.', 8, 'intermediate', 18000.00, 10, 16200.00, 35, 'React basics, JavaScript knowledge', 'React Native, Expo, Navigation, State Management, App Deployment', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500'),

-- Data Science & Analytics
(uuid_generate_v4(), 'Data Science Internship', 'Comprehensive data science internship with Python, covering data analysis, machine learning, and visualization.', 12, 'intermediate', 2000.00, 0, 2000.00, 30, 'Python basics, Statistics fundamentals', 'Python, Pandas, NumPy, Matplotlib, Scikit-learn, Machine Learning', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'),

(uuid_generate_v4(), 'Data Analytics Internship', 'Business-focused data analytics internship using SQL, Excel, and visualization tools for business insights.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic mathematics, Excel knowledge', 'SQL, Excel, Tableau, Power BI, Statistical Analysis, Business Intelligence', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'),

(uuid_generate_v4(), 'Machine Learning Internship', 'Advanced machine learning internship covering algorithms, deep learning, and AI model deployment.', 14, 'advanced', 2000.00, 0, 2000.00, 20, 'Python programming, Statistics, Linear Algebra', 'TensorFlow, PyTorch, Neural Networks, Deep Learning, Model Deployment', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500'),

-- DevOps & Cloud
(uuid_generate_v4(), 'DevOps Engineering Internship', 'Master DevOps practices including CI/CD, containerization, and cloud deployment for modern applications.', 12, 'advanced', 2000.00, 0, 2000.00, 25, 'Linux basics, Programming experience', 'Docker, Kubernetes, Jenkins, AWS, Terraform, Monitoring, Security', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500'),

(uuid_generate_v4(), 'Cloud Computing Internship', 'Comprehensive cloud computing internship with AWS, Azure, and Google Cloud Platform.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Basic networking, Linux knowledge', 'AWS, Azure, GCP, Cloud Architecture, Serverless, Microservices', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'),

-- Cybersecurity
(uuid_generate_v4(), 'Cybersecurity Internship', 'Learn cybersecurity fundamentals, ethical hacking, and security best practices for modern systems.', 10, 'intermediate', 2000.00, 0, 2000.00, 25, 'Basic networking, Security awareness', 'Network Security, Ethical Hacking, Risk Assessment, Security Tools, Compliance', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500'),

(uuid_generate_v4(), 'Penetration Testing Internship', 'Advanced cybersecurity internship focusing on penetration testing and vulnerability assessment.', 12, 'advanced', 2000.00, 0, 2000.00, 20, 'Networking knowledge, Linux experience', 'Penetration Testing, Vulnerability Assessment, Security Auditing, Forensics', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500'),

-- Digital Marketing
(uuid_generate_v4(), 'Digital Marketing Internship', 'Complete digital marketing internship covering SEO, SEM, social media, and analytics.', 8, 'beginner', 2000.00, 0, 2000.00, 50, 'Basic computer knowledge, Communication skills', 'SEO, Google Ads, Facebook Marketing, Content Strategy, Analytics', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'),

(uuid_generate_v4(), 'Social Media Marketing Internship', 'Specialized social media marketing internship focusing on content creation and community management.', 6, 'beginner', 2000.00, 0, 2000.00, 40, 'Social media familiarity, Creativity', 'Social Media Strategy, Content Creation, Community Management, Influencer Marketing', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500'),

-- Content & Writing
(uuid_generate_v4(), 'Content Writing Internship', 'Master content creation, copywriting, and SEO writing for digital platforms and marketing.', 6, 'beginner', 2000.00, 0, 2000.00, 45, 'Good English skills, Writing ability', 'Content Strategy, SEO Writing, Copywriting, Blog Writing, Social Media Content', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500'),

(uuid_generate_v4(), 'Technical Writing Internship', 'Specialized technical writing internship for documentation, API guides, and technical content.', 8, 'intermediate', 2000.00, 0, 2000.00, 25, 'Technical background, Writing skills', 'Technical Documentation, API Documentation, User Guides, Technical Blogging', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500'),

-- Business & Finance
(uuid_generate_v4(), 'Business Analytics Internship', 'Business-focused analytics internship covering market research, financial analysis, and business intelligence.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Business fundamentals, Excel knowledge', 'Business Intelligence, Financial Analysis, Market Research, Data Visualization', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500'),

(uuid_generate_v4(), 'Financial Technology Internship', 'FinTech internship covering financial systems, blockchain, and digital payment technologies.', 12, 'advanced', 2000.00, 0, 2000.00, 20, 'Finance basics, Programming knowledge', 'Financial Systems, Blockchain, Payment Gateways, Risk Management, Compliance', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500'),

-- Game Development
(uuid_generate_v4(), 'Game Development Internship', 'Create engaging games using Unity engine and C# programming for multiple platforms.', 12, 'intermediate', 2000.00, 0, 2000.00, 25, 'Programming basics, Game interest', 'Unity Engine, C# Programming, Game Physics, 2D/3D Development, Publishing', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500'),

(uuid_generate_v4(), 'Game Design Internship', 'Game design internship focusing on game mechanics, level design, and player experience.', 10, 'beginner', 2000.00, 0, 2000.00, 30, 'Creativity, Game knowledge', 'Game Design, Level Design, Game Mechanics, Storytelling, Player Psychology', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500'),

-- Blockchain & Web3
(uuid_generate_v4(), 'Blockchain Development Internship', 'Master blockchain technology and smart contract development for decentralized applications.', 14, 'advanced', 2000.00, 0, 2000.00, 20, 'Programming experience, JavaScript/Solidity', 'Blockchain fundamentals, Solidity, Smart Contracts, DApps, Web3', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500'),

(uuid_generate_v4(), 'Web3 Development Internship', 'Build decentralized applications using modern Web3 technologies and frameworks.', 12, 'advanced', 2000.00, 0, 2000.00, 15, 'React knowledge, Blockchain basics', 'Web3.js, Ethers.js, DApp Development, MetaMask Integration, IPFS', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500')
ON CONFLICT DO NOTHING;

-- Insert sample student enrollments
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
ON CONFLICT DO NOTHING;

-- Insert sample orders
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
ON CONFLICT DO NOTHING;

-- Insert sample payments
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
ON CONFLICT DO NOTHING;
