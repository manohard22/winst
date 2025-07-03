const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get tasks for a program
router.get('/program/:programId', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;

    // Verify user is enrolled in the program
    const enrollmentCheck = await pool.query(
      'SELECT id FROM student_internship WHERE student_id = $1 AND program_id = $2',
      [req.user.id, programId]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this program'
      });
    }

    const result = await pool.query(`
      SELECT 
        t.*,
        ts.id as submission_id,
        ts.status as submission_status,
        ts.points_earned,
        ts.submitted_at,
        ts.feedback as submission_feedback
      FROM tasks t
      LEFT JOIN task_submissions ts ON t.id = ts.task_id AND ts.student_id = $1
      WHERE t.program_id = $2 AND t.is_active = true
      ORDER BY t.order_index ASC, t.created_at ASC
    `, [req.user.id, programId]);

    res.json({
      success: true,
      data: {
        tasks: result.rows.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          taskType: task.task_type,
          difficultyLevel: task.difficulty_level,
          maxPoints: task.max_points,
          dueDate: task.due_date,
          instructions: task.instructions,
          resources: task.resources,
          submissionFormat: task.submission_format,
          isMandatory: task.is_mandatory,
          orderIndex: task.order_index,
          estimatedHours: task.estimated_hours,
          submission: task.submission_id ? {
            id: task.submission_id,
            status: task.submission_status,
            pointsEarned: task.points_earned,
            submittedAt: task.submitted_at,
            feedback: task.submission_feedback
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// Submit a task
router.post('/:taskId/submit', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { submissionText, submissionUrl, githubUrl, liveDemoUrl } = req.body;

    // Verify task exists and user has access
    const taskResult = await pool.query(`
      SELECT t.id, t.title, t.program_id
      FROM tasks t
      JOIN student_internship si ON t.program_id = si.program_id
      WHERE t.id = $1 AND si.student_id = $2 AND t.is_active = true
    `, [taskId, req.user.id]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    // Check if submission already exists
    const existingSubmission = await pool.query(
      'SELECT id FROM task_submissions WHERE task_id = $1 AND student_id = $2',
      [taskId, req.user.id]
    );

    let result;
    if (existingSubmission.rows.length > 0) {
      // Update existing submission
      result = await pool.query(`
        UPDATE task_submissions SET
          submission_text = $1,
          submission_url = $2,
          github_url = $3,
          live_demo_url = $4,
          status = 'submitted',
          submitted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE task_id = $5 AND student_id = $6
        RETURNING id, status, submitted_at
      `, [submissionText, submissionUrl, githubUrl, liveDemoUrl, taskId, req.user.id]);
    } else {
      // Create new submission
      result = await pool.query(`
        INSERT INTO task_submissions (
          task_id, student_id, submission_text, submission_url, 
          github_url, live_demo_url, status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
        RETURNING id, status, submitted_at
      `, [taskId, req.user.id, submissionText, submissionUrl, githubUrl, liveDemoUrl]);
    }

    const submission = result.rows[0];

    res.json({
      success: true,
      message: 'Task submitted successfully',
      data: {
        submission: {
          id: submission.id,
          status: submission.status,
          submittedAt: submission.submitted_at
        }
      }
    });
  } catch (error) {
    console.error('Task submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit task'
    });
  }
});

module.exports = router;
