import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { User } from "../models/User.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import pool from "../config/database.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Certificates route works!" });
});
// Generate certificate
router.post("/generate", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { studentId, techId } = req.body;

    if (!studentId || !techId) {
      return res
        .status(400)
        .json({ message: "Student ID and Technology ID are required" });
    }

    // Get student and technology details
    const query = `
      SELECT u.full_name, u.email, t.tech_name, si.progress_percentage
      FROM users u
      JOIN student_internship si ON u.user_id = si.student_id
      JOIN technologies t ON si.tech_id = t.tech_id
      WHERE u.user_id = $1 AND t.tech_id = $2 AND si.status = 'completed'
    `;

    const result = await pool.query(query, [studentId, techId]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Student has not completed this program" });
    }

    const student = result.rows[0];

    // Generate certificate number
    const certificateNumber = `LUCRO-${techId}-${new Date().getFullYear()}-${String(
      studentId
    ).padStart(3, "0")}`;

    // Create certificates directory if it doesn't exist
    const certificatesDir = "certificates";
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Generate PDF certificate
    const filename = `certificate-${studentId}-${techId}.pdf`;
    const filepath = path.join(certificatesDir, filename);

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.pipe(fs.createWriteStream(filepath));

    // Certificate design
    doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100).stroke();
    doc.rect(60, 60, doc.page.width - 120, doc.page.height - 120).stroke();

    // Header
    doc
      .fontSize(36)
      .fillColor("#2557a7")
      .text("CERTIFICATE OF COMPLETION", 0, 120, { align: "center" });

    // Content
    doc
      .fontSize(18)
      .fillColor("black")
      .text("This is to certify that", 0, 200, { align: "center" });
    doc
      .fontSize(28)
      .fillColor("#2557a7")
      .text(student.full_name, 0, 240, { align: "center" });
    doc
      .fontSize(18)
      .fillColor("black")
      .text("has successfully completed the", 0, 290, { align: "center" });
    doc
      .fontSize(24)
      .fillColor("#2557a7")
      .text(`${student.tech_name} Internship Program`, 0, 330, {
        align: "center",
      });

    // Footer
    doc.fontSize(14).fillColor("black");
    doc.text(`Certificate Number: ${certificateNumber}`, 100, 420);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 100, 440);
    doc.text(`Progress: ${student.progress_percentage}%`, 100, 460);

    doc.text("Lucro - Internship Management Portal", doc.page.width - 300, 440);
    doc.text("Authorized Signature", doc.page.width - 200, 460);

    doc.end();

    // Save certificate record to database
    const insertQuery = `
      INSERT INTO internship_certificates 
      (student_id, tech_id, issue_date, certificate_url, certificate_number, issued_by, remarks)
      VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6)
      RETURNING certificate_id
    `;

    const certificateResult = await pool.query(insertQuery, [
      studentId,
      techId,
      `/certificates/${filename}`,
      certificateNumber,
      req.user.userId,
      `Completed with ${student.progress_percentage}% progress`,
    ]);

    res.json({
      message: "Certificate generated successfully",
      certificateId: certificateResult.rows[0].certificate_id,
      certificateNumber,
      filename,
      downloadUrl: `/certificates/${filename}`,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    res
      .status(500)
      .json({ message: "Server error during certificate generation" });
  }
});

// Get certificates for a student
router.get("/student/:studentId", authenticateToken, async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Check if user is admin or the student themselves
    if (req.user.role !== "admin" && req.user.userId != studentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const query = `
      SELECT ic.certificate_id, ic.issue_date, ic.certificate_url, 
             ic.certificate_number, ic.remarks, ic.is_verified,
             t.tech_name, u.full_name as issued_by_name
      FROM internship_certificates ic
      JOIN technologies t ON ic.tech_id = t.tech_id
      JOIN users u ON ic.issued_by = u.user_id
      WHERE ic.student_id = $1
      ORDER BY ic.issue_date DESC
    `;

    const result = await pool.query(query, [studentId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Download certificate
router.get("/download/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join("certificates", filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.download(filepath, filename);
  } catch (error) {
    console.error("Download certificate error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
