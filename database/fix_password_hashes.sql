-- =============================================================================
-- 🔐 WINST - PASSWORD HASH FIX SCRIPT
-- =============================================================================
-- This script updates all user password hashes to the correct bcrypt hash
-- for password: "password123"
-- Run this if you're experiencing login issues with existing users
-- =============================================================================

BEGIN;

-- Update all users with the correct bcrypt hash for password123
UPDATE users 
SET password_hash = '$2b$10$9tIhVneUihIcrvNKkiADkueKAo/h3eg37d2Xgj1yhO24/jKDO//fC'
WHERE role IN ('admin', 'student', 'mentor', 'affiliate');

-- Verify the update
SELECT 
    email, 
    role, 
    first_name, 
    last_name,
    CASE 
        WHEN password_hash = '$2b$10$9tIhVneUihIcrvNKkiADkueKAo/h3eg37d2Xgj1yhO24/jKDO//fC' 
        THEN '✅ FIXED' 
        ELSE '❌ OLD HASH' 
    END as hash_status
FROM users 
ORDER BY role, email;

COMMIT;

-- =============================================================================
-- 📋 TEST CREDENTIALS AFTER RUNNING THIS SCRIPT:
-- =============================================================================
-- Admin Login:
--   Email: admin@winst.com
--   Password: password123
--
-- Student Login:
--   Email: john.doe@gmail.com
--   Password: password123
--
-- All users now have the same password: password123
-- =============================================================================