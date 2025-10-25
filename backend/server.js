const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables with overrides: .env -> .env.<NODE_ENV> -> .env.local
dotenv.config();
if (process.env.NODE_ENV) {
  const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}
const localEnvPath = path.join(__dirname, ".env.local");
if (process.env.NODE_ENV !== "production" && fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
}

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const programRoutes = require("./routes/programs");
const enrollmentRoutes = require("./routes/enrollments");
const taskRoutes = require("./routes/tasks");
const paymentRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");
const technologiesRoutes = require("./routes/technologies");
const referralRoutes = require("./routes/referrals");
const affiliateRoutes = require("./routes/affiliates");
const assessmentRoutes = require("./routes/assessments");
const projectRoutes = require("./routes/projects");
const certificateRoutes = require("./routes/certificates");
const testimonialRoutes = require("./routes/testimonials");
const subscribeRoutes = require("./routes/subscribe");
const contactRoutes = require("./routes/contact");
// New enhanced routes
const quizRoutes = require("./routes/quizzes");
const socialSharingRoutes = require("./routes/social-sharing");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
const parseOrigins = (value) =>
  (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const defaultOrigins = ["http://localhost:5173", "http://localhost:5174"];
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
].filter(Boolean);

const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Winst Internship Portal API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/technologies", technologiesRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/contact", contactRoutes);
// New enhanced routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/social-sharing", socialSharingRoutes);

// Static file serving for uploads and certificates
app.use("/uploads", express.static("uploads"));
app.use("/certificates", express.static("certificates"));

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Winst Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
