const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Simplified test route
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing simplified technologies endpoint...');
    
    // Test database connection first
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', connectionTest.rows[0]);
    
    // Test table exists
    const tableTest = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'technologies'
    `);
    console.log('✅ Technologies table check:', tableTest.rows);
    
    // Test simple count
    const countTest = await pool.query('SELECT COUNT(*) FROM technologies');
    console.log('✅ Technologies count:', countTest.rows[0]);
    
    // Test the actual query
    const result = await pool.query('SELECT * FROM technologies WHERE is_active = true ORDER BY category, name LIMIT 5');
    console.log('✅ Technologies query successful, rows:', result.rows.length);
    
    res.json({
      success: true,
      message: 'Test successful',
      data: {
        connectionTest: connectionTest.rows[0],
        tableExists: tableTest.rows.length > 0,
        totalCount: countTest.rows[0].count,
        sampleTechnologies: result.rows
      }
    });
    
  } catch (error) {
    console.error('❌ Test route error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get all technologies (original route with better error handling)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Technologies endpoint called');
    console.log('🔍 Request query:', req.query);
    
    const { category } = req.query;
    
    let query = 'SELECT * FROM technologies WHERE is_active = true';
    const queryParams = [];
    
    if (category) {
      query += ' AND category = $1';
      queryParams.push(category);
    }
    
    query += ' ORDER BY category, name';
    
    console.log('🔍 Executing query:', query);
    console.log('🔍 Query params:', queryParams);
    
    const result = await pool.query(query, queryParams);
    
    console.log('✅ Query executed successfully, rows:', result.rows.length);

    const responseData = {
      success: true,
      data: {
        technologies: result.rows.map(tech => ({
          id: tech.id,
          name: tech.name,
          category: tech.category,
          description: tech.description,
          iconUrl: tech.icon_url,
          isActive: tech.is_active,
          createdAt: tech.created_at
        }))
      }
    };
    
    console.log('✅ Sending response with', responseData.data.technologies.length, 'technologies');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Technologies fetch error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technologies',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get technology categories
router.get('/categories', async (req, res) => {
  try {
    console.log('🔍 Categories endpoint called');
    
    const result = await pool.query(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM technologies 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `);
    
    console.log('✅ Categories query successful, rows:', result.rows.length);

    res.json({
      success: true,
      data: {
        categories: result.rows.map(cat => ({
          name: cat.category,
          count: parseInt(cat.count)
        }))
      }
    });
  } catch (error) {
    console.error('❌ Categories fetch error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;