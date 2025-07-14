const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all active programs
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, technology, limit = 10, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        p.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'category', t.category,
              'iconUrl', t.icon_url,
              'isPrimary', pt.is_primary
            )
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as technologies
      FROM internship_programs p
      LEFT JOIN program_technologies pt ON p.id = pt.program_id
      LEFT JOIN technologies t ON pt.technology_id = t.id
      WHERE p.is_active = true
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (difficulty) {
      paramCount++;
      query += ` AND p.difficulty_level = $${paramCount}`;
      queryParams.push(difficulty);
    }

    if (technology) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM program_technologies pt2 
        JOIN technologies t2 ON pt2.technology_id = t2.id 
        WHERE pt2.program_id = p.id AND t2.name ILIKE $${paramCount}
      )`;
      queryParams.push(`%${technology}%`);
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;
    
    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      queryParams.push(parseInt(limit));
    }
    
    if (offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      queryParams.push(parseInt(offset));
    }

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: {
        programs: result.rows.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          durationWeeks: program.duration_weeks,
          difficultyLevel: program.difficulty_level,
          price: parseFloat(program.price),
          discountPercentage: program.discount_percentage,
          finalPrice: parseFloat(program.final_price),
          maxParticipants: program.max_participants,
          currentParticipants: program.current_participants,
          startDate: program.start_date,
          endDate: program.end_date,
          registrationDeadline: program.registration_deadline,
          certificateProvided: program.certificate_provided,
          mentorshipIncluded: program.mentorship_included,
          projectBased: program.project_based,
          remoteAllowed: program.remote_allowed,
          requirements: program.requirements,
          learningOutcomes: program.learning_outcomes,
          imageUrl: program.image_url,
          technologies: program.technologies,
          createdAt: program.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Programs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs'
    });
  }
});

// Get single program
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'category', t.category,
              'iconUrl', t.icon_url,
              'isPrimary', pt.is_primary
            )
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as technologies
      FROM internship_programs p
      LEFT JOIN program_technologies pt ON p.id = pt.program_id
      LEFT JOIN technologies t ON pt.technology_id = t.id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const program = result.rows[0];

    res.json({
      success: true,
      data: {
        program: {
          id: program.id,
          title: program.title,
          description: program.description,
          durationWeeks: program.duration_weeks,
          difficultyLevel: program.difficulty_level,
          price: parseFloat(program.price),
          discountPercentage: program.discount_percentage,
          finalPrice: parseFloat(program.final_price),
          maxParticipants: program.max_participants,
          currentParticipants: program.current_participants,
          startDate: program.start_date,
          endDate: program.end_date,
          registrationDeadline: program.registration_deadline,
          certificateProvided: program.certificate_provided,
          mentorshipIncluded: program.mentorship_included,
          projectBased: program.project_based,
          remoteAllowed: program.remote_allowed,
          requirements: program.requirements,
          learningOutcomes: program.learning_outcomes,
          imageUrl: program.image_url,
          technologies: program.technologies,
          createdAt: program.created_at
        }
      }
    });
  } catch (error) {
    console.error('Program fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch program'
    });
  }
});

// Get courses by program
router.get('/:id/courses', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.duration_weeks,
        c.difficulty_level,
        c.learning_outcomes,
        c.logo,
        c.created_at
      FROM courses c
      WHERE c.internship_program_id = $1 AND c.is_active = true
      ORDER BY c.created_at DESC
    `, [id]);
      console.log("FFFFFF result:", result.rows);
    res.json({
      success: true,
      data: {
        courses: result.rows.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          durationWeeks: course.duration_weeks,
          difficultyLevel: course.difficulty_level,
          learningOutcomes: course.learning_outcomes,
          imageUrl: course.logo,
          createdAt: course.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

module.exports = router;
