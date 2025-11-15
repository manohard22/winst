// @ts-nocheck
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'winst_portal_db',
  user: 'winst_db_user',
  password: 'winstpass123',
});

async function updatePassword() {
  try {
    // Generate bcrypt hash for password123
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    console.log('Generated hash:', hashedPassword);
    
    // Update user password
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, id;',
      [hashedPassword, 'john.doe@gmail.com']
    );
    
    console.log('✅ Password updated successfully!');
    console.log('Updated user:', result.rows);
    
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
    process.exit(1);
  }
}

updatePassword();
