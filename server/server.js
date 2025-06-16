import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import taskRoutes from "./routes/tasks.js";
import adminRoutes from "./routes/admin.js";
import certificateRoutes from "./routes/certificates.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test PostgreSQL connection
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err.stack));

// Create necessary directories
const directories = ["uploads", "certificates"];
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files
app.use("/uploads", express.static("uploads"));
app.use("/certificates", express.static("certificates"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query("SELECT NOW() as current_time");

    res.json({
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: "Connected",
      dbTime: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server running but database error",
      timestamp: new Date().toISOString(),
      database: "Error",
      error: error.message,
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await pool.end();
  console.log("✅ Database connection closed");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
