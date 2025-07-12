const express = require("express");
const pool = require("../config/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get assessment questions for a program
router.get("/program/:programId", authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;

    // Check if user is enrolled in the program
    const enrollmentCheck = await pool.query(
      "SELECT id FROM student_internship WHERE student_id = $1 AND program_id = $2",
      [req.user.id, programId]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not enrolled in this program",
      });
    }

    // Check if assessment already completed
    const attemptCheck = await pool.query(
      `SELECTid FROM assessment_attempts WHERE student_id = $1 AND program_id = $2 AND status = 'completed'`,
      $[(req.user.id, programId)]
    );

    if (attemptCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Assessment already completed for this program",
      });
    }

    // Get questions
    const result = await pool.query(
      `
      SELECT id, question_text, question_type, options, points, difficulty_level, order_index
      FROM assessment_questions
      WHERE program_id = $1 AND is_active = true
      ORDER BY order_index ASC
    `,
      [programId]
    );

    res.json({
      success: true,
      data: {
        questions: result.rows.map((question) => ({
          id: question.id,
          questionText: question.question_text,
          questionType: question.question_type,
          options: question.options,
          points: question.points,
          difficultyLevel: question.difficulty_level,
          orderIndex: question.order_index,
        })),
      },
    });
  } catch (error) {
    console.error("Get assessment questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment questions",
    });
  }
});

// Start assessment attempt
router.post("/start/:programId", authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;

    // Get enrollment ID
    const enrollmentResult = await pool.query(
      "SELECT id FROM student_internship WHERE student_id = $1 AND program_id = $2",
      [req.user.id, programId]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not enrolled in this program",
      });
    }

    const enrollmentId = enrollmentResult.rows[0].id;

    // Count total questions
    const questionCount = await pool.query(
      "SELECT COUNT(*) as total FROM assessment_questions WHERE program_id = $1 AND is_active = true",
      [programId]
    );

    const totalQuestions = parseInt(questionCount.rows[0].total);

    // Create assessment attempt
    const result = await pool.query(
      `
      INSERT INTO assessment_attempts (student_id, program_id, enrollment_id, total_questions)
      VALUES ($1, $2, $3, $4)
      RETURNING id, started_at
    `,
      [req.user.id, programId, enrollmentId, totalQuestions]
    );

    res.status(201).json({
      success: true,
      message: "Assessment started successfully",
      data: {
        attemptId: result.rows[0].id,
        totalQuestions,
        startedAt: result.rows[0].started_at,
      },
    });
  } catch (error) {
    console.error("Start assessment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start assessment",
    });
  }
});

// Submit assessment answers
router.post("/submit/:attemptId", authenticateToken, async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body; // Array of {questionId, answer}

    // Verify attempt belongs to user
    const attemptResult = await pool.query(
      "SELECT * FROM assessment_attempts WHERE id = $1 AND student_id = $2 AND status = 'in_progress'",
      [attemptId, req.user.id]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assessment attempt not found or already completed",
      });
    }

    const attempt = attemptResult.rows[0];
    let correctAnswers = 0;
    let totalPoints = 0;

    // Process each answer
    for (const answer of answers) {
      // Get correct answer
      const questionResult = await pool.query(
        "SELECT correct_answer, points FROM assessment_questions WHERE id = $1",
        [answer.questionId]
      );

      if (questionResult.rows.length > 0) {
        const question = questionResult.rows[0];
        const isCorrect =
          answer.answer.trim().toLowerCase() ===
          question.correct_answer.trim().toLowerCase();
        const pointsEarned = isCorrect ? question.points : 0;

        if (isCorrect) correctAnswers++;
        totalPoints += pointsEarned;

        // Save answer
        await pool.query(
          `
          INSERT INTO assessment_answers (attempt_id, question_id, student_answer, is_correct, points_earned)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [attemptId, answer.questionId, answer.answer, isCorrect, pointsEarned]
        );
      }
    }

    // Calculate score percentage
    const scorePercentage = (correctAnswers / attempt.total_questions) * 100;
    const passed = scorePercentage >= 60; // 60% passing score

    // Update attempt
    await pool.query(
      `
      UPDATE assessment_attempts 
      SET correct_answers = $1, score_percentage = $2, status = $3, completed_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `,
      [correctAnswers, scorePercentage, "completed", attemptId]
    );

    // Update enrollment
    await pool.query(
      `
      UPDATE student_internship 
      SET assessment_completed = true, assessment_score = $1, progress_percentage = 50
      WHERE id = $2
    `,
      [scorePercentage, attempt.enrollment_id]
    );

    // Update learning journey
    await pool.query(
      `
      INSERT INTO learning_journey (student_id, program_id, enrollment_id, current_step, step_completed_at, next_step, progress_percentage)
      VALUES ($1, $2, $3, 'assessment_completed', CURRENT_TIMESTAMP, 'project_assigned', 50)
      ON CONFLICT (enrollment_id) DO UPDATE SET
        current_step = 'assessment_completed',
        step_completed_at = CURRENT_TIMESTAMP,
        next_step = 'project_assigned',
        progress_percentage = 50,
        updated_at = CURRENT_TIMESTAMP
    `,
      [req.user.id, attempt.program_id, attempt.enrollment_id]
    );

    res.json({
      success: true,
      message: "Assessment submitted successfully",
      data: {
        correctAnswers,
        totalQuestions: attempt.total_questions,
        scorePercentage: parseFloat(scorePercentage.toFixed(2)),
        passed,
        totalPoints,
      },
    });
  } catch (error) {
    console.error("Submit assessment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
    });
  }
});

// Get assessment results
router.get("/results/:programId", authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        aa.*,
        p.title as program_title
      FROM assessment_attempts aa
      JOIN internship_programs p ON aa.program_id = p.id
      WHERE aa.student_id = $1 AND aa.program_id = $2 AND aa.status = 'completed'
      ORDER BY aa.completed_at DESC
      LIMIT 1
    `,
      [req.user.id, programId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No completed assessment found",
      });
    }

    const assessment = result.rows[0];

    res.json({
      success: true,
      data: {
        programTitle: assessment.program_title,
        totalQuestions: assessment.total_questions,
        correctAnswers: assessment.correct_answers,
        scorePercentage: parseFloat(assessment.score_percentage),
        timeTaken: assessment.time_taken,
        completedAt: assessment.completed_at,
        passed: assessment.score_percentage >= 60,
      },
    });
  } catch (error) {
    console.error("Get assessment results error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment results",
    });
  }
});

module.exports = router;
