const express = require('express');
const { Pool } = require('pg');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'winst_internship',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Get all quiz questions for a program (for students)
router.get('/program/:programId', authenticateToken, async (req, res) => {
    try {
        const { programId } = req.params;
        const userId = req.user.id;

        // Check if user is enrolled in the program
        const enrollmentCheck = await pool.query(
            'SELECT id FROM enrollments WHERE student_id = $1 AND program_id = $2 AND status = $3',
            [userId, programId, 'active']
        );

        if (enrollmentCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You are not enrolled in this program' });
        }

        // Get quiz questions for the program
        const result = await pool.query(`
            SELECT 
                qq.id,
                qq.question_text,
                qq.question_type,
                qq.options,
                qq.points,
                qq.explanation,
                qq.difficulty_level,
                qq.category,
                qq.order_index,
                CASE 
                    WHEN qs.id IS NOT NULL THEN true 
                    ELSE false 
                END as is_answered,
                qs.selected_answer,
                qs.is_correct,
                qs.score
            FROM quiz_questions qq
            LEFT JOIN quiz_submissions qs ON qq.id = qs.question_id AND qs.student_id = $1
            WHERE qq.program_id = $2
            ORDER BY qq.order_index ASC
        `, [userId, programId]);

        res.json({
            success: true,
            questions: result.rows
        });
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit quiz answer
router.post('/submit-answer', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { questionId, selectedAnswer } = req.body;
        const userId = req.user.id;

        // Get question details
        const questionResult = await client.query(
            'SELECT * FROM quiz_questions WHERE id = $1',
            [questionId]
        );

        if (questionResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Question not found' });
        }

        const question = questionResult.rows[0];

        // Check if answer is correct
        const isCorrect = question.correct_answer === selectedAnswer;
        const score = isCorrect ? question.points : 0;

        // Check if user already answered this question
        const existingSubmission = await client.query(
            'SELECT id FROM quiz_submissions WHERE question_id = $1 AND student_id = $2',
            [questionId, userId]
        );

        if (existingSubmission.rows.length > 0) {
            // Update existing submission
            await client.query(`
                UPDATE quiz_submissions 
                SET selected_answer = $1, is_correct = $2, score = $3, submitted_at = CURRENT_TIMESTAMP
                WHERE question_id = $4 AND student_id = $5
            `, [selectedAnswer, isCorrect, score, questionId, userId]);
        } else {
            // Insert new submission
            await client.query(`
                INSERT INTO quiz_submissions (question_id, student_id, selected_answer, is_correct, score)
                VALUES ($1, $2, $3, $4, $5)
            `, [questionId, userId, selectedAnswer, isCorrect, score]);
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            is_correct: isCorrect,
            score: score,
            explanation: question.explanation,
            correct_answer: question.correct_answer
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error submitting quiz answer:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Get quiz progress for a program
router.get('/progress/:programId', authenticateToken, async (req, res) => {
    try {
        const { programId } = req.params;
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT 
                COUNT(DISTINCT qq.id) as total_questions,
                COUNT(DISTINCT qs.id) as answered_questions,
                COALESCE(SUM(qs.score), 0) as total_score,
                COALESCE(SUM(qq.points), 0) as max_possible_score,
                ROUND(
                    CASE 
                        WHEN COUNT(DISTINCT qq.id) > 0 
                        THEN (COUNT(DISTINCT qs.id)::FLOAT / COUNT(DISTINCT qq.id)::FLOAT) * 100 
                        ELSE 0 
                    END, 2
                ) as completion_percentage
            FROM quiz_questions qq
            LEFT JOIN quiz_submissions qs ON qq.id = qs.question_id AND qs.student_id = $1
            WHERE qq.program_id = $2
        `, [userId, programId]);

        const stats = result.rows[0];

        res.json({
            success: true,
            progress: {
                total_questions: parseInt(stats.total_questions),
                answered_questions: parseInt(stats.answered_questions),
                total_score: parseInt(stats.total_score),
                max_possible_score: parseInt(stats.max_possible_score),
                completion_percentage: parseFloat(stats.completion_percentage),
                percentage_score: stats.max_possible_score > 0 
                    ? Math.round((stats.total_score / stats.max_possible_score) * 100)
                    : 0
            }
        });
    } catch (error) {
        console.error('Error fetching quiz progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Create quiz question
router.post('/admin/questions', authenticateToken, async (req, res) => {
    try {
        const {
            programId,
            questionText,
            questionType,
            options,
            correctAnswer,
            points,
            explanation,
            difficultyLevel,
            category,
            orderIndex
        } = req.body;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const result = await pool.query(`
            INSERT INTO quiz_questions 
            (program_id, question_text, question_type, options, correct_answer, points, explanation, difficulty_level, category, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [programId, questionText, questionType, JSON.stringify(options), correctAnswer, points, explanation, difficultyLevel, category, orderIndex]);

        res.json({
            success: true,
            question: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating quiz question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get all quiz questions for a program
router.get('/admin/questions/:programId', authenticateToken, async (req, res) => {
    try {
        const { programId } = req.params;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const result = await pool.query(`
            SELECT 
                qq.*,
                COUNT(qs.id) as submission_count,
                ROUND(AVG(CASE WHEN qs.is_correct THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
            FROM quiz_questions qq
            LEFT JOIN quiz_submissions qs ON qq.id = qs.question_id
            WHERE qq.program_id = $1
            GROUP BY qq.id
            ORDER BY qq.order_index ASC
        `, [programId]);

        res.json({
            success: true,
            questions: result.rows
        });
    } catch (error) {
        console.error('Error fetching admin quiz questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Update quiz question
router.put('/admin/questions/:questionId', authenticateToken, async (req, res) => {
    try {
        const { questionId } = req.params;
        const {
            questionText,
            questionType,
            options,
            correctAnswer,
            points,
            explanation,
            difficultyLevel,
            category,
            orderIndex
        } = req.body;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const result = await pool.query(`
            UPDATE quiz_questions 
            SET question_text = $1, question_type = $2, options = $3, correct_answer = $4, 
                points = $5, explanation = $6, difficulty_level = $7, category = $8, 
                order_index = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `, [questionText, questionType, JSON.stringify(options), correctAnswer, points, explanation, difficultyLevel, category, orderIndex, questionId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({
            success: true,
            question: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating quiz question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Delete quiz question
router.delete('/admin/questions/:questionId', authenticateToken, async (req, res) => {
    try {
        const { questionId } = req.params;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const result = await pool.query(
            'DELETE FROM quiz_questions WHERE id = $1 RETURNING id',
            [questionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting quiz question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get quiz analytics
router.get('/admin/analytics/:programId', authenticateToken, async (req, res) => {
    try {
        const { programId } = req.params;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const analytics = await pool.query(`
            SELECT 
                COUNT(DISTINCT qs.student_id) as students_participated,
                COUNT(DISTINCT qq.id) as total_questions,
                COUNT(qs.id) as total_submissions,
                ROUND(AVG(CASE WHEN qs.is_correct THEN 1.0 ELSE 0.0 END) * 100, 2) as overall_success_rate,
                ROUND(AVG(qs.score), 2) as average_score
            FROM quiz_questions qq
            LEFT JOIN quiz_submissions qs ON qq.id = qs.question_id
            WHERE qq.program_id = $1
        `, [programId]);

        const questionStats = await pool.query(`
            SELECT 
                qq.question_text,
                qq.difficulty_level,
                COUNT(qs.id) as attempts,
                ROUND(AVG(CASE WHEN qs.is_correct THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
            FROM quiz_questions qq
            LEFT JOIN quiz_submissions qs ON qq.id = qs.question_id
            WHERE qq.program_id = $1
            GROUP BY qq.id, qq.question_text, qq.difficulty_level
            ORDER BY success_rate ASC
        `, [programId]);

        res.json({
            success: true,
            analytics: {
                overview: analytics.rows[0],
                question_performance: questionStats.rows
            }
        });
    } catch (error) {
        console.error('Error fetching quiz analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;