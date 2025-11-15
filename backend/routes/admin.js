const express = require("express");
const pool = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireRole(["admin"]));

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

// Get dashboard statistics
router.get("/dashboard", async (req, res) => {
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
        recentEnrollments: recentEnrollments.rows.map((enrollment) => ({
          id: enrollment.id,
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status,
          student: {
            firstName: enrollment.first_name,
            lastName: enrollment.last_name,
            email: enrollment.email,
          },
          programTitle: enrollment.program_title,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

// Get all students
router.get("/students", async (req, res) => {
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
        students: result.rows.map((student) => ({
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
          createdAt: student.created_at,
        })),
      },
    });
  } catch (error) {
    console.error("Students fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
});

// Get all enrollments for admin
router.get("/enrollments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        si.id,
        si.student_id,
        si.program_id,
        si.enrollment_date,
        si.status,
        si.progress_percentage,
        si.start_date,
        si.expected_completion_date,
        si.actual_completion_date,
        si.final_grade,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        u.email as student_email,
        p.title as program_title,
        p.duration_weeks as program_duration
      FROM student_internship si
      JOIN users u ON si.student_id = u.id
      JOIN internship_programs p ON si.program_id = p.id
      ORDER BY si.enrollment_date DESC
    `);

    res.json({
      success: true,
      data: {
        enrollments: result.rows.map((enrollment) => ({
          id: enrollment.id,
          studentId: enrollment.student_id,
          programId: enrollment.program_id,
          studentName: `${enrollment.student_first_name} ${enrollment.student_last_name}`,
          studentEmail: enrollment.student_email,
          programTitle: enrollment.program_title,
          programDuration: enrollment.program_duration,
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status,
          progressPercentage: enrollment.progress_percentage,
          startDate: enrollment.start_date,
          expectedCompletionDate: enrollment.expected_completion_date,
          actualCompletionDate: enrollment.actual_completion_date,
          finalGrade: enrollment.final_grade,
        })),
      },
    });
  } catch (error) {
    console.error("Enrollments fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
});

// Update enrollment
router.put("/enrollments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressPercentage, finalGrade } = req.body;

    const result = await pool.query(
      `
      UPDATE student_internship SET
        status = $1,
        progress_percentage = $2,
        final_grade = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `,
      [status, progressPercentage, finalGrade, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      message: "Enrollment updated successfully",
      data: { enrollment: result.rows[0] },
    });
  } catch (error) {
    console.error("Enrollment update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment",
    });
  }
});

// Get all programs for admin
router.get("/programs", async (req, res) => {
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
        programs: result.rows.map((program) => ({
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
          updatedAt: program.updated_at,
        })),
      },
    });
  } catch (error) {
    console.error("Admin programs fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
    });
  }
});

// Referrals overview for admin
router.get("/referrals", async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT r.*, 
             ref.first_name AS referrer_first_name,
             ref.last_name  AS referrer_last_name,
             ref.email      AS referrer_email,
             ru.first_name  AS referred_first_name,
             ru.last_name   AS referred_last_name
      FROM referrals r
      JOIN users ref ON r.referrer_id = ref.id
      LEFT JOIN users ru ON r.referred_user_id = ru.id
      WHERE 1=1`;

    const params = [];
    let i = 0;
    if (status) {
      i++; params.push(status);
      query += ` AND r.status = $${i}`;
    }
    if (search) {
      i++; params.push(`%${search}%`);
      query += ` AND (r.referred_email ILIKE $${i} OR r.referral_code ILIKE $${i} OR ref.email ILIKE $${i})`;
    }
    i++; params.push(parseInt(limit));
    i++; params.push(parseInt(offset));
    query += ` ORDER BY r.created_at DESC LIMIT $${i-1} OFFSET $${i}`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        referrals: result.rows.map(r => ({
          id: r.id,
          referralCode: r.referral_code,
          referredEmail: r.referred_email,
          status: r.status,
          discountAmount: parseFloat(r.discount_amount),
          usedAt: r.used_at,
          expiresAt: r.expires_at,
          createdAt: r.created_at,
          referrer: { firstName: r.referrer_first_name, lastName: r.referrer_last_name, email: r.referrer_email },
          referredUser: r.referred_user_id ? { firstName: r.referred_first_name, lastName: r.referred_last_name } : null
        }))
      }
    });
  } catch (error) {
    console.error("Admin referrals fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch referrals" });
  }
});

// Create new program
router.post("/programs", async (req, res) => {
  try {
    const {
      title,
      description,
      durationWeeks,
      difficultyLevel,
      price,
      discountPercentage,
      finalPrice,
      maxParticipants,
      requirements,
      learningOutcomes,
      imageUrl,
      certificateProvided,
      mentorshipIncluded,
      projectBased,
      remoteAllowed,
      isActive,
    } = req.body;

    // Validate required fields
    if (!title || !description || !durationWeeks || !price || !finalPrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, durationWeeks, price, finalPrice",
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const result = await pool.query(
      `
      INSERT INTO internship_programs (
        title, slug, description, duration_weeks, difficulty_level, price, 
        discount_percentage, final_price, max_participants, requirements, 
        learning_outcomes, image_url, certificate_provided, mentorship_included, 
        project_based, remote_allowed, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `,
      [
        title,
        slug,
        description,
        durationWeeks,
        difficultyLevel,
        price,
        discountPercentage,
        finalPrice,
        maxParticipants,
        requirements,
        learningOutcomes,
        imageUrl,
        certificateProvided,
        mentorshipIncluded,
        projectBased,
        remoteAllowed,
        isActive,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: { program: result.rows[0] },
    });
  } catch (error) {
    console.error("Program creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create program",
    });
  }
});

// Update program
router.put("/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      durationWeeks,
      difficultyLevel,
      price,
      discountPercentage,
      finalPrice,
      maxParticipants,
      requirements,
      learningOutcomes,
      imageUrl,
      certificateProvided,
      mentorshipIncluded,
      projectBased,
      remoteAllowed,
      isActive,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE internship_programs SET
        title = $1, description = $2, duration_weeks = $3, difficulty_level = $4,
        price = $5, discount_percentage = $6, final_price = $7, max_participants = $8,
        requirements = $9, learning_outcomes = $10, image_url = $11,
        certificate_provided = $12, mentorship_included = $13, project_based = $14,
        remote_allowed = $15, is_active = $16, updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *
    `,
      [
        title,
        description,
        durationWeeks,
        difficultyLevel,
        price,
        discountPercentage,
        finalPrice,
        maxParticipants,
        requirements,
        learningOutcomes,
        imageUrl,
        certificateProvided,
        mentorshipIncluded,
        projectBased,
        remoteAllowed,
        isActive,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.json({
      success: true,
      message: "Program updated successfully",
      data: { program: result.rows[0] },
    });
  } catch (error) {
    console.error("Program update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update program",
    });
  }
});

// Delete program
router.delete("/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM internship_programs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Program deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete program",
    });
  }
});

// Generate and send certificates
const generateCertificate = (studentName, programTitle, completionDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });
      const fileName = `certificate_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "../certificates", fileName);

      // Ensure certificates directory exists
      const certDir = path.dirname(filePath);
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }

      doc.pipe(fs.createWriteStream(filePath));

      // Certificate design
      doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100).stroke();
      doc.rect(60, 60, doc.page.width - 120, doc.page.height - 120).stroke();

      // Header
      doc.fontSize(36).font("Helvetica-Bold").fillColor("#2563eb");
      doc.text("CERTIFICATE OF COMPLETION", 0, 120, { align: "center" });

      // Winst branding
      doc.fontSize(24).fillColor("#6366f1");
      doc.text("LUCRO", 0, 180, { align: "center" });
      doc.fontSize(14).fillColor("#64748b");
      doc.text("Empowering Careers", 0, 210, { align: "center" });

      // Main content
      doc.fontSize(18).fillColor("#1f2937");
      doc.text("This is to certify that", 0, 280, { align: "center" });

      doc.fontSize(32).font("Helvetica-Bold").fillColor("#2563eb");
      doc.text(studentName, 0, 320, { align: "center" });

      doc.fontSize(18).font("Helvetica").fillColor("#1f2937");
      doc.text("has successfully completed the", 0, 380, { align: "center" });

      doc.fontSize(24).font("Helvetica-Bold").fillColor("#059669");
      doc.text(programTitle, 0, 420, { align: "center" });

      doc.fontSize(16).font("Helvetica").fillColor("#1f2937");
      doc.text("on", 0, 460, { align: "center" });

      doc.fontSize(18).fillColor("#6366f1");
      doc.text(completionDate, 0, 490, { align: "center" });

      // Footer
      doc.fontSize(12).fillColor("#64748b");
      doc.text(
        "This certificate is digitally verified and issued by Winst",
        0,
        550,
        { align: "center" }
      );

      doc.end();

      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};

// Send certificates to all completed students
router.post("/programs/:id/send-certificates", async (req, res) => {
  try {
    const { id } = req.params;

    // Get program details
    const programResult = await pool.query(
      "SELECT title FROM internship_programs WHERE id = $1",
      [id]
    );

    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    const program = programResult.rows[0];

    // Get all completed students for this program
    const studentsResult = await pool.query(
      `
      SELECT 
        u.first_name,
        u.last_name,
        u.email,
        si.actual_completion_date
      FROM student_internship si
      JOIN users u ON si.student_id = u.id
      WHERE si.program_id = $1 AND si.status = 'completed'
    `,
      [id]
    );

    const students = studentsResult.rows;

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No completed students found for this program",
      });
    }

    // Send certificates to all students
    const emailPromises = students.map(async (student) => {
      try {
        const studentName = `${student.first_name} ${student.last_name}`;
        const completionDate = new Date(
          student.actual_completion_date || new Date()
        ).toLocaleDateString();

        // Generate certificate
        const certificatePath = await generateCertificate(
          studentName,
          program.title,
          completionDate
        );

  // SMTP sender will be derived from configured transport/user

        // Send email with certificate
        await transporter.sendMail({
          from: process.env.SMTP_USER || "noreply@winst.com",
          to: student.email,
          subject: `🎉 Certificate of Completion - ${program.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Congratulations, ${studentName}!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You've successfully completed your internship program</p>
              </div>
              
              <div style="padding: 30px; background: #f8fafc;">
                <h2 style="color: #2563eb; margin-bottom: 20px;">🎓 Certificate of Completion</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                  We are thrilled to inform you that you have successfully completed the 
                  <strong>${program.title}</strong> program at Winst!
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <h3 style="color: #059669; margin-top: 0;">What's Next?</h3>
                  <ul style="color: #374151; line-height: 1.6;">
                    <li>Add this certificate to your LinkedIn profile</li>
                    <li>Include it in your resume and portfolio</li>
                    <li>Share your achievement with your network</li>
                    <li>Apply for advanced programs at Winst</li>
                  </ul>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                  Your certificate is attached to this email. Keep up the excellent work!
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://winst.com" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Explore More Programs
                  </a>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    Best regards,<br>
                    <strong>The Winst Team</strong><br>
                    Empowering Careers
                  </p>
                </div>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `${studentName.replace(/\s+/g, "_")}_Certificate.pdf`,
              path: certificatePath,
            },
          ],
        });

        // Clean up certificate file after sending
        setTimeout(() => {
          try {
            fs.unlinkSync(certificatePath);
          } catch (error) {
            console.error("Error deleting certificate file:", error);
          }
        }, 5000);

        return { success: true, email: student.email };
      } catch (error) {
        console.error(`Error sending certificate to ${student.email}:`, error);
        return { success: false, email: student.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    res.json({
      success: true,
      message: `Certificates sent successfully to ${successful} students${
        failed > 0 ? `, ${failed} failed` : ""
      }`,
      data: {
        total: students.length,
        successful,
        failed,
        results,
      },
    });
  } catch (error) {
    console.error("Send certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send certificates",
    });
  }
});

// Get analytics data
router.get("/analytics", async (req, res) => {
  try {
    const { range = "6months" } = req.query;

    // Get basic stats
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM internship_programs WHERE is_active = true) as total_programs,
        (SELECT COUNT(*) FROM student_internship) as total_enrollments,
        (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE status = 'paid') as total_revenue
    `);

    // Get enrollment trend data
    const enrollmentTrendQuery = `
      SELECT 
        DATE_TRUNC('month', si.enrollment_date)::date as month,
        COUNT(*) as enrollments,
        COALESCE(SUM(o.final_amount), 0) as revenue
      FROM student_internship si
      LEFT JOIN orders o ON si.student_id = o.student_id AND o.status = 'paid'
      WHERE si.enrollment_date >= CURRENT_DATE - INTERVAL '${
        range === "3months" ? "3" : range === "1year" ? "12" : "6"
      } months'
      GROUP BY DATE_TRUNC('month', si.enrollment_date)
      ORDER BY month ASC
    `;

    const enrollmentTrend = await pool.query(enrollmentTrendQuery);

    // Get program popularity
    const programPopularityQuery = `
      SELECT 
        p.title as name,
        COUNT(si.id) as enrollments,
        COALESCE(SUM(o.final_amount), 0) as revenue
      FROM internship_programs p
      LEFT JOIN student_internship si ON p.id = si.program_id
      LEFT JOIN orders o ON p.id = o.program_id AND o.status = 'paid'
      GROUP BY p.id, p.title
      ORDER BY COUNT(si.id) DESC
      LIMIT 5
    `;

    const programPopularity = await pool.query(programPopularityQuery);

    // Format enrollment trend for charts
    const formattedEnrollmentTrend = enrollmentTrend.rows.map((row) => ({
      month: new Date(row.month).toLocaleDateString("en-US", {
        month: "short",
      }),
      enrollments: parseInt(row.enrollments),
      revenue: parseFloat(row.revenue),
    }));

    // Format program popularity
    const formattedProgramPopularity = programPopularity.rows.map((row) => ({
      name: row.name,
      enrollments: parseInt(row.enrollments),
      revenue: parseFloat(row.revenue),
    }));

    res.json({
      success: true,
      data: {
        stats: stats.rows[0],
        charts: {
          enrollmentTrend: formattedEnrollmentTrend,
          programPopularity: formattedProgramPopularity,
          revenueByMonth: formattedEnrollmentTrend,
        },
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
});

// Get all tasks for admin
router.get("/tasks", async (req, res) => {
  try {
    const { programId } = req.query;
    
    let query = `
      SELECT 
        t.*,
        p.title as program_title,
        COUNT(DISTINCT ts.id) as submission_count
      FROM tasks t
      JOIN internship_programs p ON t.program_id = p.id
      LEFT JOIN task_submissions ts ON t.id = ts.task_id
    `;

    const queryParams = [];
    
    if (programId) {
      query += ` WHERE t.program_id = $1`;
      queryParams.push(programId);
    }

    query += ` GROUP BY t.id, p.id ORDER BY t.order_index ASC`;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: {
        tasks: result.rows.map((task) => ({
          id: task.id,
          programId: task.program_id,
          programTitle: task.program_title,
          title: task.title,
          description: task.description,
          taskType: task.task_type,
          difficultyLevel: task.difficulty_level,
          maxPoints: task.max_points,
          passingPoints: task.passing_points,
          dueDate: task.due_date,
          estimatedHours: task.estimated_hours,
          instructions: task.instructions,
          resources: task.resources,
          submissionFormat: task.submission_format,
          requirements: task.requirements,
          evaluationCriteria: task.evaluation_criteria,
          isMandatory: task.is_mandatory,
          allowLateSubmission: task.allow_late_submission,
          orderIndex: task.order_index,
          submissionCount: parseInt(task.submission_count),
        })),
      },
    });
  } catch (error) {
    console.error("Tasks fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// Create new task
router.post("/tasks", async (req, res) => {
  try {
    const {
      programId,
      title,
      description,
      taskType,
      difficultyLevel,
      maxPoints,
      passingPoints,
      dueDate,
      estimatedHours,
      instructions,
      resources,
      submissionFormat,
      requirements,
      evaluationCriteria,
      isMandatory,
      allowLateSubmission,
      orderIndex,
    } = req.body;

    // Validate required fields
    if (!programId || !title || !description || !taskType || !difficultyLevel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (
        program_id, title, description, task_type, difficulty_level,
        max_points, passing_points, due_date, estimated_hours,
        instructions, resources, submission_format, requirements,
        evaluation_criteria, is_mandatory, allow_late_submission, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `,
      [
        programId,
        title,
        description,
        taskType,
        difficultyLevel,
        maxPoints || 100,
        passingPoints || 70,
        dueDate || null,
        estimatedHours || null,
        instructions || null,
        resources || null,
        submissionFormat || "github_link",
        requirements || null,
        evaluationCriteria || null,
        isMandatory !== false,
        allowLateSubmission !== false,
        orderIndex || 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task: result.rows[0] },
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// Update task
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      description,
      taskType,
      difficultyLevel,
      maxPoints,
      passingPoints,
      dueDate,
      estimatedHours,
      instructions,
      resources,
      submissionFormat,
      requirements,
      evaluationCriteria,
      isMandatory,
      allowLateSubmission,
      orderIndex,
    } = req.body;

    // Convert empty strings to null for nullable fields
    dueDate = dueDate || null;
    estimatedHours = estimatedHours || null;
    instructions = instructions || null;
    resources = resources || null;
    requirements = requirements || null;
    evaluationCriteria = evaluationCriteria || null;

    const result = await pool.query(
      `
      UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        task_type = COALESCE($3, task_type),
        difficulty_level = COALESCE($4, difficulty_level),
        max_points = COALESCE($5, max_points),
        passing_points = COALESCE($6, passing_points),
        due_date = COALESCE($7, due_date),
        estimated_hours = COALESCE($8, estimated_hours),
        instructions = COALESCE($9, instructions),
        resources = COALESCE($10, resources),
        submission_format = COALESCE($11, submission_format),
        requirements = COALESCE($12, requirements),
        evaluation_criteria = COALESCE($13, evaluation_criteria),
        is_mandatory = COALESCE($14, is_mandatory),
        allow_late_submission = COALESCE($15, allow_late_submission),
        order_index = COALESCE($16, order_index),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *
    `,
      [
        title,
        description,
        taskType,
        difficultyLevel,
        maxPoints,
        passingPoints,
        dueDate,
        estimatedHours,
        instructions,
        resources,
        submissionFormat,
        requirements,
        evaluationCriteria,
        isMandatory,
        allowLateSubmission,
        orderIndex,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task: result.rows[0] },
    });
  } catch (error) {
    console.error("Task update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// Delete task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Task deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

// AI-powered assignment suggestions
router.post("/ai-suggestions", async (req, res) => {
  try {
    const { prompt, programId, difficultyLevel = "easy" } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required",
      });
    }

    // Get the program to understand context
    const programResult = await pool.query(
      "SELECT id, title, description FROM internship_programs WHERE id = $1",
      [programId]
    );

    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    const { title: programTitle, description: programDescription } = programResult.rows[0];

    // Generate program-specific suggestions based on keywords in title and description
    const generateProgramSpecificSuggestions = (programTitle, difficulty) => {
      const titleLower = programTitle.toLowerCase();
      const descLower = programDescription?.toLowerCase() || "";
      const combined = `${titleLower} ${descLower}`;
      
      // Detect program type by keywords - check both title and description
      const isBackend = combined.includes('backend') || combined.includes('django') || 
                        combined.includes('node') || combined.includes('express') || 
                        combined.includes('python') || combined.includes('flask') ||
                        combined.includes('api') || combined.includes('server') ||
                        combined.includes('database') || combined.includes('rest') ||
                        combined.includes('servicenow');
      const isFrontend = combined.includes('frontend') || combined.includes('react') || 
                         combined.includes('vue') || combined.includes('angular') ||
                         combined.includes('javascript') || combined.includes('html') ||
                         combined.includes('css') || combined.includes('ui');
      const isFullStack = combined.includes('full') || combined.includes('mern') || 
                          combined.includes('mean') || combined.includes('stack');
      const isMobile = combined.includes('mobile') || combined.includes('react native') || 
                       combined.includes('flutter') || combined.includes('ios') ||
                       combined.includes('android');
      const isDevOps = combined.includes('devops') || combined.includes('cloud') || 
                       combined.includes('docker') || combined.includes('kubernetes') ||
                       combined.includes('deployment');

      // Program-specific suggestion templates
      let suggestions = [];

      if (isBackend) {
        suggestions = {
          easy: [
            {
              title: "Build a RESTful API with Basic CRUD Operations",
              description: "Create a REST API with endpoints for Create, Read, Update, Delete operations on a simple resource",
              estimatedHours: 6,
              keyFocus: "HTTP methods, routing, request/response handling, JSON data",
              taskType: "assignment",
            },
            {
              title: "Database Connection and Data Retrieval",
              description: "Connect to a PostgreSQL/MongoDB database and fetch user lists, filter by criteria",
              estimatedHours: 5,
              keyFocus: "Database connection, SQL queries, data fetching, filtering",
              taskType: "assignment",
            },
            {
              title: "Third-Party API Integration",
              description: "Integrate with a third-party API (payment, weather, email service) and handle responses",
              estimatedHours: 7,
              keyFocus: "API calls, authentication tokens, error handling, data mapping",
              taskType: "project",
            },
            {
              title: "User Authentication Setup",
              description: "Implement basic user registration and login with password hashing and sessions",
              estimatedHours: 8,
              keyFocus: "Authentication, password hashing, sessions, security basics",
              taskType: "assignment",
            },
            {
              title: "Build a Simple Todo API",
              description: "Create a complete backend API for a todo application with all CRUD operations",
              estimatedHours: 6,
              keyFocus: "API design, database modeling, request validation",
              taskType: "project",
            },
          ],
          medium: [
            {
              title: "Advanced Database Queries and Relationships",
              description: "Implement complex database queries with joins, aggregations, and optimize query performance",
              estimatedHours: 10,
              keyFocus: "SQL optimization, relationships, indexing, query performance",
              taskType: "assignment",
            },
            {
              title: "Implement JWT Authentication with Refresh Tokens",
              description: "Build secure authentication system with JWT tokens, refresh tokens, and role-based access",
              estimatedHours: 12,
              keyFocus: "JWT, security, authorization, token refresh logic",
              taskType: "project",
            },
            {
              title: "Build a Payment Gateway Integration",
              description: "Integrate with Stripe/PayPal for payment processing with webhook handling",
              estimatedHours: 14,
              keyFocus: "Payment APIs, webhooks, transaction handling, security",
              taskType: "project",
            },
            {
              title: "Real-time Data with WebSockets",
              description: "Implement real-time features using WebSockets for live notifications or chat",
              estimatedHours: 11,
              keyFocus: "WebSockets, real-time communication, event handling",
              taskType: "project",
            },
            {
              title: "Caching and Performance Optimization",
              description: "Implement Redis caching, database query optimization, and API response caching",
              estimatedHours: 9,
              keyFocus: "Redis, caching strategies, performance optimization",
              taskType: "assignment",
            },
          ],
          hard: [
            {
              title: "Microservices Architecture Implementation",
              description: "Design and implement a microservices-based system with service discovery and communication",
              estimatedHours: 25,
              keyFocus: "Microservices, service communication, scalability, architecture",
              taskType: "project",
            },
            {
              title: "Build a Scalable Multi-Tenant SaaS Backend",
              description: "Create a multi-tenant system with data isolation, custom domains, and tenant management",
              estimatedHours: 22,
              keyFocus: "Multi-tenancy, data isolation, scalability, architecture",
              taskType: "project",
            },
            {
              title: "Advanced Caching and Message Queue System",
              description: "Implement distributed caching, message queues for async processing, and job scheduling",
              estimatedHours: 18,
              keyFocus: "Message queues, distributed systems, async processing",
              taskType: "assignment",
            },
            {
              title: "API Gateway with Rate Limiting and Monitoring",
              description: "Build API gateway with authentication, rate limiting, logging, and performance monitoring",
              estimatedHours: 20,
              keyFocus: "API gateway, rate limiting, monitoring, security",
              taskType: "project",
            },
            {
              title: "Zero-Downtime Deployment Pipeline",
              description: "Create CI/CD pipeline with database migrations, blue-green deployment, and rollback strategy",
              estimatedHours: 24,
              keyFocus: "DevOps, CI/CD, deployment strategies, database migrations",
              taskType: "project",
            },
          ],
        };
      } else if (isFrontend) {
        suggestions = {
          easy: [
            {
              title: "Build a Responsive Navigation Component",
              description: "Create a responsive navbar with hamburger menu for mobile devices",
              estimatedHours: 4,
              keyFocus: "HTML/CSS, responsive design, mobile-first approach",
              taskType: "assignment",
            },
            {
              title: "Create a Dynamic Form with Validation",
              description: "Build a form that validates user input in real-time and shows error messages",
              estimatedHours: 5,
              keyFocus: "Form handling, validation, event handling, user feedback",
              taskType: "assignment",
            },
            {
              title: "Fetch and Display Data from an API",
              description: "Create a component that fetches data from a public API and displays it in a list",
              estimatedHours: 6,
              keyFocus: "API calls, async/await, data rendering, loading states",
              taskType: "project",
            },
            {
              title: "Build a Todo List Application",
              description: "Create a functional todo app with add, delete, and mark complete features",
              estimatedHours: 5,
              keyFocus: "State management, event handling, DOM manipulation",
              taskType: "project",
            },
            {
              title: "Implement Dark Mode Toggle",
              description: "Add a theme switcher that toggles between light and dark modes",
              estimatedHours: 4,
              keyFocus: "CSS variables, local storage, event handling",
              taskType: "assignment",
            },
          ],
          medium: [
            {
              title: "Build a Dashboard with Charts and Analytics",
              description: "Create a dashboard displaying data visualization with charts and key metrics",
              estimatedHours: 12,
              keyFocus: "Data visualization, component composition, state management",
              taskType: "project",
            },
            {
              title: "Implement Advanced State Management",
              description: "Set up Redux/Context API for complex state management across the application",
              estimatedHours: 11,
              keyFocus: "State management, Redux/Context, data flow",
              taskType: "assignment",
            },
            {
              title: "Create a Real-time Chat Interface",
              description: "Build a chat UI with WebSocket integration for real-time messaging",
              estimatedHours: 13,
              keyFocus: "WebSockets, component design, message handling",
              taskType: "project",
            },
            {
              title: "Build a Multi-step Form/Wizard",
              description: "Create a complex form with multiple steps, progress indicator, and validation",
              estimatedHours: 10,
              keyFocus: "Form handling, state management, UX patterns",
              taskType: "project",
            },
            {
              title: "Implement Infinite Scroll or Pagination",
              description: "Add pagination or infinite scroll functionality to a data list",
              estimatedHours: 8,
              keyFocus: "Performance optimization, lazy loading, pagination",
              taskType: "assignment",
            },
          ],
          hard: [
            {
              title: "Build a Progressive Web App (PWA)",
              description: "Convert application to PWA with offline support, push notifications, and installability",
              estimatedHours: 20,
              keyFocus: "Service workers, manifest, offline support, caching",
              taskType: "project",
            },
            {
              title: "Implement Advanced Performance Optimization",
              description: "Optimize application with code splitting, lazy loading, and performance monitoring",
              estimatedHours: 18,
              keyFocus: "Performance, optimization, bundling, monitoring",
              taskType: "assignment",
            },
            {
              title: "Create a Collaborative Editor Application",
              description: "Build a real-time collaborative editor with WebSockets and conflict resolution",
              estimatedHours: 22,
              keyFocus: "Real-time sync, conflict resolution, WebSockets",
              taskType: "project",
            },
            {
              title: "Build a Complex Data Visualization Dashboard",
              description: "Create interactive charts, filters, and drilldown functionality for analytics",
              estimatedHours: 19,
              keyFocus: "Data visualization, interactivity, performance",
              taskType: "project",
            },
            {
              title: "Implement E-commerce Features",
              description: "Build product catalog, shopping cart, and checkout flow with payment integration",
              estimatedHours: 25,
              keyFocus: "Component architecture, state management, payment integration",
              taskType: "project",
            },
          ],
        };
      } else if (isFullStack) {
        suggestions = {
          easy: [
            {
              title: "Build a Simple Blog Application",
              description: "Create a blog with frontend UI and backend API for posting and viewing articles",
              estimatedHours: 8,
              keyFocus: "Full-stack basics, CRUD operations, database design",
              taskType: "project",
            },
            {
              title: "Create a Weather App",
              description: "Frontend that displays weather data fetched from backend API integration",
              estimatedHours: 7,
              keyFocus: "Frontend-backend integration, API calls, state management",
              taskType: "project",
            },
            {
              title: "Build a Task Management App",
              description: "Full-stack todo app with persistent database storage and real-time updates",
              estimatedHours: 9,
              keyFocus: "Full-stack architecture, database, API design",
              taskType: "project",
            },
            {
              title: "Create a User Registration System",
              description: "Implement signup/login with frontend forms and backend authentication",
              estimatedHours: 8,
              keyFocus: "Authentication, form handling, security",
              taskType: "project",
            },
            {
              title: "Build a Simple E-commerce Store",
              description: "Product listing, cart management, and basic checkout functionality",
              estimatedHours: 10,
              keyFocus: "Component design, state management, API integration",
              taskType: "project",
            },
          ],
          medium: [
            {
              title: "Build a Social Media Feed Application",
              description: "Full-stack app with user posts, comments, likes, and real-time notifications",
              estimatedHours: 16,
              keyFocus: "Complex state management, real-time updates, relational data",
              taskType: "project",
            },
            {
              title: "Create a Project Management Tool",
              description: "Full-stack application with projects, tasks, teams, and collaboration features",
              estimatedHours: 18,
              keyFocus: "Data relationships, user roles, real-time collaboration",
              taskType: "project",
            },
            {
              title: "Build a Video Streaming Platform",
              description: "Create platform for uploading, streaming, and managing videos",
              estimatedHours: 17,
              keyFocus: "File handling, streaming, database optimization",
              taskType: "project",
            },
            {
              title: "Implement a Chat Application",
              description: "Full-stack messaging app with real-time chat, user presence, and notifications",
              estimatedHours: 15,
              keyFocus: "WebSockets, real-time sync, message queuing",
              taskType: "project",
            },
            {
              title: "Build a Job Portal Application",
              description: "Job listings, applications, user profiles, and notifications system",
              estimatedHours: 16,
              keyFocus: "Complex relationships, search, filtering, notifications",
              taskType: "project",
            },
          ],
          hard: [
            {
              title: "Build a Complete SaaS Platform",
              description: "Full-featured SaaS with authentication, subscription management, analytics, and admin panel",
              estimatedHours: 30,
              keyFocus: "Scalability, payments, multi-tenancy, analytics",
              taskType: "project",
            },
            {
              title: "Create a Real-time Collaboration Platform",
              description: "Implement Google Docs-like collaborative editing with conflict resolution",
              estimatedHours: 28,
              keyFocus: "Real-time sync, conflict resolution, WebSockets, scalability",
              taskType: "project",
            },
            {
              title: "Build a Learning Management System (LMS)",
              description: "Complete LMS with courses, lessons, quizzes, assignments, and progress tracking",
              estimatedHours: 32,
              keyFocus: "Complex features, user management, content delivery",
              taskType: "project",
            },
            {
              title: "Create an AI-Powered Analytics Dashboard",
              description: "Build dashboard with ML insights, predictions, and automated reporting",
              estimatedHours: 27,
              keyFocus: "Data processing, AI integration, visualization",
              taskType: "project",
            },
            {
              title: "Build a Marketplace Platform",
              description: "Complete marketplace with sellers, buyers, payments, reviews, and dispute resolution",
              estimatedHours: 35,
              keyFocus: "Scalability, payments, complex logic, user management",
              taskType: "project",
            },
          ],
        };
      } else if (isMobile) {
        suggestions = {
          easy: [
            {
              title: "Build a Simple Counter App",
              description: "Create a mobile app with increment/decrement buttons and state persistence",
              estimatedHours: 4,
              keyFocus: "Mobile basics, state management, UI components",
              taskType: "assignment",
            },
            {
              title: "Create a Notes Application",
              description: "Simple note-taking app with add, edit, and delete functionality",
              estimatedHours: 6,
              keyFocus: "CRUD operations, local storage, navigation",
              taskType: "project",
            },
            {
              title: "Build a Weather App",
              description: "Mobile app that displays weather based on location",
              estimatedHours: 7,
              keyFocus: "Location services, API calls, data display",
              taskType: "project",
            },
            {
              title: "Create a Photo Gallery",
              description: "Image gallery app with categorization and search functionality",
              estimatedHours: 6,
              keyFocus: "Image handling, navigation, UI components",
              taskType: "project",
            },
            {
              title: "Build a Habit Tracker",
              description: "Simple habit tracking app with daily check-ins and progress visualization",
              estimatedHours: 7,
              keyFocus: "State management, data persistence, UI design",
              taskType: "project",
            },
          ],
          medium: [
            {
              title: "Create a Mobile Social App",
              description: "Social networking app with feed, user profiles, and messaging",
              estimatedHours: 14,
              keyFocus: "Navigation, state management, backend integration",
              taskType: "project",
            },
            {
              title: "Build a Mobile Banking App",
              description: "Banking app with account balance, transactions, and fund transfers",
              estimatedHours: 13,
              keyFocus: "Security, authentication, sensitive data handling",
              taskType: "project",
            },
            {
              title: "Implement Push Notifications",
              description: "Add push notifications to mobile app with proper handling",
              estimatedHours: 9,
              keyFocus: "Push notifications, background tasks, permissions",
              taskType: "assignment",
            },
            {
              title: "Build an E-commerce Mobile App",
              description: "Mobile shopping app with product search, cart, and checkout",
              estimatedHours: 15,
              keyFocus: "Commerce logic, payment integration, inventory",
              taskType: "project",
            },
            {
              title: "Create a Fitness Tracking App",
              description: "Track workouts, calories, and create fitness plans",
              estimatedHours: 12,
              keyFocus: "Data visualization, sensor integration, state management",
              taskType: "project",
            },
          ],
          hard: [
            {
              title: "Build a Multiplayer Gaming App",
              description: "Real-time multiplayer game with networking and synchronization",
              estimatedHours: 24,
              keyFocus: "Real-time networking, performance, game logic",
              taskType: "project",
            },
            {
              title: "Create a High-Performance AR App",
              description: "Augmented reality application with real-time object detection",
              estimatedHours: 22,
              keyFocus: "AR capabilities, performance optimization, device integration",
              taskType: "project",
            },
            {
              title: "Build an Offline-First App",
              description: "Mobile app with full offline support and sync when online",
              estimatedHours: 20,
              keyFocus: "Offline storage, sync algorithms, data conflicts",
              taskType: "project",
            },
            {
              title: "Implement Video Call Feature",
              description: "Real-time video calling with group chat support",
              estimatedHours: 21,
              keyFocus: "WebRTC, real-time communication, media handling",
              taskType: "project",
            },
            {
              title: "Create a Machine Learning Mobile App",
              description: "Mobile app using on-device ML models for predictions",
              estimatedHours: 23,
              keyFocus: "ML integration, performance, on-device processing",
              taskType: "project",
            },
          ],
        };
      } else if (isDevOps) {
        suggestions = {
          easy: [
            {
              title: "Set Up Docker for an Application",
              description: "Create Dockerfile and Docker Compose for containerizing an application",
              estimatedHours: 5,
              keyFocus: "Docker basics, containerization, image creation",
              taskType: "assignment",
            },
            {
              title: "Create a CI/CD Pipeline",
              description: "Build basic CI/CD pipeline with GitHub Actions or GitLab CI",
              estimatedHours: 6,
              keyFocus: "CI/CD, automation, testing pipelines",
              taskType: "project",
            },
            {
              title: "Set Up Infrastructure as Code",
              description: "Use Terraform to provision basic cloud infrastructure",
              estimatedHours: 7,
              keyFocus: "IaC, Terraform, infrastructure provisioning",
              taskType: "assignment",
            },
            {
              title: "Configure Container Networking",
              description: "Set up Docker networks and multi-container communication",
              estimatedHours: 5,
              keyFocus: "Container networking, Docker networking",
              taskType: "assignment",
            },
            {
              title: "Build a Monitoring Dashboard",
              description: "Set up Prometheus and Grafana for monitoring applications",
              estimatedHours: 6,
              keyFocus: "Monitoring, metrics, dashboards",
              taskType: "project",
            },
          ],
          medium: [
            {
              title: "Implement Kubernetes Deployment",
              description: "Deploy containerized app to Kubernetes with auto-scaling",
              estimatedHours: 14,
              keyFocus: "Kubernetes, orchestration, deployment",
              taskType: "project",
            },
            {
              title: "Set Up SSL/TLS Certificates",
              description: "Configure HTTPS with Let's Encrypt and certificate management",
              estimatedHours: 8,
              keyFocus: "Security, SSL/TLS, certificate management",
              taskType: "assignment",
            },
            {
              title: "Build Infrastructure with Terraform",
              description: "Create complete infrastructure with VPC, databases, load balancers",
              estimatedHours: 13,
              keyFocus: "Terraform, cloud infrastructure, modules",
              taskType: "project",
            },
            {
              title: "Implement Log Aggregation",
              description: "Set up ELK stack or similar for centralized logging",
              estimatedHours: 11,
              keyFocus: "Logging, aggregation, analysis",
              taskType: "project",
            },
            {
              title: "Create a Blue-Green Deployment",
              description: "Implement zero-downtime deployment strategy",
              estimatedHours: 12,
              keyFocus: "Deployment strategies, infrastructure",
              taskType: "assignment",
            },
          ],
          hard: [
            {
              title: "Build a Multi-Region Cloud Architecture",
              description: "Design and implement multi-region deployment with failover",
              estimatedHours: 24,
              keyFocus: "High availability, multi-region, disaster recovery",
              taskType: "project",
            },
            {
              title: "Implement Service Mesh",
              description: "Set up Istio or similar for microservices communication",
              estimatedHours: 20,
              keyFocus: "Service mesh, microservices, traffic management",
              taskType: "project",
            },
            {
              title: "Create Advanced Monitoring and Alerting",
              description: "Build comprehensive monitoring with anomaly detection and auto-remediation",
              estimatedHours: 18,
              keyFocus: "Monitoring, alerting, automation",
              taskType: "project",
            },
            {
              title: "Build a Disaster Recovery Plan",
              description: "Implement backup, recovery procedures, and RTO/RPO targets",
              estimatedHours: 22,
              keyFocus: "Disaster recovery, backup, resilience",
              taskType: "project",
            },
            {
              title: "Implement Network Security Hardening",
              description: "Configure firewalls, VPCs, security groups, and network policies",
              estimatedHours: 19,
              keyFocus: "Security, networking, compliance",
              taskType: "project",
            },
          ],
        };
      } else {
        // Default: treat unknown programs as backend since most are API/integration platforms (like Servicenow)
        suggestions = {
          easy: [
            {
              title: "Build a RESTful API with Basic CRUD Operations",
              description: "Create a REST API with endpoints for Create, Read, Update, Delete operations on a simple resource",
              estimatedHours: 6,
              keyFocus: "HTTP methods, routing, request/response handling, JSON data",
              taskType: "assignment",
            },
            {
              title: "Database Connection and Data Retrieval",
              description: "Connect to a PostgreSQL/MongoDB database and fetch user lists, filter by criteria",
              estimatedHours: 5,
              keyFocus: "Database connection, SQL queries, data fetching, filtering",
              taskType: "assignment",
            },
            {
              title: "Third-Party API Integration",
              description: "Integrate with a third-party API (payment, weather, email service) and handle responses",
              estimatedHours: 7,
              keyFocus: "API calls, authentication tokens, error handling, data mapping",
              taskType: "project",
            },
            {
              title: "User Authentication Setup",
              description: "Implement basic user registration and login with password hashing and sessions",
              estimatedHours: 8,
              keyFocus: "Authentication, password hashing, sessions, security basics",
              taskType: "assignment",
            },
            {
              title: `Build a Simple ${programTitle} Integration Module`,
              description: `Create a module that integrates with ${programTitle} APIs and handles data synchronization`,
              estimatedHours: 6,
              keyFocus: "API integration, data mapping, error handling",
              taskType: "project",
            },
          ],
          medium: [
            {
              title: "Advanced Database Queries and Relationships",
              description: "Implement complex database queries with joins, aggregations, and optimize query performance",
              estimatedHours: 10,
              keyFocus: "SQL optimization, relationships, indexing, query performance",
              taskType: "assignment",
            },
            {
              title: "Implement JWT Authentication with Refresh Tokens",
              description: "Build secure authentication system with JWT tokens, refresh tokens, and role-based access",
              estimatedHours: 12,
              keyFocus: "JWT, security, authorization, token refresh logic",
              taskType: "project",
            },
            {
              title: `Advanced ${programTitle} Integration with Webhooks`,
              description: `Build advanced integration with ${programTitle} including webhook handling and event processing`,
              estimatedHours: 14,
              keyFocus: "Webhooks, event-driven architecture, data synchronization",
              taskType: "project",
            },
            {
              title: "Real-time Data Synchronization",
              description: "Implement real-time data sync between your system and external APIs using WebSockets",
              estimatedHours: 11,
              keyFocus: "WebSockets, real-time sync, event handling",
              taskType: "project",
            },
            {
              title: "Caching and Performance Optimization",
              description: "Implement Redis caching and optimize database queries for better performance",
              estimatedHours: 9,
              keyFocus: "Redis, caching strategies, performance optimization",
              taskType: "assignment",
            },
          ],
          hard: [
            {
              title: "Enterprise Integration Platform",
              description: `Build a comprehensive integration platform for ${programTitle} with multiple connectors`,
              estimatedHours: 25,
              keyFocus: "Enterprise integration, scalability, multi-connector support",
              taskType: "project",
            },
            {
              title: `Custom ${programTitle} Solution for Complex Workflows`,
              description: `Design and implement a custom solution using ${programTitle} for complex business workflows`,
              estimatedHours: 22,
              keyFocus: "Workflow automation, business logic, customization",
              taskType: "project",
            },
            {
              title: "Advanced Error Handling and Resilience",
              description: "Implement comprehensive error handling, retry logic, and circuit breakers for robust integration",
              estimatedHours: 18,
              keyFocus: "Resilience, error handling, fault tolerance",
              taskType: "assignment",
            },
            {
              title: "Multi-System Integration Architecture",
              description: "Design architecture for integrating multiple enterprise systems with data consistency",
              estimatedHours: 20,
              keyFocus: "System architecture, data consistency, scalability",
              taskType: "project",
            },
            {
              title: "API-Driven Data Analytics Pipeline",
              description: "Create a data pipeline that extracts, transforms, and loads data from multiple APIs",
              estimatedHours: 24,
              keyFocus: "Data pipeline, ETL, analytics, data warehousing",
              taskType: "project",
            },
          ],
        };
      }

      const difficulty_level = difficulty || "easy";
      return (suggestions[difficulty_level] || suggestions.easy).map((template, index) => ({
        ...template,
        difficultyLevel: difficulty_level,
        id: `${programId}-${difficulty_level}-${index}`,
      }));
    };

    const suggestions = generateProgramSpecificSuggestions(programTitle, difficultyLevel || "easy");

    return res.json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate suggestions",
    });
  }
});

module.exports = router;
