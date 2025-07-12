-- Lucro Internship Portal Dummy Data
-- Insert sample data for testing and development

-- Clear existing data first
TRUNCATE TABLE task_submissions, tasks, student_internship, payments, orders, program_technologies, internship_programs, technologies RESTART IDENTITY CASCADE;

-- Insert Technologies
INSERT INTO technologies (id, name, category, description, icon_url) VALUES
(uuid_generate_v4(), 'React', 'Frontend', 'A JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
(uuid_generate_v4(), 'Vue.js', 'Frontend', 'Progressive JavaScript framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'),
(uuid_generate_v4(), 'Angular', 'Frontend', 'Platform for building mobile and desktop web applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'),
(uuid_generate_v4(), 'Node.js', 'Backend', 'JavaScript runtime built on Chrome V8 engine', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
(uuid_generate_v4(), 'Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
(uuid_generate_v4(), 'Java', 'Backend', 'Object-oriented programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'),
(uuid_generate_v4(), '.NET', 'Backend', 'Microsoft development platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg'),
(uuid_generate_v4(), 'JavaScript', 'Programming Language', 'Dynamic programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'),
(uuid_generate_v4(), 'TypeScript', 'Programming Language', 'Typed superset of JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
(uuid_generate_v4(), 'PostgreSQL', 'Database', 'Open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
(uuid_generate_v4(), 'MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
(uuid_generate_v4(), 'MySQL', 'Database', 'Relational database management system', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'),
(uuid_generate_v4(), 'Express.js', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'),
(uuid_generate_v4(), 'Django', 'Backend', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg'),
(uuid_generate_v4(), 'Flask', 'Backend', 'Lightweight Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg'),
(uuid_generate_v4(), 'Spring Boot', 'Backend', 'Java framework for building applications', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'),
(uuid_generate_v4(), 'Tailwind CSS', 'Frontend', 'Utility-first CSS framework', 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg'),
(uuid_generate_v4(), 'Bootstrap', 'Frontend', 'CSS framework for responsive design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg'),
(uuid_generate_v4(), 'Docker', 'DevOps', 'Containerization platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
(uuid_generate_v4(), 'Kubernetes', 'DevOps', 'Container orchestration platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg'),
(uuid_generate_v4(), 'AWS', 'Cloud', 'Amazon Web Services', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg'),
(uuid_generate_v4(), 'Azure', 'Cloud', 'Microsoft cloud platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg'),
(uuid_generate_v4(), 'Google Cloud', 'Cloud', 'Google cloud platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg'),
(uuid_generate_v4(), 'React Native', 'Mobile', 'Framework for building mobile apps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
(uuid_generate_v4(), 'Flutter', 'Mobile', 'UI toolkit for building mobile apps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'),
(uuid_generate_v4(), 'Swift', 'Mobile', 'Programming language for iOS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg'),
(uuid_generate_v4(), 'Kotlin', 'Mobile', 'Programming language for Android', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg'),
(uuid_generate_v4(), 'Figma', 'Design', 'Design and prototyping tool', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'),
(uuid_generate_v4(), 'Adobe XD', 'Design', 'User experience design software', 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg'),
(uuid_generate_v4(), 'TensorFlow', 'AI/ML', 'Machine learning framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'),
(uuid_generate_v4(), 'PyTorch', 'AI/ML', 'Deep learning framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg'),
(uuid_generate_v4(), 'Pandas', 'Data Science', 'Data manipulation library', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg'),
(uuid_generate_v4(), 'NumPy', 'Data Science', 'Numerical computing library', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive internship programs (All priced at ₹2000)
INSERT INTO internship_programs (id, title, description, duration_weeks, difficulty_level, price, discount_percentage, final_price, max_participants, requirements, learning_outcomes, image_url) VALUES
-- Full Stack Development
(uuid_generate_v4(), 'Full Stack Web Development with MERN', 'Master the complete MERN stack (MongoDB, Express.js, React, Node.js) through hands-on projects. Build 3 production-ready applications including an e-commerce platform, social media dashboard, and real-time chat application.', 12, 'intermediate', 2000.00, 0, 2000.00, 50, 'Basic knowledge of HTML, CSS, JavaScript', 'React.js, Node.js, Express.js, MongoDB, RESTful APIs, JWT Authentication, State Management, Deployment, Git Version Control', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'),

(uuid_generate_v4(), 'Full Stack Development with React + .NET', 'Learn modern full-stack development using React frontend with .NET Core backend. Build enterprise-grade applications with proper architecture, security, and scalability patterns.', 14, 'advanced', 2000.00, 0, 2000.00, 30, 'Basic programming knowledge, C# fundamentals', 'React.js, .NET Core, Entity Framework, SQL Server, Web APIs, Authentication, Clean Architecture', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500'),

(uuid_generate_v4(), 'Full Stack Development with Vue + Laravel', 'Comprehensive full-stack development using Vue.js frontend and Laravel PHP backend. Focus on rapid development and modern PHP practices.', 10, 'intermediate', 2000.00, 0, 2000.00, 35, 'Basic web development knowledge', 'Vue.js, Laravel, PHP, MySQL, Eloquent ORM, Vuex, API Development', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500'),

-- Frontend Development
(uuid_generate_v4(), 'Frontend Development with React', 'Become a React expert with advanced concepts like hooks, context, state management, and performance optimization. Build responsive, interactive web applications with modern tools.', 10, 'intermediate', 2000.00, 0, 2000.00, 40, 'HTML, CSS, JavaScript fundamentals', 'Advanced React, Redux Toolkit, TypeScript, Next.js, Responsive Design, Performance Optimization, Testing', 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500'),

(uuid_generate_v4(), 'Frontend Development with Vue.js', 'Master Vue.js ecosystem including Vuex for state management, Vue Router for navigation, and component composition. Build modern single-page applications with Vue 3.', 8, 'beginner', 2000.00, 0, 2000.00, 35, 'Basic JavaScript knowledge', 'Vue.js 3, Vuex, Vue Router, Component Design, Composition API, Frontend Testing, Nuxt.js', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500'),

(uuid_generate_v4(), 'Frontend Development with Angular', 'Comprehensive Angular development covering components, services, routing, and state management. Build enterprise-level applications with TypeScript.', 12, 'intermediate', 2000.00, 0, 2000.00, 30, 'TypeScript basics, Object-oriented programming', 'Angular 15+, TypeScript, RxJS, NgRx, Angular Material, Testing with Jasmine', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500'),

-- Backend Development
(uuid_generate_v4(), 'Backend Development with Node.js', 'Master server-side development with Node.js and Express. Learn database design, API development, authentication, and deployment strategies for scalable applications.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'JavaScript fundamentals, Basic programming concepts', 'Node.js, Express.js, MongoDB, PostgreSQL, API Development, JWT Authentication, Testing, Microservices', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500'),

(uuid_generate_v4(), 'Backend Development with Python Django', 'Comprehensive backend development using Django framework. Learn to build robust, scalable web applications with Python''s most popular web framework.', 12, 'intermediate', 2000.00, 0, 2000.00, 25, 'Python basics, Programming fundamentals', 'Django, Django REST Framework, PostgreSQL, Redis, Celery, Testing, Deployment', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500'),

(uuid_generate_v4(), 'Backend Development with Java Spring Boot', 'Learn enterprise Java development with Spring Boot. Build production-ready applications with proper architecture, security, and testing practices.', 14, 'advanced', 2000.00, 0, 2000.00, 20, 'Java fundamentals, Object-oriented programming', 'Spring Boot, Spring Security, JPA/Hibernate, MySQL, Microservices, Testing, Docker', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500'),

-- UI/UX Design
(uuid_generate_v4(), 'UI/UX Design Mastery', 'Learn complete user interface and experience design process. Master design tools, user research, wireframing, prototyping, and design systems creation.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic design sense, Creativity', 'Figma, Adobe XD, Design Systems, Typography, Color Theory, User Research, Prototyping, Usability Testing', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'),

(uuid_generate_v4(), 'UX Research & Design', 'Deep dive into user experience design with focus on research methodologies, user testing, and data-driven design decisions for better user experiences.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Design thinking basics, Psychology interest', 'User Research, Wireframing, Prototyping, Usability Testing, Design Thinking, Analytics, A/B Testing', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500'),

-- Mobile Development
(uuid_generate_v4(), 'iOS Development with Swift', 'Native iOS app development using Swift and Xcode. Build real iOS applications with modern iOS features, Core Data, and App Store deployment.', 10, 'intermediate', 2000.00, 0, 2000.00, 25, 'Programming basics, Mac access recommended', 'Swift, Xcode, iOS SDK, Core Data, SwiftUI, UIKit, App Store Deployment, iOS Design Patterns', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'),

(uuid_generate_v4(), 'Android Development with Kotlin', 'Native Android development using Kotlin and Android Studio. Create modern Android applications with Material Design and Google Play Store publishing.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Java/Kotlin basics, Programming fundamentals', 'Kotlin, Android Studio, Material Design, Room Database, Firebase, Play Store Publishing, MVVM Architecture', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=500'),

(uuid_generate_v4(), 'React Native Development', 'Cross-platform mobile development using React Native. Build apps for both iOS and Android with single codebase, focusing on performance and native features.', 8, 'intermediate', 2000.00, 0, 2000.00, 35, 'React basics, JavaScript knowledge', 'React Native, Expo, Navigation, State Management, Native Modules, App Deployment, Performance Optimization', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500'),

(uuid_generate_v4(), 'Flutter Development', 'Build beautiful, natively compiled applications for mobile using Flutter and Dart. Learn to create high-performance apps with stunning UI.', 10, 'beginner', 2000.00, 0, 2000.00, 30, 'Basic programming knowledge', 'Flutter, Dart, Material Design, State Management, Firebase, App Store Deployment, Widget Development', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500'),

-- Data Science & Analytics
(uuid_generate_v4(), 'Data Science with Python', 'Comprehensive data science program covering data analysis, machine learning, and visualization. Work with real datasets and build predictive models.', 12, 'intermediate', 2000.00, 0, 2000.00, 30, 'Python basics, Statistics fundamentals', 'Python, Pandas, NumPy, Matplotlib, Scikit-learn, Machine Learning, Data Visualization, Jupyter Notebooks', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'),

(uuid_generate_v4(), 'Data Analytics with SQL & Tableau', 'Business-focused data analytics using SQL, Excel, and visualization tools. Learn to derive business insights from data and create compelling dashboards.', 8, 'beginner', 2000.00, 0, 2000.00, 40, 'Basic mathematics, Excel knowledge', 'SQL, Excel, Tableau, Power BI, Statistical Analysis, Business Intelligence, Data Storytelling', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'),

(uuid_generate_v4(), 'Machine Learning & AI', 'Advanced machine learning program covering algorithms, deep learning, and AI model deployment in production environments.', 14, 'advanced', 2000.00, 0, 2000.00, 20, 'Python programming, Statistics, Linear Algebra', 'TensorFlow, PyTorch, Neural Networks, Deep Learning, Model Deployment, MLOps, Computer Vision, NLP', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500'),

-- DevOps & Cloud
(uuid_generate_v4(), 'DevOps Engineering', 'Master DevOps practices including CI/CD pipelines, containerization, and cloud deployment for scalable, reliable applications.', 12, 'advanced', 2000.00, 0, 2000.00, 25, 'Linux basics, Programming experience', 'Docker, Kubernetes, Jenkins, AWS, Terraform, Monitoring, Security, GitOps', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500'),

(uuid_generate_v4(), 'Cloud Computing with AWS', 'Comprehensive cloud computing program with hands-on experience in Amazon Web Services. Learn to design and deploy scalable cloud solutions.', 10, 'intermediate', 2000.00, 0, 2000.00, 30, 'Basic networking, Linux knowledge', 'AWS Services, EC2, S3, RDS, Lambda, CloudFormation, Security, Cost Optimization', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'),

-- Cybersecurity
(uuid_generate_v4(), 'Cybersecurity Fundamentals', 'Learn cybersecurity fundamentals including network security, ethical hacking, and security best practices for modern systems and applications.', 10, 'intermediate', 2000.00, 0, 2000.00, 25, 'Basic networking, Security awareness', 'Network Security, Ethical Hacking, Risk Assessment, Security Tools, Compliance, Incident Response', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500'),

-- Digital Marketing
(uuid_generate_v4(), 'Digital Marketing Mastery', 'Complete digital marketing program covering SEO, SEM, social media marketing, content strategy, and analytics for business growth.', 8, 'beginner', 2000.00, 0, 2000.00, 50, 'Basic computer knowledge, Communication skills', 'SEO, Google Ads, Facebook Marketing, Content Strategy, Analytics, Email Marketing, Social Media Management', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500')
ON CONFLICT DO NOTHING;

-- Link technologies to programs
DO $$
DECLARE
    react_id UUID;
    node_id UUID;
    python_id UUID;
    java_id UUID;
    vue_id UUID;
    angular_id UUID;
    dotnet_id UUID;
    laravel_id UUID;
    swift_id UUID;
    kotlin_id UUID;
    flutter_id UUID;
    figma_id UUID;
    tensorflow_id UUID;
    aws_id UUID;
    docker_id UUID;
    
    mern_program_id UUID;
    react_dotnet_program_id UUID;
    vue_laravel_program_id UUID;
    react_program_id UUID;
    vue_program_id UUID;
    angular_program_id UUID;
    node_program_id UUID;
    python_program_id UUID;
    java_program_id UUID;
    ui_ux_program_id UUID;
    ios_program_id UUID;
    android_program_id UUID;
    react_native_program_id UUID;
    flutter_program_id UUID;
    data_science_program_id UUID;
    ml_program_id UUID;
    devops_program_id UUID;
    aws_program_id UUID;
    cybersecurity_program_id UUID;
    marketing_program_id UUID;
BEGIN
    -- Get technology IDs
    SELECT id INTO react_id FROM technologies WHERE name = 'React';
    SELECT id INTO node_id FROM technologies WHERE name = 'Node.js';
    SELECT id INTO python_id FROM technologies WHERE name = 'Python';
    SELECT id INTO java_id FROM technologies WHERE name = 'Java';
    SELECT id INTO vue_id FROM technologies WHERE name = 'Vue.js';
    SELECT id INTO angular_id FROM technologies WHERE name = 'Angular';
    SELECT id INTO dotnet_id FROM technologies WHERE name = '.NET';
    SELECT id INTO swift_id FROM technologies WHERE name = 'Swift';
    SELECT id INTO kotlin_id FROM technologies WHERE name = 'Kotlin';
    SELECT id INTO flutter_id FROM technologies WHERE name = 'Flutter';
    SELECT id INTO figma_id FROM technologies WHERE name = 'Figma';
    SELECT id INTO tensorflow_id FROM technologies WHERE name = 'TensorFlow';
    SELECT id INTO aws_id FROM technologies WHERE name = 'AWS';
    SELECT id INTO docker_id FROM technologies WHERE name = 'Docker';
    
    -- Get program IDs
    SELECT id INTO mern_program_id FROM internship_programs WHERE title = 'Full Stack Web Development with MERN';
    SELECT id INTO react_dotnet_program_id FROM internship_programs WHERE title = 'Full Stack Development with React + .NET';
    SELECT id INTO vue_laravel_program_id FROM internship_programs WHERE title = 'Full Stack Development with Vue + Laravel';
    SELECT id INTO react_program_id FROM internship_programs WHERE title = 'Frontend Development with React';
    SELECT id INTO vue_program_id FROM internship_programs WHERE title = 'Frontend Development with Vue.js';
    SELECT id INTO angular_program_id FROM internship_programs WHERE title = 'Frontend Development with Angular';
    SELECT id INTO node_program_id FROM internship_programs WHERE title = 'Backend Development with Node.js';
    SELECT id INTO python_program_id FROM internship_programs WHERE title = 'Backend Development with Python Django';
    SELECT id INTO java_program_id FROM internship_programs WHERE title = 'Backend Development with Java Spring Boot';
    SELECT id INTO ui_ux_program_id FROM internship_programs WHERE title = 'UI/UX Design Mastery';
    SELECT id INTO ios_program_id FROM internship_programs WHERE title = 'iOS Development with Swift';
    SELECT id INTO android_program_id FROM internship_programs WHERE title = 'Android Development with Kotlin';
    SELECT id INTO react_native_program_id FROM internship_programs WHERE title = 'React Native Development';
    SELECT id INTO flutter_program_id FROM internship_programs WHERE title = 'Flutter Development';
    SELECT id INTO data_science_program_id FROM internship_programs WHERE title = 'Data Science with Python';
    SELECT id INTO ml_program_id FROM internship_programs WHERE title = 'Machine Learning & AI';
    SELECT id INTO devops_program_id FROM internship_programs WHERE title = 'DevOps Engineering';
    SELECT id INTO aws_program_id FROM internship_programs WHERE title = 'Cloud Computing with AWS';
    
    -- Link technologies to programs
    IF mern_program_id IS NOT NULL AND react_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (mern_program_id, react_id, true);
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (mern_program_id, node_id, true);
    END IF;
    
    IF react_dotnet_program_id IS NOT NULL AND react_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (react_dotnet_program_id, react_id, true);
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (react_dotnet_program_id, dotnet_id, true);
    END IF;
    
    IF vue_laravel_program_id IS NOT NULL AND vue_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (vue_laravel_program_id, vue_id, true);
    END IF;
    
    IF react_program_id IS NOT NULL AND react_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (react_program_id, react_id, true);
    END IF;
    
    IF vue_program_id IS NOT NULL AND vue_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (vue_program_id, vue_id, true);
    END IF;
    
    IF angular_program_id IS NOT NULL AND angular_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (angular_program_id, angular_id, true);
    END IF;
    
    IF node_program_id IS NOT NULL AND node_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (node_program_id, node_id, true);
    END IF;
    
    IF python_program_id IS NOT NULL AND python_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (python_program_id, python_id, true);
    END IF;
    
    IF java_program_id IS NOT NULL AND java_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (java_program_id, java_id, true);
    END IF;
    
    IF ui_ux_program_id IS NOT NULL AND figma_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (ui_ux_program_id, figma_id, true);
    END IF;
    
    IF ios_program_id IS NOT NULL AND swift_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (ios_program_id, swift_id, true);
    END IF;
    
    IF android_program_id IS NOT NULL AND kotlin_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (android_program_id, kotlin_id, true);
    END IF;
    
    IF react_native_program_id IS NOT NULL AND react_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (react_native_program_id, react_id, true);
    END IF;
    
    IF flutter_program_id IS NOT NULL AND flutter_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (flutter_program_id, flutter_id, true);
    END IF;
    
    IF data_science_program_id IS NOT NULL AND python_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (data_science_program_id, python_id, true);
    END IF;
    
    IF ml_program_id IS NOT NULL AND tensorflow_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (ml_program_id, tensorflow_id, true);
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (ml_program_id, python_id, true);
    END IF;
    
    IF devops_program_id IS NOT NULL AND docker_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (devops_program_id, docker_id, true);
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (devops_program_id, aws_id, false);
    END IF;
    
    IF aws_program_id IS NOT NULL AND aws_id IS NOT NULL THEN
        INSERT INTO program_technologies (program_id, technology_id, is_primary) VALUES (aws_program_id, aws_id, true);
    END IF;
    
END $$;
