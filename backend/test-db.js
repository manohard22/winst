const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const testDatabaseConnection = async () => {
  const client = await pool.connect();
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('⏰ Current time:', result.rows[0].now);
    
    // Test technologies table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'technologies'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Technologies table exists');
      
      // Test technologies data
      const techCount = await client.query('SELECT COUNT(*) FROM technologies');
      console.log(`✅ Total technologies: ${techCount.rows[0].count}`);
      
      const activeTechCount = await client.query('SELECT COUNT(*) FROM technologies WHERE is_active = true');
      console.log(`✅ Active technologies: ${activeTechCount.rows[0].count}`);
      
      // Test the exact query from the API
      const apiQuery = await client.query(`
        SELECT * FROM technologies WHERE is_active = true ORDER BY category, name
      `);
      console.log(`✅ API Query Result: ${apiQuery.rows.length} rows`);
      
      if (apiQuery.rows.length > 0) {
        console.log('✅ Sample technology:', apiQuery.rows[0]);
      }
      
    } else {
      console.log('❌ Technologies table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

testDatabaseConnection();