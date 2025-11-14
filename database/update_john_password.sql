-- Update john.doe@gmail.com password to password123
-- Using the correct bcrypt hash from sample data
UPDATE users 
SET password_hash = '$2b$10$9tIhVneUihIcrvNKkiADkueKAo/h3eg37d2Xgj1yhO24/jKDO//fC'
WHERE email = 'john.doe@gmail.com';

-- Verify the update
SELECT id, email, first_name, last_name, created_at FROM users WHERE email = 'john.doe@gmail.com';
