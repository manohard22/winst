import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Authorization header:", authHeader);
    console.log("Token extracted:", token);

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    console.log("Decoded token:", decoded);

    // Verify user exists in database
    const userQuery = `
      SELECT u.user_id, u.full_name, u.email, r.role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.role_id 
      WHERE u.user_id = $1 AND u.is_active = true
    `;

    const result = await pool.query(userQuery, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "User not found or inactive" });
    }

    req.user = {
      userId: result.rows[0].user_id,
      email: result.rows[0].email,
      fullName: result.rows[0].full_name,
      role: result.rows[0].role_name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const requireStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access required" });
  }
  next();
};
