const express = require("express");
const pool = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate certificate PDF
const generateCertificate = async (
  studentName,
  programTitle,
  completionDate,
  certificateNumber,
  assessmentScore,
  projectScore
) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });
      const fileName = `certificate_${certificateNumber}.pdf`;
      const filePath = path.join(__dirname, "../certificates", fileName);

      // Ensure certificates directory exists
      const certDir = path.dirname(filePath);
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }

      doc.pipe(fs.createWriteStream(filePath));

      // Certificate design
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

      // Header
      doc.fontSize(42).font("Helvetica-Bold").fillColor("#2563eb");
      doc.text("CERTIFICATE OF COMPLETION", 0, 80, { align: "center" });

      // Winst branding
      doc.fontSize(28).fillColor("#6366f1");
      doc.text("LUCRO", 0, 140, { align: "center" });
      doc.fontSize(16).fillColor("#64748b");
      doc.text("Empowering Careers Through Practical Learning", 0, 170, {
        align: "center",
      });

      // Main content
      doc.fontSize(20).fillColor("#1f2937");
      doc.text("This is to certify that", 0, 220, { align: "center" });

      doc.fontSize(36).font("Helvetica-Bold").fillColor("#2563eb");
      doc.text(studentName, 0, 260, { align: "center" });

      doc.fontSize(20).font("Helvetica").fillColor("#1f2937");
      doc.text("has successfully completed the", 0, 320, { align: "center" });

      doc.fontSize(28).font("Helvetica-Bold").fillColor("#059669");
      doc.text(programTitle, 0, 360, { align: "center" });

      // Performance metrics
      doc.fontSize(16).fillColor("#1f2937");
      doc.text(`Assessment Score: ${assessmentScore}%`, 0, 420, {
        align: "center",
      });
      doc.text(`Project Score: ${projectScore}/100`, 0, 445, {
        align: "center",
      });

      doc.fontSize(18).fillColor("#6366f1");
      doc.text(`Completion Date: ${completionDate}`, 0, 480, {
        align: "center",
      });

      // Certificate number and verification
      doc.fontSize(12).fillColor("#64748b");
      doc.text(`Certificate Number: ${certificateNumber}`, 0, 520, {
        align: "center",
      });
      doc.text(
        "This certificate is digitally verified and issued by Winst Technologies Pvt. Ltd.",
        0,
        540,
        { align: "center" }
      );

      // Footer
      doc.fontSize(14).fillColor("#1f2937");
      doc.text(
        "Winst Technologies Pvt. Ltd. | HITEC City, Hyderabad | www.lucro.in",
        0,
        570,
        { align: "center" }
      );

      doc.end();
      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};

// Generate certificate for eligible student
router.post(
  "/generate/:enrollmentId",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { enrollmentId } = req.params;

      // Get enrollment details
      const enrollmentResult = await pool.query(
        `
      SELECT 
        si.*,
        u.first_name,
        u.last_name,
        u.email,
        p.title as program_title,
        aa.score_percentage as assessment_score,
        ps.score as project_score
      FROM student_internship si
      JOIN users u ON si.student_id = u.id
      JOIN internship_programs p ON si.program_id = p.id
      LEFT JOIN assessment_attempts aa ON si.id = aa.enrollment_id AND aa.status = 'completed'
      LEFT JOIN project_submissions ps ON si.id = ps.enrollment_id AND ps.status = 'approved'
      WHERE si.id = $1 AND si.certificate_eligible = true
    `,
        [enrollmentId]
      );

      if (enrollmentResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found or not eligible for certificate",
        });
      }

      const enrollment = enrollmentResult.rows[0];

      // Check if certificate already exists
      const existingCert = await pool.query(
        "SELECT id FROM certificates WHERE enrollment_id = $1",
        [enrollmentId]
      );

      if (existingCert.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Certificate already generated for this enrollment",
        });
      }

      // Generate certificate number
      const certificateNumber = `LUCRO-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;
      const verificationCode = Math.random()
        .toString(36)
        .substr(2, 12)
        .toUpperCase();

      const studentName = `${enrollment.first_name} ${enrollment.last_name}`;
      const completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Generate PDF certificate
      const certificatePath = await generateCertificate(
        studentName,
        enrollment.program_title,
        completionDate,
        certificateNumber,
        enrollment.assessment_score || 0,
        enrollment.project_score || 0
      );

      // Save certificate record
      const certResult = await pool.query(
        `
      INSERT INTO certificates (
        student_id, program_id, enrollment_id, certificate_number,
        certificate_url, assessment_score, project_score, verification_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
        [
          enrollment.student_id,
          enrollment.program_id,
          enrollmentId,
          certificateNumber,
          `/certificates/${path.basename(certificatePath)}`,
          enrollment.assessment_score,
          enrollment.project_score,
          verificationCode,
        ]
      );

      // Update enrollment
      await pool.query(
        `
      UPDATE student_internship 
      SET certificate_issued = true, certificate_url = $1
      WHERE id = $2
    `,
        [`/certificates/${path.basename(certificatePath)}`, enrollmentId]
      );

      // Update learning journey
      await pool.query(
        `
      UPDATE learning_journey 
      SET current_step = 'certificate_issued', 
          step_completed_at = CURRENT_TIMESTAMP,
          progress_percentage = 100,
          updated_at = CURRENT_TIMESTAMP
      WHERE enrollment_id = $1
    `,
        [enrollmentId]
      );

      // Send certificate via email
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER || "noreply@lucro.com",
          to: enrollment.email,
          subject: `🎉 Certificate of Completion - ${enrollment.program_title}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You've earned your certificate</p>
            </div>
            
            <div style="padding: 30px; background: #f8fafc; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Dear ${studentName},</h2>
              
              <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
                We're thrilled to inform you that you have successfully completed the 
                <strong>${enrollment.program_title}</strong> program at Winst!
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
                <h3 style="color: #059669; margin: 0 0 10px 0;">🎯 Your Achievement Summary:</h3>
                <ul style="color: #374151; margin: 0; padding-left: 20px;">
                  <li>Assessment Score: <strong>${
                    enrollment.assessment_score || 0
                  }%</strong></li>
                  <li>Project Score: <strong>${
                    enrollment.project_score || 0
                  }/100</strong></li>
                  <li>Completion Date: <strong>${completionDate}</strong></li>
                  <li>Certificate Number: <strong>${certificateNumber}</strong></li>
                </ul>
              </div>
              
              <p style="color: #374151; line-height: 1.6; margin: 20px 0;">
                Your certificate has been generated and is now available for download. 
                You can access it anytime from your student dashboard or use the verification code 
                <strong>${verificationCode}</strong> to verify its authenticity.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.FRONTEND_URL
                }/certificates/${certificateNumber}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📄 Download Certificate
                </a>
              </div>
              
              <p style="color: #374151; line-height: 1.6; margin: 20px 0;">
                This achievement represents your dedication to learning and professional growth. 
                We're proud to have been part of your journey and wish you continued success in your career.
              </p>
              
              <p style="color: #374151; line-height: 1.6; margin: 20px 0;">
                Don't forget to share your achievement on LinkedIn and other professional networks!
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
              <p style="margin: 0;">
                <strong>Winst Technologies Pvt. Ltd.</strong><br>
                HITEC City, Hyderabad<br>
                <a href="https://www.lucro.in" style="color: #2563eb;">www.lucro.in</a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        `,
          attachments: [
            {
              filename: `Certificate_${studentName.replace(/\s+/g, "_")}.pdf`,
              path: certificatePath,
            },
          ],
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Continue with success response even if email fails
      }

      res.json({
        success: true,
        message: "Certificate generated and sent successfully",
        data: {
          certificateId: certResult.rows[0].id,
          certificateNumber,
          verificationCode,
          certificateUrl: `/certificates/${path.basename(certificatePath)}`,
        },
      });
    } catch (error) {
      console.error("Certificate generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate certificate",
        error: error.message,
      });
    }
  }
);

// Get certificate details
router.get("/:certificateId", authenticateToken, async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.email,
        p.title as program_title,
        p.description as program_description
      FROM certificates c
      JOIN users u ON c.student_id = u.id
      JOIN internship_programs p ON c.program_id = p.id
      WHERE c.id = $1
    `;

    const params = [certificateId];

    // If not admin, restrict to own certificates
    if (userRole !== "admin") {
      query += " AND c.student_id = $2";
      params.push(userId);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const certificate = result.rows[0];

    res.json({
      success: true,
      data: {
        ...certificate,
        student_name: `${certificate.first_name} ${certificate.last_name}`,
      },
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
      error: error.message,
    });
  }
});

// Verify certificate by number or verification code
router.post("/verify", async (req, res) => {
  try {
    const { certificateNumber, verificationCode } = req.body;

    if (!certificateNumber && !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Certificate number or verification code is required",
      });
    }

    let query = `
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        p.title as program_title,
        p.description as program_description
      FROM certificates c
      JOIN users u ON c.student_id = u.id
      JOIN internship_programs p ON c.program_id = p.id
      WHERE 
    `;

    const params = [];

    if (certificateNumber) {
      query += "c.certificate_number = $1";
      params.push(certificateNumber);
    } else {
      query += "c.verification_code = $1";
      params.push(verificationCode);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid",
      });
    }

    const certificate = result.rows[0];

    res.json({
      success: true,
      message: "Certificate verified successfully",
      data: {
        certificateNumber: certificate.certificate_number,
        studentName: `${certificate.first_name} ${certificate.last_name}`,
        programTitle: certificate.program_title,
        issueDate: certificate.created_at,
        assessmentScore: certificate.assessment_score,
        projectScore: certificate.project_score,
        isValid: true,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
      error: error.message,
    });
  }
});

// Get all certificates for a student
router.get("/student/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check authorization
    if (userRole !== "admin" && parseInt(studentId) !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const result = await pool.query(
      `
      SELECT 
        c.*,
        p.title as program_title,
        p.description as program_description
      FROM certificates c
      JOIN internship_programs p ON c.program_id = p.id
      WHERE c.student_id = $1
      ORDER BY c.created_at DESC
    `,
      [studentId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student certificates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
});

// Download certificate PDF
router.get("/download/:certificateNumber", async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const result = await pool.query(
      `
      SELECT certificate_url, student_id
      FROM certificates 
      WHERE certificate_number = $1
    `,
      [certificateNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const certificate = result.rows[0];
    const filePath = path.join(__dirname, "..", certificate.certificate_url);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Certificate file not found",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate_${certificateNumber}.pdf"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Certificate download error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download certificate",
      error: error.message,
    });
  }
});

// Get certificate statistics (admin only)
router.get(
  "/stats/overview",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_certificates,
        COUNT(DISTINCT student_id) as unique_students,
        COUNT(DISTINCT program_id) as programs_with_certificates,
        AVG(assessment_score) as avg_assessment_score,
        AVG(project_score) as avg_project_score
      FROM certificates
    `);

      const monthlyStats = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as certificates_issued
      FROM certificates
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

      res.json({
        success: true,
        data: {
          overview: stats.rows[0],
          monthly: monthlyStats.rows,
        },
      });
    } catch (error) {
      console.error("Error fetching certificate stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
        error: error.message,
      });
    }
  }
);

module.exports = router;
