const { Pool } = require('pg');
require('dotenv').config();

const testConnection = async () => {
  console.log('🧪 Testing database connection with current credentials...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'}`);

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query successful:', result.rows[0]);
    
    // Test technologies table
    const techCount = await client.query('SELECT COUNT(*) FROM technologies WHERE is_active = true');
    console.log(`✅ Active technologies count: ${techCount.rows[0].count}`);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Error code:', error.code);
    
    if (error.code === '28P01') {
      console.error('💡 Authentication failed - check username/password');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused - check if PostgreSQL is running');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist');
    }
  } finally {
    if (client) client.release();
    await pool.end();
  }
};

testConnection();