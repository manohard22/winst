const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM internship_programs WHERE is_active = true) as total_programs,
        (SELECT COUNT(*) FROM student_internship) as total_enrollments,
        (SELECT COUNT(*) FROM orders WHERE status = 'paid') as total_orders,
        (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE status = 'paid') as total_revenue
    `);

    const recentEnrollments = await pool.query(`
      SELECT 
        si.id,
        si.enrollment_date,
        si.status,
        u.first_name,
        u.last_name,
        u.email,
        p.title as program_title
      FROM student_internship si
      JOIN users u ON si.student_id = u.id
      JOIN internship_programs p ON si.program_id = p.id
      ORDER BY si.enrollment_date DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        statistics: stats.rows[0],
        recentEnrollments: recentEnrollments.rows.map(enrollment => ({
          id: enrollment.id,
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status,
          student: {
            firstName: enrollment.first_name,
            lastName: enrollment.last_name,
            email: enrollment.email
          },
          programTitle: enrollment.program_title
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        u.*,
        COUNT(si.id) as enrollment_count,
        COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.final_amount ELSE 0 END), 0) as total_spent
      FROM users u
      LEFT JOIN student_internship si ON u.id = si.student_id
      LEFT JOIN orders o ON u.id = o.student_id
      WHERE u.role = 'student'
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC`;
    
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
        students: result.rows.map(student => ({
          id: student.id,
          email: student.email,
          firstName: student.first_name,
          lastName: student.last_name,
          phone: student.phone,
          collegeName: student.college_name,
          degree: student.degree,
          branch: student.branch,
          yearOfStudy: student.year_of_study,
          cgpa: student.cgpa,
          isActive: student.is_active,
          emailVerified: student.email_verified,
          enrollmentCount: parseInt(student.enrollment_count),
          totalSpent: parseFloat(student.total_spent),
          createdAt: student.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
});

// Get all programs for admin
router.get('/programs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        COUNT(si.id) as enrollment_count,
        COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.final_amount ELSE 0 END), 0) as revenue
      FROM internship_programs p
      LEFT JOIN student_internship si ON p.id = si.program_id
      LEFT JOIN orders o ON p.id = o.program_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

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
          isActive: program.is_active,
          enrollmentCount: parseInt(program.enrollment_count),
          revenue: parseFloat(program.revenue),
          createdAt: program.created_at,
          updatedAt: program.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Admin programs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs'
    });
  }
});

module.exports = router;
