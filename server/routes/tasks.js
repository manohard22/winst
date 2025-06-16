import express from "express";
import multer from "multer";
import { Task } from "../models/Task.js";
import { authenticateToken, requireStudent } from "../middleware/auth.js";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get user tasks
router.get("/", authenticateToken, requireStudent, async (req, res) => {
  try {
    const tasks = await Task.getTasksByUser(req.user.userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit task
router.post(
  "/:id/submit",
  authenticateToken,
  requireStudent,
  upload.single("file"),
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const submissionText = req.body.submissionText || "";
      const submissionUrl = req.file
        ? req.file.path
        : req.body.submissionUrl || "";

      if (!submissionText && !submissionUrl) {
        return res
          .status(400)
          .json({ message: "Submission text or file is required" });
      }

      const submission = await Task.submitTask(taskId, req.user.userId, {
        submissionText,
        submissionUrl,
      });

      res.json({
        message: "Task submitted successfully",
        submission,
      });
    } catch (error) {
      console.error("Task submission error:", error);
      res.status(500).json({ message: "Server error during task submission" });
    }
  }
);

export default router;
