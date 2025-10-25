-- Insert dummy admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@winst.com', 'edfff1ad23e7160eced0de6e79091976:2558a3c0bb7d1aac2a40a22e8fdb1ae2ddc2f05193817e464b9f4778c3ca8717b891580613f03fc5ee5046ec4b42b625ed3724ee3ba5e1801ea6908276fb2c1f', 'Admin', 'User', 'admin');

-- Insert dummy student users
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('student1@winst.com', '8a0bb5e689cca85efd698ad50520d105:890727178552c5da0013c68f0b58e546f4e378fb2a4343101e1590e3e49b36121a2335460d0381a0386244692d033ec2b0032682bf099df29a006360772d1accd', 'Student', 'One', 'student'),
       ('student2@winst.com', '8a0bb5e689cca85efd698ad50520d105:890727178552c5da0013c68f0b58e546f4e378fb2a4343101e1590e3e49b36121a2335460d0381a0386244692d033ec2b0032682bf099df29a006360772d1accd', 'Student', 'Two', 'student'),
       ('student3@winst.com', '8a0bb5e689cca85efd698ad50520d105:890727178552c5da0013c68f0b58e546f4e378fb2a4343101e1590e3e49b36121a2335460d0381a0386244692d033ec2b0032682bf099df29a006360772d1accd', 'Student', 'Three', 'student');

-- Insert dummy technologies
INSERT INTO technologies (name, category, description, icon_url, is_active, sort_order) VALUES
('JavaScript', 'Frontend', 'Programming language for web development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', true, 1),
('React', 'Frontend', 'JavaScript library for building user interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true, 2),
('Node.js', 'Backend', 'JavaScript runtime for server-side development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true, 3),
('Express', 'Backend', 'Web framework for Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', true, 4),
('PostgreSQL', 'Database', 'Advanced open source relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', true, 5),
('HTML', 'Frontend', 'Markup language for web pages', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', true, 6),
('CSS', 'Frontend', 'Stylesheet language for web design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', true, 7),
('Python', 'Backend', 'High-level programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', true, 8),
('Django', 'Backend', 'Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', true, 9),
('Flask', 'Backend', 'Lightweight Python web framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', true, 10),
('MongoDB', 'Database', 'NoSQL document database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', true, 11),
('MySQL', 'Database', 'Popular relational database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', true, 12),
('Java', 'Backend', 'Object-oriented programming language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', true, 13),
('Spring', 'Backend', 'Java enterprise framework', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', true, 14),
('Kotlin', 'Mobile', 'Modern programming language for Android', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg', true, 15),
('Swift', 'Mobile', 'Programming language for iOS development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', true, 16),
('Android', 'Mobile', 'Mobile operating system and development platform', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg', true, 17),
('iOS', 'Mobile', 'Apple mobile operating system', 'https://upload.wikimedia.org/wikipedia/commons/6/63/IOS_wordmark_%282017%29.svg', true, 18),
('Flutter', 'Mobile', 'UI toolkit for cross-platform development', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', true, 19),
('React Native', 'Mobile', 'Framework for building native mobile apps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', true, 20);

-- Insert dummy programs
INSERT INTO internship_programs (title, slug, description, duration_weeks, difficulty_level, price, final_price)
VALUES ('Full Stack Development', 'full-stack-development', 'Learn to build web applications from scratch.', 12, 'intermediate', 2000, 2000),
       ('UI/UX Design', 'ui-ux-design', 'Master the art of user-centric design.', 8, 'beginner', 2000, 2000),
       ('Data Science', 'data-science', 'Unlock the power of data.', 16, 'advanced', 2000, 2000);

-- Insert dummy enrollments
INSERT INTO student_internship (student_id, program_id)
SELECT u.id, p.id
FROM users u, internship_programs p
WHERE u.email = 'student1@winst.com' AND p.title = 'Full Stack Development';

-- Insert dummy testimonials
INSERT INTO testimonials (student_name, student_role, image_url, content)
VALUES ('Rahul K.', 'Software Engineer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60', 'Winst helped me land my dream internship at Google!'),
       ('Priya S.', 'UX Designer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60', 'The mentorship I received was invaluable.'),
       ('Amit R.', 'Data Scientist', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60', 'I learned so much and built a great portfolio.');
