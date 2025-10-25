const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Setting up database...');
    
    // Drop existing tables
    console.log('🗑️  Dropping existing tables...');
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);
    console.log('✅ Existing tables dropped.');

    // Load schema
    console.log('📋 Loading database schema...');
    const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅ Database schema loaded successfully.');

    // Load dummy data
    console.log('📊 Loading dummy data...');
    const dummyData = fs.readFileSync(path.join(__dirname, '../database/dummy_data.sql'), 'utf8');
    await client.query(dummyData);
    console.log('✅ Dummy data loaded successfully.');

    console.log('🎉 Database setup completed successfully!');
    
    // Test technologies query
    console.log('🧪 Testing technologies API query...');
    const result = await client.query('SELECT COUNT(*) FROM technologies WHERE is_active = true');
    console.log(`✅ Found ${result.rows[0].count} active technologies`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

setupDatabase();