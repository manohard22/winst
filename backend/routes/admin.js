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

    // Calculate date range
    let dateFilter = "";
    switch (range) {
      case "3months":
        dateFilter = "AND created_at >= NOW() - INTERVAL '3 months'";
        break;
      case "1year":
        dateFilter = "AND created_at >= NOW() - INTERVAL '1 year'";
        break;
      default:
        dateFilter = "AND created_at >= NOW() - INTERVAL '6 months'";
    }

    // Get basic stats
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM internship_programs WHERE is_active = true) as total_programs,
        (SELECT COUNT(*) FROM student_internship) as total_enrollments,
        (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE status = 'paid') as total_revenue
    `);

    res.json({
      success: true,
      data: {
        stats: stats.rows[0],
        charts: {
          enrollmentTrend: [],
          programPopularity: [],
          revenueByMonth: [],
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

    // Generic suggestions based on difficulty level
    const generateSuggestions = (programTitle, difficulty) => {
      const templates = {
        easy: [
          {
            title: "Foundation Concepts Assignment",
            description: `Understand and practice the fundamental concepts of ${programTitle}`,
            estimatedHours: 5,
            keyFocus: "Core concepts, basic practice, hands-on learning",
            taskType: "assignment",
          },
          {
            title: "Practical Application Exercise",
            description: `Apply what you've learned in ${programTitle} to a real-world scenario`,
            estimatedHours: 6,
            keyFocus: "Practical application, real-world relevance, problem solving",
            taskType: "assignment",
          },
          {
            title: "Code Review and Analysis",
            description: `Review and analyze existing code to understand best practices in ${programTitle}`,
            estimatedHours: 4,
            keyFocus: "Code quality, best practices, analysis skills",
            taskType: "assignment",
          },
          {
            title: "Documentation and Notes",
            description: `Create comprehensive documentation for key topics in ${programTitle}`,
            estimatedHours: 5,
            keyFocus: "Documentation, knowledge consolidation, writing skills",
            taskType: "assignment",
          },
          {
            title: "Simple Project",
            description: `Build a simple project demonstrating basic skills in ${programTitle}`,
            estimatedHours: 7,
            keyFocus: "Project building, skill integration, completion",
            taskType: "project",
          },
        ],
        medium: [
          {
            title: "Intermediate Project Development",
            description: `Build an intermediate-level project applying multiple concepts from ${programTitle}`,
            estimatedHours: 12,
            keyFocus: "Project scope, multiple concepts, integration",
            taskType: "project",
          },
          {
            title: "Advanced Problem Solving",
            description: `Solve advanced problems and edge cases in ${programTitle}`,
            estimatedHours: 10,
            keyFocus: "Problem solving, complexity, optimization",
            taskType: "assignment",
          },
          {
            title: "Code Refactoring Task",
            description: `Refactor and improve existing code with focus on ${programTitle}`,
            estimatedHours: 8,
            keyFocus: "Code quality, refactoring, improvement",
            taskType: "assignment",
          },
          {
            title: "Integration Task",
            description: `Integrate multiple systems or components in ${programTitle}`,
            estimatedHours: 11,
            keyFocus: "Integration, system design, connectivity",
            taskType: "project",
          },
          {
            title: "Performance Optimization",
            description: `Identify and optimize performance bottlenecks in ${programTitle}`,
            estimatedHours: 9,
            keyFocus: "Performance, optimization, efficiency",
            taskType: "assignment",
          },
        ],
        hard: [
          {
            title: "Complex System Design",
            description: `Design and implement a complex system using advanced concepts from ${programTitle}`,
            estimatedHours: 20,
            keyFocus: "System design, architecture, complexity",
            taskType: "project",
          },
          {
            title: "Advanced Architecture Implementation",
            description: `Implement advanced architectural patterns in ${programTitle}`,
            estimatedHours: 18,
            keyFocus: "Architecture, design patterns, scalability",
            taskType: "project",
          },
          {
            title: "Research and Innovation",
            description: `Research cutting-edge techniques and implement innovations in ${programTitle}`,
            estimatedHours: 16,
            keyFocus: "Research, innovation, advanced techniques",
            taskType: "assignment",
          },
          {
            title: "Production-Grade Implementation",
            description: `Build production-ready applications with all best practices in ${programTitle}`,
            estimatedHours: 22,
            keyFocus: "Production quality, reliability, maintainability",
            taskType: "project",
          },
          {
            title: "Capstone Project",
            description: `Complete a comprehensive capstone project that showcases all skills in ${programTitle}`,
            estimatedHours: 25,
            keyFocus: "Comprehensive, portfolio-worthy, mastery demonstration",
            taskType: "project",
          },
        ],
      };

      return (templates[difficulty] || templates.easy).map((template, index) => ({
        ...template,
        difficultyLevel: difficulty,
        id: `${programId}-${difficulty}-${index}`,
      }));
    };

    const suggestions = generateSuggestions(programTitle, difficultyLevel || "easy");

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
