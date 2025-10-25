const { Pool } = require('pg');
require('dotenv').config();

// Connect as postgres superuser to create database and user
const setupPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default postgres database
  user: 'postgres',      // Use postgres superuser
  password: process.env.POSTGRES_PASSWORD || 'postgres', // Default postgres password
});

const setupDatabaseUser = async () => {
  const client = await setupPool.connect();
  try {
    console.log('🔧 Setting up database user and permissions...');
    
    const dbName = process.env.DB_NAME || 'winst_portal_db';
    const dbUser = process.env.DB_USER || 'winst_db_user';
    const dbPassword = process.env.DB_PASSWORD || 'winstpass123';
    
    console.log(`📋 Database: ${dbName}`);
    console.log(`👤 User: ${dbUser}`);
    
    // Create database if it doesn't exist
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    if (dbExists.rows.length === 0) {
      console.log('🔨 Creating database...');
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }
    
    // Create user if it doesn't exist
    const userExists = await client.query(
      "SELECT 1 FROM pg_roles WHERE rolname = $1",
      [dbUser]
    );
    
    if (userExists.rows.length === 0) {
      console.log('👤 Creating user...');
      await client.query(`CREATE USER "${dbUser}" WITH PASSWORD '${dbPassword}'`);
      console.log('✅ User created');
    } else {
      console.log('👤 User already exists, updating password...');
      await client.query(`ALTER USER "${dbUser}" WITH PASSWORD '${dbPassword}'`);
      console.log('✅ User password updated');
    }
    
    // Grant permissions
    console.log('🔐 Granting permissions...');
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${dbUser}"`);
    await client.query(`ALTER USER "${dbUser}" CREATEDB`);
    console.log('✅ Permissions granted');
    
    console.log('🎉 Database user setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database user:', error.message);
    if (error.code === '28P01') {
      console.error('💡 Please ensure PostgreSQL is running and you have the correct postgres superuser password');
      console.error('💡 You might need to set POSTGRES_PASSWORD environment variable');
    }
  } finally {
    client.release();
    await setupPool.end();
  }
};

setupDatabaseUser();