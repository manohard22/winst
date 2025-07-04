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

-- Insert sample internship programs with varied pricing
INSERT INTO internship_programs (id, title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, requirements, learning_outcomes, image_url) VALUES
(uuid_generate_v4(), 'Full Stack Web Development', 'Complete full-stack development program covering React, Node.js, and databases. Build real-world projects and gain industry experience.', 12, 'intermediate', 25000.00, 20, 20000.00, 50, 'Basic knowledge of HTML, CSS, JavaScript', 'Master React, Node.js, Express, MongoDB, RESTful APIs, Authentication, Deployment', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),
(uuid_generate_v4(), 'Python Data Science', 'Comprehensive data science program with Python, covering data analysis, machine learning, and visualization.', 10, 'beginner', 18000.00, 15, 15300.00, 40, 'Basic programming knowledge', 'Python fundamentals, Pandas, NumPy, Matplotlib, Scikit-learn, Machine Learning basics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'),
(uuid_generate_v4(), 'Mobile App Development', 'Learn to build cross-platform mobile applications using React Native and modern development practices.', 8, 'intermediate', 15000.00, 10, 13500.00, 30, 'JavaScript knowledge, React basics', 'React Native, Mobile UI/UX, API integration, App deployment, Performance optimization', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'),
(uuid_generate_v4(), 'DevOps Engineering', 'Master DevOps practices including CI/CD, containerization, and cloud deployment.', 14, 'advanced', 30000.00, 25, 22500.00, 25, 'Linux basics, Programming experience', 'Docker, Kubernetes, Jenkins, AWS, Terraform, Monitoring, Security', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500'),
(uuid_generate_v4(), 'UI/UX Design', 'Learn user interface and user experience design principles with hands-on projects.', 6, 'beginner', 12000.00, 30, 8400.00, 35, 'Basic design sense, Creativity', 'Figma, Adobe XD, Design thinking, Prototyping, User research, Usability testing', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),
(uuid_generate_v4(), 'Digital Marketing', 'Complete digital marketing course covering SEO, SEM, social media, and analytics.', 8, 'beginner', 10000.00, 0, 10000.00, 60, 'Basic computer knowledge', 'SEO, Google Ads, Facebook Marketing, Content Strategy, Analytics', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'),
(uuid_generate_v4(), 'Cybersecurity Fundamentals', 'Learn cybersecurity basics, ethical hacking, and security best practices.', 10, 'intermediate', 20000.00, 15, 17000.00, 30, 'Basic networking knowledge', 'Network Security, Ethical Hacking, Risk Assessment, Security Tools', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500'),
(uuid_generate_v4(), 'Blockchain Development', 'Master blockchain technology and smart contract development.', 12, 'advanced', 35000.00, 20, 28000.00, 20, 'Programming experience, JavaScript', 'Blockchain fundamentals, Solidity, Smart Contracts, DApps, Web3', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500')
ON CONFLICT DO NOTHING;
