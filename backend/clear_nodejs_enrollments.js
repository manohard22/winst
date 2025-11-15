// Clear Node.js enrollments - Direct SQL approach
const { Client } = require('pg');

(async () => {
  const client = new Client({
    user: 'winst_db_user',
    password: 'winstpass123',
    host: 'localhost',
    port: 5432,
    database: 'winst_portal_db'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Finding Node.js programs...\n');
    
    // Find Node.js program
    const programResult = await client.query(
      "SELECT id, title FROM internship_programs WHERE title ILIKE '%node%' OR title ILIKE '%mern%' ORDER BY id"
    );
    
    if (programResult.rows.length === 0) {
      console.log('❌ No Node.js programs found');
      await client.end();
      process.exit(0);
    }
    
    console.log('✅ Node.js Programs found:');
    programResult.rows.forEach(p => {
      console.log(`   ID: ${p.id}, Title: ${p.title}`);
    });
    
    const programIds = programResult.rows.map(p => p.id);
    
    // Check enrollments
    const enrollResult = await client.query(
      'SELECT COUNT(*) as count FROM student_internship WHERE program_id = ANY($1)',
      [programIds]
    );
    
    // Check orders
    const orderResult = await client.query(
      'SELECT COUNT(*) as count FROM orders WHERE program_id = ANY($1)',
      [programIds]
    );
    
    console.log('\n📊 Current Data:');
    console.log(`   Enrollments: ${enrollResult.rows[0].count}`);
    console.log(`   Orders: ${orderResult.rows[0].count}`);
    
    if (enrollResult.rows[0].count === 0 && orderResult.rows[0].count === 0) {
      console.log('\n✅ No enrollment or order data to delete');
      await client.end();
      process.exit(0);
    }
    
    console.log('\n🗑️  Deleting data...');
    
    // Delete enrollments
    const deleteEnroll = await client.query(
      'DELETE FROM student_internship WHERE program_id = ANY($1) RETURNING id',
      [programIds]
    );
    console.log(`   ✅ Deleted ${deleteEnroll.rows.length} enrollments`);
    
    // Delete orders (this will cascade delete payments if foreign key is set)
    const deleteOrders = await client.query(
      'DELETE FROM orders WHERE program_id = ANY($1) RETURNING id',
      [programIds]
    );
    console.log(`   ✅ Deleted ${deleteOrders.rows.length} orders`);
    
    console.log('\n✅ All Node.js enrollment data cleared successfully!\n');
    
    await client.end();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
