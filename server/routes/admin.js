import express from "express";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { Task } from "../models/Task.js";
import { Technology } from "../models/Technology.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all students
router.get("/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const students = await User.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all payments
router.get("/payments", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all tasks
router.get("/tasks", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new task
router.post("/tasks", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, technology, assignedToEmail, dueDate, points } =
      req.body;

    if (!title || !description || !technology || !assignedToEmail || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get technology ID
    const tech = await Technology.getByName(technology);
    if (!tech) {
      return res.status(400).json({ message: "Invalid technology" });
    }

    // Get student ID
    const student = await User.findByEmail(assignedToEmail);
    if (!student || student.role_name !== "student") {
      return res.status(400).json({ message: "Student not found" });
    }

    const task = await Task.createTask({
      title,
      description,
      techId: tech.tech_id,
      assignedTo: student.user_id,
      createdBy: req.user.userId,
      dueDate,
      points: points || 0,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get dashboard statistics
router.get(
  "/dashboard-stats",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const stats = await getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

async function getDashboardStats() {
  const queries = [
    // Total students
    `SELECT COUNT(*) as total_students FROM users u 
     JOIN roles r ON u.role_id = r.role_id 
     WHERE r.role_name = 'student' AND u.is_active = true`,

    // Active students
    `SELECT COUNT(*) as active_students FROM users u 
     JOIN roles r ON u.role_id = r.role_id 
     JOIN student_internship si ON u.user_id = si.student_id
     WHERE r.role_name = 'student' AND u.is_active = true AND si.status = 'active'`,

    // Total revenue
    `SELECT COALESCE(SUM(amount), 0) as total_revenue FROM payments 
     WHERE payment_status = 'completed'`,

    // Certificates issued
    `SELECT COUNT(*) ascertificates_issued FROM internship_certificates WHERE is_verified = true`,

    // Pending payments
    `SELECT COUNT(*) as pending_payments FROM payments 
     WHERE payment_status = 'pending'`,

    // Completed tasks
    `SELECT COUNT(*) as completed_tasks FROM tasks 
     WHERE status = 'completed'`,

    // Monthly revenue
    `SELECT DATE_TRUNC('month', payment_date) as month, SUM(amount) as revenue
     FROM payments WHERE payment_status = 'completed' 
     AND payment_date >= CURRENT_DATE - INTERVAL '6 months'
     GROUP BY DATE_TRUNC('month', payment_date)
     ORDER BY month DESC`,
  ];

  const results = await Promise.all(queries.map((query) => pool.query(query)));

  return {
    totalStudents: parseInt(results[0].rows[0].total_students),
    activeStudents: parseInt(results[1].rows[0].active_students),
    totalRevenue: parseFloat(results[2].rows[0].total_revenue),
    certificatesIssued: parseInt(results[3].rows[0].certificates_issued),
    pendingPayments: parseInt(results[4].rows[0].pending_payments),
    completedTasks: parseInt(results[5].rows[0].completed_tasks),
    monthlyRevenue: results[6].rows,
  };
}

export default router;
