const express = require('express');
const { Pool } = require('pg');
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'winst_internship',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Share certificate to social media
router.post('/share', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { 
            certificateId, 
            platform, 
            message, 
            shareUrl,
            metadata 
        } = req.body;

        const userId = req.user.id;

        // Validate certificate ownership
        const certResult = await client.query(
            'SELECT * FROM certificates WHERE id = $1 AND student_id = $2',
            [certificateId, userId]
        );

        if (certResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                error: 'Certificate not found or access denied' 
            });
        }

        const certificate = certResult.rows[0];

        // Check if already shared to this platform today
        const existingShare = await client.query(`
            SELECT id FROM certificate_shares 
            WHERE certificate_id = $1 AND platform = $2 AND DATE(shared_at) = CURRENT_DATE
        `, [certificateId, platform]);

        if (existingShare.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'Certificate already shared to this platform today' 
            });
        }

        // Create share record
        const shareResult = await client.query(`
            INSERT INTO certificate_shares 
            (certificate_id, student_id, platform, message, share_url, metadata, shared_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *
        `, [
            certificateId, userId, platform, message, 
            shareUrl, JSON.stringify(metadata || {})
        ]);

        // Update certificate share count
        await client.query(
            'UPDATE certificates SET share_count = share_count + 1 WHERE id = $1',
            [certificateId]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            share: shareResult.rows[0],
            message: 'Certificate shared successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error sharing certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Get sharing analytics for a certificate
router.get('/analytics/:certificateId', authenticateToken, async (req, res) => {
    try {
        const { certificateId } = req.params;
        const userId = req.user.id;

        // Validate certificate ownership (or admin access)
        const certResult = await pool.query(
            'SELECT * FROM certificates WHERE id = $1 AND (student_id = $2 OR $3 = \'admin\')',
            [certificateId, userId, req.user.role]
        );

        if (certResult.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Certificate not found or access denied' 
            });
        }

        // Get share analytics
        const analytics = await pool.query(`
            SELECT 
                platform,
                COUNT(*) as share_count,
                MAX(shared_at) as last_shared,
                SUM((metadata->>'engagement')::int) as total_engagement
            FROM certificate_shares 
            WHERE certificate_id = $1
            GROUP BY platform
            ORDER BY share_count DESC
        `, [certificateId]);

        const totalShares = await pool.query(
            'SELECT COUNT(*) as total, share_count FROM certificate_shares cs JOIN certificates c ON cs.certificate_id = c.id WHERE cs.certificate_id = $1 GROUP BY c.share_count',
            [certificateId]
        );

        res.json({
            success: true,
            analytics: {
                platform_breakdown: analytics.rows,
                total_shares: totalShares.rows[0]?.total || 0,
                certificate_share_count: totalShares.rows[0]?.share_count || 0
            }
        });

    } catch (error) {
        console.error('Error fetching share analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Generate social media share content
router.post('/generate-content', authenticateToken, async (req, res) => {
    try {
        const { certificateId, platform } = req.body;
        const userId = req.user.id;

        // Get certificate details
        const certResult = await pool.query(`
            SELECT 
                c.*,
                u.name as student_name,
                p.name as program_name
            FROM certificates c
            JOIN users u ON c.student_id = u.id
            JOIN programs p ON c.program_id = p.id
            WHERE c.id = $1 AND c.student_id = $2
        `, [certificateId, userId]);

        if (certResult.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Certificate not found' 
            });
        }

        const certificate = certResult.rows[0];
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificate.verification_code}`;
        const downloadUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/certificates/download/${certificate.verification_code}`;

        let shareContent = {};

        switch (platform.toLowerCase()) {
            case 'linkedin':
                shareContent = {
                    title: '🎓 Certificate Achievement!',
                    message: `I'm excited to share that I've successfully completed the ${certificate.program_name} at WINST! 

Achieved a final score of ${certificate.final_score}% and gained valuable hands-on experience in modern technologies.

${certificate.specialization ? `Specialized in: ${certificate.specialization}` : ''}

Thank you WINST for this incredible learning journey! 🚀

#Internship #TechSkills #ProfessionalDevelopment #Certificate #WINST`,
                    url: verifyUrl,
                    hashtags: ['Internship', 'TechSkills', 'Certificate', 'WINST', 'ProfessionalDevelopment']
                };
                break;

            case 'twitter':
                shareContent = {
                    message: `🎓 Just completed the ${certificate.program_name} @WINST_Official! 

Scored ${certificate.final_score}% and gained amazing hands-on experience.

#Internship #TechSkills #Certificate #WINST`,
                    url: verifyUrl,
                    hashtags: ['Internship', 'TechSkills', 'Certificate', 'WINST']
                };
                break;

            case 'facebook':
                shareContent = {
                    message: `🎓 Thrilled to announce that I've successfully completed the ${certificate.program_name} at WINST!

I achieved a final score of ${certificate.final_score}% and had an incredible learning experience working with cutting-edge technologies.

${certificate.specialization ? `My specialization was in ${certificate.specialization}, which has equipped me with valuable industry-relevant skills.` : ''}

A big thank you to the WINST team for providing such a comprehensive and engaging internship program! 🚀

You can verify my certificate here: ${verifyUrl}`,
                    url: verifyUrl
                };
                break;

            case 'email':
                shareContent = {
                    subject: `${certificate.student_name} - Certificate of Completion: ${certificate.program_name}`,
                    message: `Dear Hiring Manager,

I hope this email finds you well. I am writing to share my recent achievement in completing the ${certificate.program_name} at WINST.

🎓 Program Details:
• Program: ${certificate.program_name}
• Final Score: ${certificate.final_score}%
• Completion Date: ${new Date(certificate.completion_date).toLocaleDateString()}
${certificate.specialization ? `• Specialization: ${certificate.specialization}` : ''}

During this internship, I gained hands-on experience with modern technologies and industry best practices. The program provided practical exposure to real-world projects and enhanced my technical skills significantly.

You can verify the authenticity of this certificate at: ${verifyUrl}

Certificate can be downloaded from: ${downloadUrl}

I believe this additional qualification demonstrates my commitment to continuous learning and professional development.

Thank you for your time and consideration.

Best regards,
${certificate.student_name}`,
                    verifyUrl,
                    downloadUrl
                };
                break;

            default:
                return res.status(400).json({ 
                    error: 'Unsupported platform' 
                });
        }

        res.json({
            success: true,
            platform,
            content: shareContent,
            certificate: {
                id: certificate.id,
                program_name: certificate.program_name,
                final_score: certificate.final_score,
                verification_code: certificate.verification_code,
                verify_url: verifyUrl,
                download_url: downloadUrl
            }
        });

    } catch (error) {
        console.error('Error generating share content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Track engagement on shared content
router.post('/track-engagement', authenticateToken, async (req, res) => {
    try {
        const { shareId, engagementType, engagementData } = req.body;
        const userId = req.user.id;

        // Validate share ownership
        const shareResult = await pool.query(
            'SELECT * FROM certificate_shares WHERE id = $1 AND student_id = $2',
            [shareId, userId]
        );

        if (shareResult.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Share record not found' 
            });
        }

        // Update engagement metadata
        const currentMetadata = shareResult.rows[0].metadata || {};
        const updatedMetadata = {
            ...currentMetadata,
            engagement: {
                ...currentMetadata.engagement,
                [engagementType]: (currentMetadata.engagement?.[engagementType] || 0) + 1,
                total: (currentMetadata.engagement?.total || 0) + 1,
                last_updated: new Date().toISOString()
            },
            engagement_data: {
                ...currentMetadata.engagement_data,
                ...engagementData
            }
        };

        await pool.query(
            'UPDATE certificate_shares SET metadata = $1 WHERE id = $2',
            [JSON.stringify(updatedMetadata), shareId]
        );

        res.json({
            success: true,
            message: 'Engagement tracked successfully'
        });

    } catch (error) {
        console.error('Error tracking engagement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's sharing history
router.get('/my-shares', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT 
                cs.*,
                c.verification_code,
                c.final_score,
                p.name as program_name
            FROM certificate_shares cs
            JOIN certificates c ON cs.certificate_id = c.id
            JOIN programs p ON c.program_id = p.id
            WHERE cs.student_id = $1
        `;

        const params = [userId];
        let paramCount = 1;

        if (platform) {
            query += ` AND cs.platform = $${++paramCount}`;
            params.push(platform);
        }

        query += ` ORDER BY cs.shared_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            shares: result.rows
        });

    } catch (error) {
        console.error('Error fetching share history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get sharing analytics for all certificates
router.get('/admin/analytics', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { programId, platform, dateRange } = req.query;

        let query = `
            SELECT 
                cs.platform,
                COUNT(*) as share_count,
                COUNT(DISTINCT cs.certificate_id) as certificates_shared,
                COUNT(DISTINCT cs.student_id) as students_sharing,
                AVG((cs.metadata->>'engagement'->>'total')::int) as avg_engagement
            FROM certificate_shares cs
            JOIN certificates c ON cs.certificate_id = c.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (programId) {
            query += ` AND c.program_id = $${++paramCount}`;
            params.push(programId);
        }

        if (platform) {
            query += ` AND cs.platform = $${++paramCount}`;
            params.push(platform);
        }

        if (dateRange) {
            query += ` AND cs.shared_at >= CURRENT_DATE - INTERVAL '${dateRange} days'`;
        }

        query += ` GROUP BY cs.platform ORDER BY share_count DESC`;

        const analytics = await pool.query(query, params);

        // Get top performing certificates
        const topCertificates = await pool.query(`
            SELECT 
                c.id,
                c.verification_code,
                u.name as student_name,
                p.name as program_name,
                COUNT(cs.id) as share_count,
                c.final_score
            FROM certificates c
            JOIN users u ON c.student_id = u.id
            JOIN programs p ON c.program_id = p.id
            LEFT JOIN certificate_shares cs ON c.id = cs.certificate_id
            GROUP BY c.id, u.name, p.name
            ORDER BY share_count DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            analytics: {
                platform_breakdown: analytics.rows,
                top_certificates: topCertificates.rows
            }
        });

    } catch (error) {
        console.error('Error fetching admin sharing analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;