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
    const result = await pool.query(
      "UPDATE users SET password = crypt('password123', gen_salt('bf')) WHERE email = 'john.doe@gmail.com' RETURNING email, id;"
    );
    
    console.log('✅ Password updated successfully!');
    console.log('Updated user:', result.rows);
    
    pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    pool.end();
    process.exit(1);
  }
}

updatePassword();
