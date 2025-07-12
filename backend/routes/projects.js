const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get project requirements for a program
router.get('/requirements/:programId', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;

    // Check if user is enrolled and assessment completed
    const enrollmentCheck = await pool.query(`
      SELECT id, assessment_completed 
      FROM student_internship 
      WHERE student_id = $1 AND program_id = $2
    `, [req.user.id, programId]);

    if (enrollmentCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this program'
      });
    }

    if (!enrollmentCheck.rows[0].assessment_completed) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the assessment first'
      });
    }

    // Get project requirements
    const result = await pool.query(`
      SELECT * FROM project_requirements 
      WHERE program_id = $1 AND is_mandatory = true
      ORDER BY order_index ASC
    `, [programId]);

    res.json({
      success: true,
      data: {
        requirements: result.rows.map(req => ({
          id: req.id,
          title: req.title,
          description: req.description,
          requirements: req.requirements,
          deliverables: req.deliverables,
          evaluationCriteria: req.evaluation_criteria,
          estimatedDurationWeeks: req.estimated_duration_weeks,
          maxScore: req.max_score
        }))
      }
    });
  } catch (error) {
    console.error('Get project requirements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project requirements'
    });
  }
});

// Submit project
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const {
      programId,
      projectRequirementId,
      title,
      description,
      githubUrl,
      liveDemoUrl,
      documentationUrl,
      videoDemoUrl,
      technologiesUsed,
      challengesFaced,
      learningOutcomes
    } = req.body;

    // Get enrollment ID
    const enrollmentResult = await pool.query(
      'SELECT id FROM student_internship WHERE student_id = $1 AND program_id = $2',
      [req.user.id, programId]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this program'
      });
    }

    const enrollmentId = enrollmentResult.rows[0].id;

    // Check if project already submitted
    const existingSubmission = await pool.query(
      'SELECT id FROM project_submissions WHERE student_id = $1 AND project_requirement_id = $2',
      [req.user.id, projectRequirementId]
    );

    if (existingSubmission.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Project already submitted for this requirement'
      });
    }

    // Create project submission
    const result = await pool.query(`
      INSERT INTO project_submissions (
        student_id, program_id, enrollment_id, project_requirement_id,
        title, description, github_url, live_demo_url, documentation_url,
        video_demo_url, technologies_used, challenges_faced, learning_outcomes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, submitted_at
    `, [
      req.user.id, programId, enrollmentId, projectRequirementId,
      title, description, githubUrl, liveDemoUrl, documentationUrl,
      videoDemoUrl, technologiesUsed, challengesFaced, learningOutcomes
    ]);

    // Update enrollment
    await pool.query(`
      UPDATE student_internship 
      SET project_submitted = true, progress_percentage = 75
      WHERE id = $1
    `, [enrollmentId]);

    // Update learning journey
    await pool.query(`
      UPDATE learning_journey 
      SET current_step = 'project_submitted', 
          step_completed_at = CURRENT_TIMESTAMP,
          next_step = 'project_review',
          progress_percentage = 75,
          updated_at = CURRENT_TIMESTAMP
      WHERE enrollment_id = $1
    `, [enrollmentId]);

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: {
        submissionId: result.rows[0].id,
        submittedAt: result.rows[0].submitted_at
      }
    });
  } catch (error) {
    console.error('Submit project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit project'
    });
  }
});

// Get user's project submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ps.*,
        pr.title as requirement_title,
        pr.max_score,
        p.title as program_title
      FROM project_submissions ps
      JOIN project_requirements pr ON ps.project_requirement_id = pr.id
      JOIN internship_programs p ON ps.program_id = p.id
      WHERE ps.student_id = $1
      ORDER BY ps.submitted_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        submissions: result.rows.map(submission => ({
          id: submission.id,
          title: submission.title,
          description: submission.description,
          programTitle: submission.program_title,
          requirementTitle: submission.requirement_title,
          githubUrl: submission.github_url,
          liveDemoUrl: submission.live_demo_url,
          documentationUrl: submission.documentation_url,
          videoDemoUrl: submission.video_demo_url,
          technologiesUsed: submission.technologies_used,
          challengesFaced: submission.challenges_faced,
          learningOutcomes: submission.learning_outcomes,
          status: submission.status,
          score: submission.score,
          maxScore: submission.max_score,
          feedback: submission.feedback,
          submittedAt: submission.submitted_at,
          reviewedAt: submission.reviewed_at
        }))
      }
    });
  } catch (error) {
    console.error('Get project submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project submissions'
    });
  }
});

// Admin: Get all project submissions
router.get('/admin/submissions', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { status, programId } = req.query;
    
    let query = `
      SELECT 
        ps.*,
        pr.title as requirement_title,
        pr.max_score,
        p.title as program_title,
        u.first_name,
        u.last_name,
        u.email
      FROM project_submissions ps
      JOIN project_requirements pr ON ps.project_requirement_id = pr.id
      JOIN internship_programs p ON ps.program_id = p.id
      JOIN users u ON ps.student_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND ps.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (programId) {
      paramCount++;
      query += ` AND ps.program_id = $${paramCount}`;
      queryParams.push(programId);
    }

    query += ' ORDER BY ps.submitted_at DESC';

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: {
        submissions: result.rows.map(submission => ({
          id: submission.id,
          title: submission.title,
          description: submission.description,
          programTitle: submission.program_title,
          requirementTitle: submission.requirement_title,
          student: {
            firstName: submission.first_name,
            lastName: submission.last_name,
            email: submission.email
          },
          githubUrl: submission.github_url,
          liveDemoUrl: submission.live_demo_url,
          documentationUrl: submission.documentation_url,
          videoDemoUrl: submission.video_demo_url,
          technologiesUsed: submission.technologies_used,
          challengesFaced: submission.challenges_faced,
          learningOutcomes: submission.learning_outcomes,
          status: submission.status,
          score: submission.score,
          maxScore: submission.max_score,
          feedback: submission.feedback,
          submittedAt: submission.submitted_at,
          reviewedAt: submission.reviewed_at
        }))
      }
    });
  } catch (error) {
    console.error('Get admin project submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project submissions'
    });
  }
});

// Admin: Review project submission
router.put('/admin/review/:submissionId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, score, feedback } = req.body;

    // Update submission
    const result = await pool.query(`
      UPDATE project_submissions 
      SET status = $1, score = $2, feedback = $3, reviewed_by = $4, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING enrollment_id, program_id, student_id
    `, [status, score, feedback, req.user.id, submissionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project submission not found'
      });
    }

    const { enrollment_id, program_id, student_id } = result.rows[0];

    // If approved, update enrollment and learning journey
    if (status === 'approved') {
      await pool.query(`
        UPDATE student_internship 
        SET project_approved = true, certificate_eligible = true, progress_percentage = 100
        WHERE id = $1
      `, [enrollment_id]);

      await pool.query(`
        UPDATE learning_journey 
        SET current_step = 'project_approved', 
            step_completed_at = CURRENT_TIMESTAMP,
            next_step = 'certificate_ready',
            progress_percentage = 100,
            updated_at = CURRENT_TIMESTAMP
        WHERE enrollment_id = $1
      `, [enrollment_id]);
    }

    res.json({
      success: true,
      message: 'Project reviewed successfully'
    });
  } catch (error) {
    console.error('Review project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review project'
    });
  }
});

module.exports = router;
