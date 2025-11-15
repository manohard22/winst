const pool = require('./backend/config/database');

pool.query('SELECT id, title FROM internship_programs ORDER BY created_at', (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Existing programs:');
    result.rows.forEach(p => {
      console.log(`- ${p.title} (ID: ${p.id})`);
    });
  }
  pool.end();
});
