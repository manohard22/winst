require('dotenv').config();
const db = require('./config/database');

async function checkTable() {
  try {
    console.log('Checking if orders table exists...');
    const result = await db.query(`
      SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'orders'
      )
    `);
    
    const exists = result.rows[0].exists;
    console.log('Orders table exists:', exists);
    
    if (exists) {
      console.log('\nGetting orders table structure...');
      const schema = await db.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'orders'
        ORDER BY ordinal_position
      `);
      console.log('\nOrders table columns:');
      schema.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('❌ Orders table NOT found! Need to create it.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTable();
