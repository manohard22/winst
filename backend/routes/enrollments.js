const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's enrollments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        si.*,
        p.title as program_title,
        p.description as program_description,
        p.duration_weeks,
        p.difficulty_level,
        p.image_url,
        p.certificate_provided,
        u.first_name as mentor_first_name,
        u.last_name as mentor_last_name
      FROM student_internship si
      JOIN internship_programs p ON si.program_id = p.id
      LEFT JOIN users u ON si.mentor_id = u.id
      WHERE si.student_id = $1
      ORDER BY si.enrollment_date DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        enrollments: result.rows.map(enrollment => ({
          id: enrollment.id,
          programId: enrollment.program_id,
          programTitle: enrollment.program_title,
          programDescription: enrollment.program_description,
          durationWeeks: enrollment.duration_weeks,
          difficultyLevel: enrollment.difficulty_level,
          imageUrl: enrollment.image_url,
          certificateProvided: enrollment.certificate_provided,
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status,
          progressPercentage: enrollment.progress_percentage,
          startDate: enrollment.start_date,
          expectedCompletionDate: enrollment.expected_completion_date,
          actualCompletionDate: enrollment.actual_completion_date,
          finalGrade: enrollment.final_grade,
          feedback: enrollment.feedback,
          certificateIssued: enrollment.certificate_issued,
          certificateUrl: enrollment.certificate_url,
          mentor: enrollment.mentor_first_name ? {
            firstName: enrollment.mentor_first_name,
            lastName: enrollment.mentor_last_name
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Enrollments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments'
    });
  }
});

// Enroll in a program
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }

    // Check if program exists and is active
    const programResult = await pool.query(
      'SELECT id, title, max_participants, current_participants FROM internship_programs WHERE id = $1 AND is_active = true',
      [programId]
    );

    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found or inactive'
      });
    }

    const program = programResult.rows[0];

    // Check if user is already enrolled
    const existingEnrollment = await pool.query(
      'SELECT id FROM student_internship WHERE student_id = $1 AND program_id = $2',
      [req.user.id, programId]
    );

    if (existingEnrollment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this program'
      });
    }

    // Check if program has available slots
    if (program.max_participants && program.current_participants >= program.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'Program is full'
      });
    }

    // Create enrollment
    const enrollmentResult = await pool.query(`
      INSERT INTO student_internship (student_id, program_id, status)
      VALUES ($1, $2, 'enrolled')
      RETURNING id, enrollment_date, status
    `, [req.user.id, programId]);

    // Update program participant count
    await pool.query(
      'UPDATE internship_programs SET current_participants = current_participants + 1 WHERE id = $1',
      [programId]
    );

    const enrollment = enrollmentResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in program',
      data: {
        enrollment: {
          id: enrollment.id,
          programId: programId,
          programTitle: program.title,
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status
        }
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in program'
    });
  }
});

module.exports = router;
