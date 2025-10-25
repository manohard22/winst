const express = require('express');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'winst_internship',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Ensure certificates directory exists
const certificatesDir = path.join(__dirname, '../certificates');
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
}

// Generate PDF certificate
async function generateCertificatePDF(certificateData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
            const filename = `certificate_${certificateData.verification_code}.pdf`;
            const filepath = path.join(certificatesDir, filename);
            
            doc.pipe(fs.createWriteStream(filepath));

            // Certificate design
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const margin = 50;

            // Border
            doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2))
               .lineWidth(3)
               .stroke('#1e40af');

            // Inner border
            doc.rect(margin + 20, margin + 20, pageWidth - (margin * 2) - 40, pageHeight - (margin * 2) - 40)
               .lineWidth(1)
               .stroke('#3b82f6');

            // Header - WINST Logo Area
            doc.fontSize(28)
               .fillColor('#1e40af')
               .text('WINST', margin + 50, margin + 60, { align: 'left' });

            doc.fontSize(14)
               .fillColor('#6b7280')
               .text('Internship Program', margin + 50, margin + 95);

            // Main title
            doc.fontSize(36)
               .fillColor('#1f2937')
               .text('CERTIFICATE OF COMPLETION', 0, margin + 150, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Subtitle
            doc.fontSize(16)
               .fillColor('#6b7280')
               .text('This is to certify that', 0, margin + 200, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Student name
            doc.fontSize(32)
               .fillColor('#1e40af')
               .text(certificateData.student_name.toUpperCase(), 0, margin + 240, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Achievement text
            doc.fontSize(16)
               .fillColor('#374151')
               .text('has successfully completed the', 0, margin + 290, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Program name
            doc.fontSize(24)
               .fillColor('#1e40af')
               .text(certificateData.program_name, 0, margin + 320, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Program specialization
            if (certificateData.specialization) {
                doc.fontSize(16)
                   .fillColor('#6b7280')
                   .text(`Specialization: ${certificateData.specialization}`, 0, margin + 360, { 
                       align: 'center',
                       width: pageWidth 
                   });
            }

            // Score and completion details
            doc.fontSize(14)
               .fillColor('#374151')
               .text(`Score: ${certificateData.final_score}% | Completion Date: ${new Date(certificateData.completion_date).toLocaleDateString()}`, 
                     0, margin + 390, { 
                       align: 'center',
                       width: pageWidth 
                   });

            // Footer section
            const footerY = pageHeight - margin - 100;

            // Verification code
            doc.fontSize(12)
               .fillColor('#6b7280')
               .text(`Verification Code: ${certificateData.verification_code}`, margin + 50, footerY);

            // Issue date
            doc.fontSize(12)
               .fillColor('#6b7280')
               .text(`Issued on: ${new Date(certificateData.issued_date).toLocaleDateString()}`, 
                     pageWidth - margin - 200, footerY);

            // Digital signature area
            doc.fontSize(12)
               .fillColor('#374151')
               .text('Director, WINST Internship Program', 0, footerY + 30, { 
                   align: 'center',
                   width: pageWidth 
               });

            // Verification URL
            doc.fontSize(10)
               .fillColor('#3b82f6')
               .text(`Verify at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificateData.verification_code}`, 
                     0, footerY + 50, { 
                       align: 'center',
                       width: pageWidth 
                   });

            doc.end();

            doc.on('end', () => {
                resolve({
                    filename,
                    filepath,
                    relativePath: `certificates/${filename}`
                });
            });

        } catch (error) {
            reject(error);
        }
    });
}

// Generate certificate for student
router.post('/generate', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { enrollmentId, specialization } = req.body;
        const userId = req.user.id;

        // Get enrollment and program details
        const enrollmentResult = await client.query(`
            SELECT 
                e.*,
                p.name as program_name,
                u.name as student_name,
                u.email as student_email
            FROM enrollments e
            JOIN programs p ON e.program_id = p.id
            JOIN users u ON e.student_id = u.id
            WHERE e.id = $1 AND e.student_id = $2 AND e.status = 'completed'
        `, [enrollmentId, userId]);

        if (enrollmentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                error: 'Enrollment not found or not completed' 
            });
        }

        const enrollment = enrollmentResult.rows[0];

        // Calculate completion score
        const scoreResult = await client.query(`
            SELECT 
                COALESCE(AVG(
                    CASE 
                        WHEN qs.score IS NOT NULL AND ps.score IS NOT NULL 
                        THEN (qs.score + ps.score) / 2.0
                        WHEN qs.score IS NOT NULL 
                        THEN qs.score
                        WHEN ps.score IS NOT NULL 
                        THEN ps.score
                        ELSE 0
                    END
                ), 0) as final_score
            FROM tasks t
            LEFT JOIN quiz_submissions qs ON t.id = qs.question_id AND qs.student_id = $1
            LEFT JOIN project_submissions ps ON t.id = ps.task_id AND ps.student_id = $1
            WHERE t.program_id = $2
        `, [userId, enrollment.program_id]);

        const finalScore = Math.round(scoreResult.rows[0].final_score || 0);

        // Check if certificate already exists
        const existingCert = await client.query(
            'SELECT * FROM certificates WHERE enrollment_id = $1',
            [enrollmentId]
        );

        let certificate;
        if (existingCert.rows.length > 0) {
            certificate = existingCert.rows[0];
        } else {
            // Create new certificate record
            const verificationCode = uuidv4();
            const certResult = await client.query(`
                INSERT INTO certificates 
                (enrollment_id, student_id, program_id, verification_code, final_score, specialization, completion_date, issued_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
                RETURNING *
            `, [
                enrollmentId, userId, enrollment.program_id, 
                verificationCode, finalScore, specialization, 
                enrollment.completion_date || new Date()
            ]);

            certificate = certResult.rows[0];
        }

        // Generate PDF
        const certificateData = {
            ...certificate,
            student_name: enrollment.student_name,
            program_name: enrollment.program_name,
            student_email: enrollment.student_email
        };

        const pdfResult = await generateCertificatePDF(certificateData);

        // Update certificate with file path
        await client.query(
            'UPDATE certificates SET file_path = $1 WHERE id = $2',
            [pdfResult.relativePath, certificate.id]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            certificate: {
                ...certificate,
                file_path: pdfResult.relativePath,
                download_url: `/api/certificates/download/${certificate.verification_code}`
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Download certificate
router.get('/download/:verificationCode', async (req, res) => {
    try {
        const { verificationCode } = req.params;

        const result = await pool.query(
            'SELECT * FROM certificates WHERE verification_code = $1',
            [verificationCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        const certificate = result.rows[0];
        const filepath = path.join(__dirname, '..', certificate.file_path);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Certificate file not found' });
        }

        // Update download count
        await pool.query(
            'UPDATE certificates SET download_count = download_count + 1 WHERE id = $1',
            [certificate.id]
        );

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate_${verificationCode}.pdf"`);
        
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error downloading certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify certificate
router.get('/verify/:verificationCode', async (req, res) => {
    try {
        const { verificationCode } = req.params;

        const result = await pool.query(`
            SELECT 
                c.*,
                u.name as student_name,
                u.email as student_email,
                p.name as program_name
            FROM certificates c
            JOIN users u ON c.student_id = u.id
            JOIN programs p ON c.program_id = p.id
            WHERE c.verification_code = $1
        `, [verificationCode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Certificate not found' 
            });
        }

        const certificate = result.rows[0];

        res.json({
            success: true,
            certificate: {
                id: certificate.id,
                student_name: certificate.student_name,
                program_name: certificate.program_name,
                specialization: certificate.specialization,
                final_score: certificate.final_score,
                completion_date: certificate.completion_date,
                issued_date: certificate.issued_date,
                verification_code: certificate.verification_code,
                is_valid: true
            }
        });

    } catch (error) {
        console.error('Error verifying certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's certificates
router.get('/my-certificates', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT 
                c.*,
                p.name as program_name,
                e.completion_date as program_completion_date
            FROM certificates c
            JOIN programs p ON c.program_id = p.id
            JOIN enrollments e ON c.enrollment_id = e.id
            WHERE c.student_id = $1
            ORDER BY c.issued_date DESC
        `, [userId]);

        res.json({
            success: true,
            certificates: result.rows
        });

    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: Get all certificates
router.get('/admin/certificates', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { programId, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT 
                c.*,
                u.name as student_name,
                u.email as student_email,
                p.name as program_name
            FROM certificates c
            JOIN users u ON c.student_id = u.id
            JOIN programs p ON c.program_id = p.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (programId) {
            query += ` AND c.program_id = $${++paramCount}`;
            params.push(programId);
        }

        query += ` ORDER BY c.issued_date DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            certificates: result.rows
        });

    } catch (error) {
        console.error('Error fetching admin certificates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
