const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get testimonials error:', error.message);
        console.error(error.stack);
        res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
    }
});

// Admin: Create a testimonial
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { student_name, student_role, image_url, content, is_featured } = req.body;

        const result = await pool.query(
            'INSERT INTO testimonials (student_name, student_role, image_url, content, is_featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [student_name, student_role, image_url, content, is_featured]
        );

        res.status(201).json({ success: true, message: 'Testimonial created successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({ success: false, message: 'Failed to create testimonial' });
    }
});

module.exports = router;
