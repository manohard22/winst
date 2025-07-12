-- Enhanced dummy data for referral, assessment, and project features

-- Insert sample assessment questions for Full Stack Development program
DO $$
DECLARE
    fullstack_program_id UUID;
    react_program_id UUID;
    python_program_id UUID;
BEGIN
    -- Get program IDs
    SELECT id INTO fullstack_program_id FROM internship_programs WHERE title = 'Full Stack Web Development with MERN' LIMIT 1;
    SELECT id INTO react_program_id FROM internship_programs WHERE title = 'Frontend Development with React' LIMIT 1;
    SELECT id INTO python_program_id FROM internship_programs WHERE title = 'Backend Development with Python Django' LIMIT 1;

    -- Insert assessment questions for Full Stack Development
    IF fullstack_program_id IS NOT NULL THEN
        INSERT INTO assessment_questions (program_id, question_text, question_type, options, correct_answer, points, difficulty_level, order_index) VALUES
        (fullstack_program_id, 'What does MERN stack stand for?', 'multiple_choice', '["MongoDB, Express, React, Node.js", "MySQL, Express, React, Node.js", "MongoDB, Express, Redux, Node.js", "MongoDB, Express, React, Next.js"]', 'MongoDB, Express, React, Node.js', 1, 'easy', 1),
        (fullstack_program_id, 'Which HTTP method is used to create a new resource?', 'multiple_choice', '["GET", "POST", "PUT", "DELETE"]', 'POST', 1, 'easy', 2),
        (fullstack_program_id, 'What is JSX in React?', 'multiple_choice', '["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"]', 'JavaScript XML', 1, 'medium', 3),
        (fullstack_program_id, 'Which database is commonly used in MERN stack?', 'multiple_choice', '["MySQL", "PostgreSQL", "MongoDB", "SQLite"]', 'MongoDB', 1, 'easy', 4),
        (fullstack_program_id, 'What is the purpose of middleware in Express.js?', 'multiple_choice', '["To handle database connections", "To process requests between client and server", "To manage React components", "To style web pages"]', 'To process requests between client and server', 1, 'medium', 5),
        (fullstack_program_id, 'Which hook is used for state management in React?', 'multiple_choice', '["useEffect", "useState", "useContext", "useReducer"]', 'useState', 1, 'medium', 6),
        (fullstack_program_id, 'What is REST API?', 'multiple_choice', '["Representational State Transfer", "Real Estate State Transfer", "Reactive State Transfer", "Remote State Transfer"]', 'Representational State Transfer', 1, 'medium', 7),
        (fullstack_program_id, 'Which command is used to create a new React app?', 'multiple_choice', '["npm create react-app", "npx create-react-app", "npm install react-app", "npx install react-app"]', 'npx create-react-app', 1, 'easy', 8),
        (fullstack_program_id, 'What is the default port for MongoDB?', 'multiple_choice', '["3000", "5000", "27017", "8080"]', '27017', 1, 'medium', 9),
        (fullstack_program_id, 'Which method is used to handle asynchronous operations in JavaScript?', 'multiple_choice', '["Callbacks", "Promises", "Async/Await", "All of the above"]', 'All of the above', 1, 'hard', 10),
        (fullstack_program_id, 'What is the purpose of package.json file?', 'multiple_choice', '["To store project metadata and dependencies", "To configure database", "To style components", "To handle routing"]', 'To store project metadata and dependencies', 1, 'easy', 11),
        (fullstack_program_id, 'Which CSS framework is commonly used with React?', 'multiple_choice', '["Bootstrap", "Tailwind CSS", "Material-UI", "All of the above"]', 'All of the above', 1, 'medium', 12),
        (fullstack_program_id, 'What is CORS in web development?', 'multiple_choice', '["Cross-Origin Resource Sharing", "Cross-Origin Request Security", "Cross-Origin Resource Security", "Cross-Origin Request Sharing"]', 'Cross-Origin Resource Sharing', 1, 'hard', 13),
        (fullstack_program_id, 'Which tool is used for version control?', 'multiple_choice', '["Git", "NPM", "Webpack", "Babel"]', 'Git', 1, 'easy', 14),
        (fullstack_program_id, 'What is the purpose of useEffect hook in React?', 'multiple_choice', '["To manage state", "To handle side effects", "To create components", "To style elements"]', 'To handle side effects', 1, 'hard', 15);
    END IF;

    -- Insert project requirements for Full Stack Development
    IF fullstack_program_id IS NOT NULL THEN
        INSERT INTO project_requirements (program_id, title, description, requirements, deliverables, evaluation_criteria, estimated_duration_weeks) VALUES
        (fullstack_program_id, 'E-Commerce Web Application', 
         'Build a complete e-commerce web application using MERN stack with user authentication, product management, shopping cart, and payment integration.',
         'Requirements:
1. User Authentication (Register, Login, Logout)
2. Product Catalog with search and filtering
3. Shopping Cart functionality
4. Order Management system
5. Admin panel for product management
6. Responsive design for mobile and desktop
7. Payment gateway integration (test mode)
8. User profile management
9. Order history and tracking
10. Product reviews and ratings',
         'Deliverables:
1. Complete source code on GitHub
2. Live demo deployed on Netlify/Vercel (frontend) and Heroku/Railway (backend)
3. README.md with setup instructions
4. API documentation
5. Database schema documentation
6. Video demonstration (5-10 minutes)
7. Technical documentation explaining architecture',
         'Evaluation Criteria:
1. Code Quality and Organization (20%)
2. Functionality and Features (30%)
3. User Interface and Experience (20%)
4. Database Design (15%)
5. Documentation Quality (10%)
6. Deployment and Demo (5%)',
         4);
    END IF;

    -- Insert project requirements for React program
    IF react_program_id IS NOT NULL THEN
        INSERT INTO project_requirements (program_id, title, description, requirements, deliverables, evaluation_criteria, estimated_duration_weeks) VALUES
        (react_program_id, 'Task Management Dashboard', 
         'Create a comprehensive task management dashboard using React with advanced features like drag-and-drop, real-time updates, and data visualization.',
         'Requirements:
1. Task creation, editing, and deletion
2. Drag and drop functionality for task organization
3. Task categories and priority levels
4. Search and filtering capabilities
5. Data visualization with charts
6. Responsive design
7. Local storage for data persistence
8. Dark/Light theme toggle
9. Export functionality (PDF/CSV)
10. Performance optimization',
         'Deliverables:
1. Complete React application source code
2. Live demo deployment
3. Component documentation
4. User guide
5. Performance analysis report
6. Video walkthrough',
         'Evaluation Criteria:
1. React Best Practices (25%)
2. User Interface Design (25%)
3. Functionality Implementation (25%)
4. Code Organization (15%)
5. Documentation (10%)',
         3);
    END IF;

    -- Insert project requirements for Python program
    IF python_program_id IS NOT NULL THEN
        INSERT INTO project_requirements (program_id, title, description, requirements, deliverables, evaluation_criteria, estimated_duration_weeks) VALUES
        (python_program_id, 'RESTful API with Django', 
         'Develop a comprehensive RESTful API using Django REST Framework for a blog platform with advanced features.',
         'Requirements:
1. User authentication and authorization
2. CRUD operations for blog posts
3. Comment system with nested replies
4. Category and tag management
5. Search functionality
6. Pagination and filtering
7. File upload for images
8. Email notifications
9. API rate limiting
10. Comprehensive testing',
         'Deliverables:
1. Django project source code
2. API documentation (Swagger/Postman)
3. Database migrations
4. Unit and integration tests
5. Deployment configuration
6. Performance benchmarks
7. Security analysis report',
         'Evaluation Criteria:
1. API Design and Implementation (30%)
2. Database Design (20%)
3. Security Implementation (20%)
4. Testing Coverage (15%)
5. Documentation Quality (15%)',
         4);
    END IF;
END $$;

-- Insert sample referral codes
INSERT INTO referrals (referrer_id, referred_email, referral_code, status, expires_at) 
SELECT 
    u.id,
    'friend' || generate_random_uuid()::text || '@example.com',
    'REF' || UPPER(substring(generate_random_uuid()::text, 1, 8)),
    'pending',
    CURRENT_TIMESTAMP + INTERVAL '30 days'
FROM users u WHERE u.role = 'student' LIMIT 5;

-- Insert sample affiliate accounts
INSERT INTO affiliates (user_id, affiliate_code, total_referrals, total_earnings)
SELECT 
    u.id,
    'AFF' || UPPER(substring(generate_random_uuid()::text, 1, 8)),
    floor(random() * 10)::integer,
    floor(random() * 5000)::decimal(10,2)
FROM users u WHERE u.role = 'student' LIMIT 3;
