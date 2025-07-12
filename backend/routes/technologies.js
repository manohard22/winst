const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all technologies
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM technologies WHERE is_active = true';
    const queryParams = [];
    
    if (category) {
      query += ' AND category = $1';
      queryParams.push(category);
    }
    
    query += ' ORDER BY category, name';
    
    const result = await pool.query(query, queryParams);

    res.json({
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
    });
  } catch (error) {
    console.error('Technologies fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technologies'
    });
  }
});

// Get technology categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM technologies 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `);

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
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
