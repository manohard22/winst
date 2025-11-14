-- =============================================================================
-- 🎯 COMPREHENSIVE COURSE ASSIGNMENTS (10 per course)
-- Real-world practical scenarios from basic to intermediate level
-- =============================================================================

-- =============================================================================
-- 1️⃣ FULL STACK MERN DEVELOPMENT (10 Assignments)
-- =============================================================================

INSERT INTO tasks (program_id, title, description, task_type, difficulty_level, max_points, due_date, instructions, is_mandatory, order_index) VALUES

-- Week 1-2: Basics
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'), 
 'Setup Development Environment', 
 'Configure your MERN development environment with Node.js, npm, and Git',
 'assignment', 'easy', 15, '2025-01-25 23:59:59',
 'Install Node.js, npm, Git. Create a GitHub account. Setup VS Code with essential extensions. Create your first repository and push a README file. Document the setup process in a markdown file.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Build a JavaScript Calculator App',
 'Create a functional calculator using vanilla JavaScript with basic operations',
 'assignment', 'easy', 20, '2025-02-01 23:59:59',
 'Build a calculator that supports +, -, *, / operations. Include decimal support. Add CSS styling. Test with various inputs. Implement error handling for invalid operations. Deploy to GitHub Pages.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Create a Todo App with HTML/CSS/JS',
 'Build a dynamic todo application with add, delete, and mark complete functionality',
 'assignment', 'easy', 25, '2025-02-05 23:59:59',
 'Create todo management app. Store todos in localStorage. Implement add, delete, edit, toggle complete. Add filtering (all/completed/pending). Create responsive design. Style with CSS Grid/Flexbox.',
 true, 3),

-- Week 3-4: React
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'React Component Library Creation',
 'Build reusable React components for common UI patterns',
 'assignment', 'medium', 35, '2025-02-15 23:59:59',
 'Create Button, Card, Modal, and Form components. Use PropTypes for validation. Implement CSS modules for styling. Write component documentation. Create a Storybook story for each component. Include hover/active states.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Build a Product Listing Page',
 'Create a React product listing with filtering, sorting, and search functionality',
 'assignment', 'medium', 40, '2025-02-20 23:59:59',
 'Fetch products from public API (JSONPlaceholder or similar). Implement search by product name/category. Add sorting (price, name, rating). Create filter by category/price range. Use React hooks. Add pagination. Style with Tailwind CSS.',
 true, 5),

-- Week 5-6: Node.js/Express
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Build a RESTful User Management API',
 'Create Express.js API for user CRUD operations with validation',
 'assignment', 'medium', 40, '2025-03-01 23:59:59',
 'Create endpoints: POST /users (create), GET /users (list), GET /users/:id (get one), PUT /users/:id (update), DELETE /users/:id (delete). Implement input validation using express-validator. Add error handling middleware. Use proper HTTP status codes. Write API documentation.',
 true, 6),

-- Week 7-8: MongoDB/Database
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Design and Implement MongoDB Collections',
 'Design schema and create MongoDB collections for an e-commerce system',
 'assignment', 'medium', 35, '2025-03-10 23:59:59',
 'Design collections: users, products, orders, reviews. Define relationships and indexes. Create sample data (100+ documents). Implement MongoDB connection. Write queries for common operations. Create aggregation pipelines for reports.',
 true, 7),

-- Week 9-10: Full Stack Integration
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Implement JWT Authentication System',
 'Build complete authentication with JWT tokens, refresh tokens, and secure password hashing',
 'assignment', 'hard', 50, '2025-03-20 23:59:59',
 'Create user registration endpoint with bcrypt password hashing. Implement login with JWT tokens. Create refresh token rotation. Add protected routes middleware. Implement logout functionality. Create frontend login/signup forms with React. Handle token storage securely.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'Build a Full Blog Platform (CRUD)',
 'Create complete blog application with user authentication, CRUD operations, and comments',
 'assignment', 'hard', 60, '2025-03-30 23:59:59',
 'Create blog posts with title, content, author, tags. Implement user authentication. Add create, read, update, delete posts. Implement comment system. Add search and filter by tags. Create admin dashboard. Add rich text editor. Write unit tests.',
 true, 9),

-- Capstone
((SELECT id FROM internship_programs WHERE slug = 'full-stack-mern-development'),
 'E-Commerce Application Capstone Project',
 'Build a complete e-commerce platform combining all learned concepts',
 'project', 'hard', 100, '2025-04-15 23:59:59',
 'Build product catalog with filtering/search. Implement shopping cart with persistence. Create checkout process. Implement payment gateway integration. Build user dashboard with order history. Add admin panel for inventory. Deploy full stack. Write comprehensive documentation.',
 true, 10),

-- =============================================================================
-- 2️⃣ FRONTEND DEVELOPMENT WITH REACT (10 Assignments)
-- =============================================================================

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'React Hooks Deep Dive',
 'Understand and practice useState, useEffect, useContext, useReducer hooks',
 'assignment', 'easy', 25, '2025-02-08 23:59:59',
 'Create components demonstrating useState, useEffect lifecycle. Build custom hook for API calls. Implement useContext for theme switching. Build counter with useReducer. Document each hook with examples. Create interactive examples.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'State Management with Context API',
 'Implement global state management using Context API instead of Redux',
 'assignment', 'medium', 35, '2025-02-15 23:59:59',
 'Create UserContext for authentication state. Create ThemeContext for dark/light mode. Create LanguageContext for i18n. Build consumer components. Implement state persistence. Add context middleware patterns. Compare with Redux benefits.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Build a Dashboard with Multiple Views',
 'Create a responsive dashboard with React Router and dynamic layouts',
 'assignment', 'medium', 40, '2025-02-22 23:59:59',
 'Create routes: /dashboard, /users, /analytics, /settings. Build responsive sidebar navigation. Implement breadcrumbs. Add route transitions. Create 404 page. Implement lazy loading with React.lazy(). Add search functionality across views.',
 true, 3),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Advanced Form Handling with Validation',
 'Build complex form with field validation, error handling, and submission',
 'assignment', 'medium', 35, '2025-03-01 23:59:59',
 'Create multi-step form (registration). Implement field validation (email, password strength). Add real-time error messages. Create custom form hooks. Implement form state management. Add file upload. Create form submission handling.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Performance Optimization Techniques',
 'Learn and implement React performance optimization best practices',
 'assignment', 'medium', 40, '2025-03-08 23:59:59',
 'Implement React.memo for component memoization. Use useMemo and useCallback appropriately. Implement code splitting with dynamic imports. Optimize bundle size. Use React DevTools Profiler. Measure and improve render performance. Document findings.',
 true, 5),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Build a Real-time Chat Component',
 'Create interactive chat component with WebSocket or polling',
 'assignment', 'hard', 45, '2025-03-15 23:59:59',
 'Create chat UI with message list and input. Integrate WebSocket (or polling API). Display online/offline status. Implement typing indicator. Add user avatars. Implement message timestamps. Add emoji support. Create responsive mobile view.',
 true, 6),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Testing React Components with Jest',
 'Write comprehensive unit and integration tests for React components',
 'assignment', 'hard', 45, '2025-03-22 23:59:59',
 'Test component rendering with React Testing Library. Test user interactions (click, input). Mock API calls with jest.mock(). Test hooks with renderHook. Test error boundaries. Achieve 80%+ code coverage. Document testing strategy.',
 true, 7),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Build Animation and Gesture Interactions',
 'Create smooth animations and gesture support with Framer Motion',
 'assignment', 'medium', 35, '2025-03-29 23:59:59',
 'Create page transitions with Framer Motion. Implement spring animations. Add drag and drop functionality. Create scroll animations. Build animated modals. Implement gesture recognizers (swipe). Test on mobile devices.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Create Accessible React Components',
 'Build fully accessible components following WCAG 2.1 guidelines',
 'assignment', 'hard', 40, '2025-04-05 23:59:59',
 'Implement semantic HTML. Add ARIA attributes appropriately. Create keyboard navigation. Add focus management. Test with screen readers. Ensure color contrast compliance. Implement skip links. Add alt text to images. Test with accessibility tools.',
 true, 9),

((SELECT id FROM internship_programs WHERE slug = 'react-frontend-mastery'),
 'Build a Component Library with Storybook',
 'Create reusable component library with documentation and examples',
 'assignment', 'hard', 50, '2025-04-15 23:59:59',
 'Create 15+ reusable components (Button, Input, Card, Modal, etc). Document with PropTypes/TypeScript. Create Storybook stories for each component. Add usage examples. Implement theming system. Generate component documentation. Deploy Storybook online.',
 true, 10),

-- =============================================================================
-- 3️⃣ BACKEND DEVELOPMENT WITH PYTHON DJANGO (10 Assignments)
-- =============================================================================

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Setup Django Project and App Structure',
 'Initialize Django project with proper structure and configuration',
 'assignment', 'easy', 20, '2025-02-22 23:59:59',
 'Create Django project and apps. Configure database (PostgreSQL). Setup environment variables. Configure settings for development/production. Create custom user model. Setup logging. Create manage.py commands. Write documentation.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Build Blog Models and Database Relations',
 'Create Django ORM models for blog with complex relationships',
 'assignment', 'easy', 25, '2025-03-01 23:59:59',
 'Create Post, Comment, Author, Category, Tag models. Define relationships (ForeignKey, ManyToMany). Create Meta options. Add validators. Create migrations. Write custom managers. Add __str__ methods. Implement soft delete.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Implement Django Admin Customization',
 'Customize Django admin interface for improved user experience',
 'assignment', 'easy', 20, '2025-03-08 23:59:59',
 'Register models in admin. Customize list display. Add filters and search. Create custom actions (publish/unpublish). Add inline admin. Implement admin permissions. Create custom admin forms. Add read-only fields.',
 true, 3),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Build RESTful API with Django REST Framework',
 'Create comprehensive API with serializers, viewsets, and permissions',
 'assignment', 'medium', 40, '2025-03-15 23:59:59',
 'Create ModelSerializers for all models. Build ViewSets for CRUD operations. Implement custom permissions. Add pagination. Implement filtering and search. Add versioning. Create API documentation with drf-spectacular. Test all endpoints.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Implement User Authentication and Permissions',
 'Build robust authentication with token-based auth and permission levels',
 'assignment', 'medium', 35, '2025-03-22 23:59:59',
 'Implement token authentication. Create custom permission classes. Build role-based access control (RBAC). Add JWT support. Implement user registration endpoint. Create password reset functionality. Add rate limiting. Write permission tests.',
 true, 5),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Build Complex API Queries with Optimization',
 'Optimize queries using select_related, prefetch_related, and database indices',
 'assignment', 'medium', 40, '2025-03-29 23:59:59',
 'Identify N+1 query problems. Implement select_related and prefetch_related. Add database indices. Use QuerySet.only() and values_list(). Implement query caching. Write performance tests. Generate query reports.',
 true, 6),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Implement Background Tasks with Celery',
 'Setup Celery for async tasks like email sending and batch processing',
 'assignment', 'hard', 45, '2025-04-05 23:59:59',
 'Setup Celery with Redis/RabbitMQ. Create email notification tasks. Implement batch processing. Create scheduled tasks (cron). Add task retry logic. Monitor tasks with Flower. Implement task priorities. Test async behavior.',
 true, 7),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Build Comprehensive Testing Suite',
 'Write unit tests, integration tests, and API tests with pytest',
 'assignment', 'hard', 45, '2025-04-12 23:59:59',
 'Write model tests. Create API endpoint tests. Test authentication and permissions. Use pytest fixtures. Mock external services. Achieve 80%+ coverage. Test edge cases and error scenarios. Create test documentation.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Implement Advanced Search with Elasticsearch',
 'Build full-text search capability with Elasticsearch integration',
 'assignment', 'hard', 50, '2025-04-19 23:59:59',
 'Setup Elasticsearch. Create indices for blog posts. Implement faceted search. Add autocomplete functionality. Implement relevance scoring. Build advanced search filters. Optimize search performance. Create search analytics.',
 true, 9),

((SELECT id FROM internship_programs WHERE slug = 'python-django-backend'),
 'Deploy Django Application with Docker and Kubernetes',
 'Containerize Django app and deploy to Kubernetes cluster',
 'project', 'hard', 60, '2025-04-30 23:59:59',
 'Create Dockerfile and docker-compose. Configure production settings. Setup PostgreSQL container. Implement health checks. Create Kubernetes manifests. Setup CI/CD pipeline. Monitor application. Setup logging and error tracking.',
 true, 10),

-- =============================================================================
-- 4️⃣ DEVOPS AND CLOUD COMPUTING WITH AWS (10 Assignments)
-- =============================================================================

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Master Linux System Administration',
 'Deep dive into Linux systems, users, permissions, and file management',
 'assignment', 'easy', 20, '2025-03-08 23:59:59',
 'Create users and groups with proper permissions. Setup SSH keys. Configure sudo access. Manage file systems. Implement disk quotas. Create backup scripts. Monitor system resources. Analyze logs. Document all configurations.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Docker Containerization Fundamentals',
 'Build and manage Docker containers with best practices',
 'assignment', 'easy', 25, '2025-03-15 23:59:59',
 'Create Dockerfiles for multiple applications. Build multi-layer images with optimization. Use docker-compose for local development. Implement volume and network configuration. Push images to Docker Hub. Create container health checks.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Kubernetes Cluster Setup and Management',
 'Deploy and manage applications on Kubernetes cluster',
 'assignment', 'medium', 40, '2025-03-22 23:59:59',
 'Setup local Kubernetes cluster (minikube/kind). Create deployments and services. Implement ConfigMaps and Secrets. Setup networking. Create ingress rules. Implement health checks. Scale applications. Monitor resource usage.',
 true, 3),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'CI/CD Pipeline Implementation with Jenkins',
 'Build complete CI/CD pipeline for automated testing and deployment',
 'assignment', 'medium', 45, '2025-03-29 23:59:59',
 'Setup Jenkins server. Create pipeline jobs. Implement automated testing stage. Create build and artifact stages. Setup deployment to staging/production. Implement notifications. Add approval gates. Secure credentials. Monitor pipeline.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'AWS Fundamentals: EC2 and S3',
 'Master AWS core services for compute and storage',
 'assignment', 'medium', 40, '2025-04-05 23:59:59',
 'Launch and manage EC2 instances. Setup security groups. Configure IAM roles. Create and manage S3 buckets. Implement bucket policies. Enable versioning and encryption. Setup CloudFront distribution. Monitor with CloudWatch.',
 true, 5),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Infrastructure as Code with Terraform',
 'Define and manage infrastructure using Infrastructure as Code principles',
 'assignment', 'medium', 45, '2025-04-12 23:59:59',
 'Create Terraform configurations for AWS resources. Use variables and outputs. Implement state management. Create modules for reusability. Setup remote state with S3. Implement drift detection. Create deployment workflows.',
 true, 6),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Monitoring and Logging with Prometheus and ELK',
 'Implement comprehensive monitoring and centralized logging',
 'assignment', 'hard', 50, '2025-04-19 23:59:59',
 'Setup Prometheus for metrics collection. Create Grafana dashboards. Configure Alertmanager. Setup ELK stack (Elasticsearch, Logstash, Kibana). Create log parsing rules. Implement alerts based on metrics/logs. Monitor application health.',
 true, 7),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Implement GitOps with ArgoCD',
 'Setup GitOps workflow for Kubernetes deployments',
 'assignment', 'hard', 45, '2025-04-26 23:59:59',
 'Setup ArgoCD on Kubernetes cluster. Create ArgoCD applications. Implement Git-based deployments. Setup automatic sync policies. Create deployment notifications. Implement rollback strategies. Monitor application deployments.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Security Hardening and Vulnerability Management',
 'Implement security best practices across infrastructure',
 'assignment', 'hard', 50, '2025-05-03 23:59:59',
 'Scan containers for vulnerabilities. Implement secrets management (Vault/AWS Secrets Manager). Setup network policies. Implement RBAC. Configure pod security policies. Implement audit logging. Conduct security scans. Create incident response plan.',
 true, 9),

((SELECT id FROM internship_programs WHERE slug = 'devops-cloud-computing'),
 'Complete Cloud Infrastructure Capstone',
 'Design and deploy production-ready cloud infrastructure',
 'project', 'hard', 100, '2025-06-15 23:59:59',
 'Design multi-tier architecture on AWS. Implement load balancing. Setup auto-scaling groups. Implement disaster recovery. Setup monitoring and alerts. Create documentation. Implement cost optimization. Deploy real application. Setup CI/CD pipeline.',
 true, 10),

-- =============================================================================
-- 5️⃣ MOBILE APP DEVELOPMENT WITH REACT NATIVE (10 Assignments)
-- =============================================================================

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'React Native Fundamentals Setup',
 'Setup React Native development environment and build first app',
 'assignment', 'easy', 20, '2025-03-22 23:59:59',
 'Install React Native CLI and dependencies. Setup Android/iOS emulators. Create first project. Understand file structure. Test app in emulator. Create custom components. Implement basic styling. Deploy to emulator.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Build Mobile Todo App with Local Storage',
 'Create todo application with persistent local storage',
 'assignment', 'easy', 25, '2025-03-29 23:59:59',
 'Create todo components. Implement AsyncStorage for persistence. Build add/delete/update functionality. Create list rendering. Implement filtering. Add swipe gestures. Create responsive layout for different screen sizes.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Navigation Implementation with React Navigation',
 'Build multi-screen app with bottom tab and stack navigation',
 'assignment', 'medium', 30, '2025-04-05 23:59:59',
 'Setup React Navigation. Create bottom tab navigator. Implement stack navigator. Add screen options. Create navigation parameters. Build deep linking. Implement conditional navigation. Add splash screen.',
 true, 3),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'API Integration and Networking',
 'Fetch and display data from API with error handling',
 'assignment', 'medium', 35, '2025-04-12 23:59:59',
 'Implement API calls using fetch or axios. Handle loading states. Implement error handling and retry logic. Create pull-to-refresh. Implement pagination. Add offline support. Cache API responses. Show proper loading indicators.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Authentication Flow Implementation',
 'Build complete auth system with login, signup, and token management',
 'assignment', 'medium', 40, '2025-04-19 23:59:59',
 'Create login/signup screens. Implement JWT token storage. Add token refresh logic. Create authenticated API calls. Implement logout. Add password reset flow. Secure token storage with React Native Keychain. Test auth flow.',
 true, 5),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Camera and Media Handling',
 'Implement camera capture, image selection, and video recording',
 'assignment', 'medium', 35, '2025-04-26 23:59:59',
 'Use React Native Camera. Implement photo capture. Add image selection from library. Implement video recording. Add image compression. Upload to server. Handle permissions. Implement camera filters.',
 true, 6),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Push Notifications and Local Notifications',
 'Implement push notifications from server and local notifications',
 'assignment', 'hard', 45, '2025-05-03 23:59:59',
 'Setup Firebase Cloud Messaging. Implement notification handling. Create local notifications. Build notification center. Handle notification taps. Implement notification deep linking. Test on real devices.',
 true, 7),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Build Offline-First Application',
 'Create app with offline support using SQLite and sync logic',
 'assignment', 'hard', 50, '2025-05-10 23:59:59',
 'Implement SQLite database. Create local data storage. Build sync mechanism. Implement conflict resolution. Show offline status. Queue offline actions. Sync when online. Test offline scenarios. Implement data validation.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'App Store and Play Store Deployment',
 'Build, sign, and submit apps to both app stores',
 'assignment', 'hard', 45, '2025-05-17 23:59:59',
 'Setup signing for iOS/Android. Create release builds. Write store listing. Create screenshots. Submit to Apple App Store and Google Play. Handle review process. Manage versioning. Track analytics.',
 true, 9),

((SELECT id FROM internship_programs WHERE slug = 'react-native-mobile-dev'),
 'Build Complete Social Media App',
 'Create feature-rich social app with posts, comments, and messaging',
 'project', 'hard', 80, '2025-05-30 23:59:59',
 'Create user profiles. Implement feed with posts. Build comment system. Add real-time messaging. Implement search. Create user following/followers. Add like functionality. Build notifications system. Deploy to app stores.',
 true, 10),

-- =============================================================================
-- 6️⃣ DATA SCIENCE WITH PYTHON (10 Assignments)
-- =============================================================================

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Python Fundamentals and NumPy Mastery',
 'Master Python and NumPy for numerical computing',
 'assignment', 'easy', 20, '2025-04-08 23:59:59',
 'Learn Python basics (loops, functions, classes). Master NumPy arrays and operations. Implement matrix operations. Create mathematical functions. Optimize code with NumPy. Write documentation. Create performance comparisons.',
 true, 1),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Data Analysis with Pandas',
 'Load, clean, and analyze real-world datasets using Pandas',
 'assignment', 'easy', 25, '2025-04-15 23:59:59',
 'Load CSV/Excel files. Explore data structure and statistics. Handle missing values. Clean data. Create pivot tables. Implement groupby operations. Merge datasets. Create data quality reports. Visualize findings.',
 true, 2),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Data Visualization with Matplotlib and Seaborn',
 'Create compelling visualizations for data exploration',
 'assignment', 'easy', 20, '2025-04-22 23:59:59',
 'Create plots (scatter, line, bar, histogram). Use Seaborn for statistical plots. Create multi-plot figures. Add annotations and styling. Create interactive plots with Plotly. Build dashboard visualizations.',
 true, 3),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Exploratory Data Analysis (EDA) Project',
 'Conduct complete EDA on real-world dataset',
 'assignment', 'medium', 40, '2025-04-29 23:59:59',
 'Load and explore dataset (>1000 rows). Analyze distributions and relationships. Identify outliers and anomalies. Create correlation analysis. Generate insights. Create visualizations. Write EDA report. Prepare data for modeling.',
 true, 4),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Machine Learning Fundamentals',
 'Implement basic ML algorithms from scratch and using scikit-learn',
 'assignment', 'medium', 45, '2025-05-06 23:59:59',
 'Implement Linear Regression, Logistic Regression, KMeans. Use scikit-learn. Implement train/test split. Create pipelines. Evaluate models (accuracy, precision, recall). Implement cross-validation. Tune hyperparameters.',
 true, 5),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Classification Model Development',
 'Build multiple classification models and compare performance',
 'assignment', 'medium', 45, '2025-05-13 23:59:59',
 'Implement Decision Trees, Random Forest, SVM, Naive Bayes. Handle class imbalance. Create confusion matrices. Implement ROC-AUC analysis. Create feature importance plots. Select best model. Write model documentation.',
 true, 6),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Time Series Analysis and Forecasting',
 'Analyze time series data and build forecasting models',
 'assignment', 'hard', 50, '2025-05-20 23:59:59',
 'Load time series data. Analyze trends and seasonality. Implement ARIMA models. Use Prophet for forecasting. Evaluate forecasts (RMSE, MAE). Create visualizations. Handle missing values. Build ensemble forecasts.',
 true, 7),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Introduction to Deep Learning',
 'Build neural networks using TensorFlow/Keras',
 'assignment', 'hard', 55, '2025-05-27 23:59:59',
 'Build neural networks for image classification. Create CNN architectures. Implement data augmentation. Use transfer learning. Evaluate with test set. Create visualizations. Implement regularization. Deploy model.',
 true, 8),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'Feature Engineering and Selection',
 'Create and select optimal features for model improvement',
 'assignment', 'hard', 50, '2025-06-03 23:59:59',
 'Implement feature scaling and normalization. Create polynomial features. Implement encoding techniques. Use feature selection methods. Analyze feature importance. Create interaction features. Measure impact on model performance.',
 true, 9),

((SELECT id FROM internship_programs WHERE slug = 'data-science-python'),
 'End-to-End Data Science Project',
 'Build complete data science pipeline from data to deployment',
 'project', 'hard', 100, '2025-07-31 23:59:59',
 'Define problem statement. Collect and explore data. Perform EDA. Engineer features. Build and evaluate models. Create visualizations. Write comprehensive report. Deploy model as API. Create documentation for stakeholders.',
 true, 10);
