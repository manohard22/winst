const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'winst_internship',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Validate GitHub URL and extract repository info
async function validateGitHubUrl(githubUrl) {
    try {
        // Extract owner and repo from GitHub URL
        const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            return { valid: false, error: 'Invalid GitHub URL format' };
        }

        const [, owner, repo] = match;
        const cleanRepo = repo.replace('.git', '');

        // Check if repository exists and is public
        const response = await axios.get(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Winst-Internship-Portal'
            }
        });

        if (response.status === 200) {
            const repoData = response.data;
            return {
                valid: true,
                data: {
                    owner: repoData.owner.login,
                    name: repoData.name,
                    full_name: repoData.full_name,
                    description: repoData.description,
                    language: repoData.language,
                    stars: repoData.stargazers_count,
                    forks: repoData.forks_count,
                    is_private: repoData.private,
                    created_at: repoData.created_at,
                    updated_at: repoData.updated_at,
                    clone_url: repoData.clone_url,
                    html_url: repoData.html_url,
                    homepage: repoData.homepage
                }
            };
        }

        return { valid: false, error: 'Repository not found or not accessible' };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { valid: false, error: 'Repository not found' };
        }
        if (error.response && error.response.status === 403) {
            return { valid: false, error: 'Repository is private or access denied' };
        }
        return { valid: false, error: 'Unable to validate repository' };
    }
}

// Submit a project
router.post('/submit', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            taskId,
            githubUrl,
            liveUrl,
            description,
            techStack,
            implementationNotes
        } = req.body;

        const userId = req.user.id;

        // Validate required fields
        if (!taskId || !githubUrl || !description) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'Task ID, GitHub URL, and description are required' 
            });
        }

        // Validate GitHub URL
        const githubValidation = await validateGitHubUrl(githubUrl);
        if (!githubValidation.valid) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: `GitHub URL validation failed: ${githubValidation.error}` 
            });
        }

        // Check if task exists and user is enrolled
        const taskCheck = await client.query(`
            SELECT t.*, e.id as enrollment_id
            FROM tasks t
            JOIN enrollments e ON t.program_id = e.program_id
            WHERE t.id = $1 AND e.student_id = $2 AND e.status = 'active'
        `, [taskId, userId]);

        if (taskCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ 
                error: 'Task not found or you are not enrolled in this program' 
            });
        }

        const task = taskCheck.rows[0];

        // Check if project already submitted
        const existingSubmission = await client.query(
            'SELECT id FROM project_submissions WHERE task_id = $1 AND student_id = $2',
            [taskId, userId]
        );

        let result;
        if (existingSubmission.rows.length > 0) {
            // Update existing submission
            result = await client.query(`
                UPDATE project_submissions 
                SET github_url = $1, live_url = $2, description = $3, tech_stack = $4,
                    implementation_notes = $5, github_data = $6, status = 'submitted', submitted_at = CURRENT_TIMESTAMP
                WHERE task_id = $7 AND student_id = $8
                RETURNING *
            `, [
                githubUrl, liveUrl, description, techStack, 
                implementationNotes, JSON.stringify(githubValidation.data),
                taskId, userId
            ]);
        } else {
            // Create new submission
            result = await client.query(`
                INSERT INTO project_submissions 
                (task_id, student_id, github_url, live_url, description, tech_stack, implementation_notes, github_data, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'submitted')
                RETURNING *
            `, [
                taskId, userId, githubUrl, liveUrl, description, 
                techStack, implementationNotes, JSON.stringify(githubValidation.data)
            ]);
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            submission: result.rows[0],
            github_info: githubValidation.data
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error submitting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Get student's project submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT 
                ps.*,
                t.title as task_title,
                t.description as task_description,
                p.name as program_name
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            JOIN programs p ON t.program_id = p.id
            WHERE ps.student_id = $1
            ORDER BY ps.submitted_at DESC
        `, [userId]);

        res.json({
            success: true,
            submissions: result.rows
        });
    } catch (error) {
        console.error('Error fetching project submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get submission details
router.get('/submission/:submissionId', authenticateToken, async (req, res) => {
    try {
        const { submissionId } = req.params;
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT 
                ps.*,
                t.title as task_title,
                t.description as task_description,
                p.name as program_name,
                u.name as student_name,
                u.email as student_email
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            JOIN programs p ON t.program_id = p.id
            JOIN users u ON ps.student_id = u.id
            WHERE ps.id = $1 AND (ps.student_id = $2 OR $3 = 'admin')
        `, [submissionId, userId, req.user.role]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            success: true,
            submission: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching submission details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Validate GitHub URL endpoint
router.post('/validate-github', authenticateToken, async (req, res) => {
    try {
        const { githubUrl } = req.body;

        if (!githubUrl) {
            return res.status(400).json({ error: 'GitHub URL is required' });
        }

        const validation = await validateGitHubUrl(githubUrl);

        res.json({
            success: validation.valid,
            data: validation.data || null,
            error: validation.error || null
        });
    } catch (error) {
        console.error('Error validating GitHub URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get projects for a program (showcase)
router.get('/program/:programId', authenticateToken, async (req, res) => {
    try {
        const { programId } = req.params;
        const { limit = 10, offset = 0 } = req.query;

        const result = await pool.query(`
            SELECT 
                ps.id,
                ps.github_url,
                ps.live_url,
                ps.description,
                ps.tech_stack,
                ps.status,
                ps.score,
                ps.submitted_at,
                ps.github_data,
                t.title as task_title,
                u.name as student_name,
                (ps.github_data->>'stars')::int as github_stars
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            JOIN users u ON ps.student_id = u.id
            WHERE t.program_id = $1 AND ps.status IN ('submitted', 'reviewed', 'approved')
            ORDER BY ps.submitted_at DESC
            LIMIT $2 OFFSET $3
        `, [programId, limit, offset]);

        const countResult = await pool.query(`
            SELECT COUNT(*) as total
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            WHERE t.program_id = $1 AND ps.status IN ('submitted', 'reviewed', 'approved')
        `, [programId]);

        res.json({
            success: true,
            projects: result.rows,
            total: parseInt(countResult.rows[0].total),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching program projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get all submissions for review
router.get('/admin/submissions', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { status = 'all', programId, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT 
                ps.*,
                t.title as task_title,
                p.name as program_name,
                u.name as student_name,
                u.email as student_email
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            JOIN programs p ON t.program_id = p.id
            JOIN users u ON ps.student_id = u.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (status !== 'all') {
            query += ` AND ps.status = $${++paramCount}`;
            params.push(status);
        }

        if (programId) {
            query += ` AND t.program_id = $${++paramCount}`;
            params.push(programId);
        }

        query += ` ORDER BY ps.submitted_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            submissions: result.rows
        });
    } catch (error) {
        console.error('Error fetching admin submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Review and score submission
router.put('/admin/review/:submissionId', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { submissionId } = req.params;
        const { status, score, feedback } = req.body;

        const result = await pool.query(`
            UPDATE project_submissions 
            SET status = $1, score = $2, feedback = $3, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $4
            WHERE id = $5
            RETURNING *
        `, [status, score, feedback, req.user.id, submissionId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            success: true,
            submission: result.rows[0]
        });
    } catch (error) {
        console.error('Error reviewing submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get project analytics
router.get('/admin/analytics/:programId', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { programId } = req.params;

        const analytics = await pool.query(`
            SELECT 
                COUNT(*) as total_submissions,
                COUNT(CASE WHEN ps.status = 'submitted' THEN 1 END) as pending_review,
                COUNT(CASE WHEN ps.status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN ps.status = 'rejected' THEN 1 END) as rejected,
                ROUND(AVG(ps.score), 2) as average_score,
                COUNT(DISTINCT ps.student_id) as students_participated
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            WHERE t.program_id = $1
        `, [programId]);

        const techStats = await pool.query(`
            SELECT 
                ps.tech_stack,
                COUNT(*) as usage_count
            FROM project_submissions ps
            JOIN tasks t ON ps.task_id = t.id
            WHERE t.program_id = $1 AND ps.tech_stack IS NOT NULL
            GROUP BY ps.tech_stack
            ORDER BY usage_count DESC
        `, [programId]);

        res.json({
            success: true,
            analytics: {
                overview: analytics.rows[0],
                tech_usage: techStats.rows
            }
        });
    } catch (error) {
        console.error('Error fetching project analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get all submissions for a project
router.get('/admin/submissions/project/:projectId', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { projectId } = req.params;

        const result = await pool.query(
            `SELECT ps.*, u.first_name, u.last_name, u.email 
             FROM project_submissions ps
             JOIN users u ON ps.student_id = u.id
             WHERE ps.project_id = $1 
             ORDER BY ps.submitted_at DESC`,
            [projectId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get project submissions error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch project submissions' });
    }
});

// Admin: Update submission status
router.put('/admin/submission/:submissionId', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status, feedback } = req.body;

        const result = await pool.query(
            `UPDATE project_submissions 
             SET status = $1, feedback = $2, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP 
             WHERE id = $4 
             RETURNING *`,
            [status, feedback, req.user.id, submissionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        res.json({ success: true, message: 'Submission updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Update submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to update submission' });
    }
});

module.exports = router;
