import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Technology } from "../models/Technology.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      education,
      fieldOfStudy,
      technology,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !technology
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Validate technology
    const tech = await Technology.getByName(technology);
    if (!tech) {
      return res.status(400).json({ message: "Invalid technology selection" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      education,
      fieldOfStudy,
      technology,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login
    await User.updateLastLogin(user.user_id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    const [firstName, ...lastNameParts] = user.full_name.split(" ");
    const lastName = lastNameParts.join(" ");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        firstName,
        lastName,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        education: user.education_level,
        fieldOfStudy: user.field_of_study,
        technology: user.tech_name,
        role: user.role_name,
        status: user.internship_status,
        progress: user.progress_percentage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [firstName, ...lastNameParts] = user.full_name.split(" ");
    const lastName = lastNameParts.join(" ");

    res.json({
      user: {
        id: user.user_id,
        firstName,
        lastName,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        education: user.education_level,
        fieldOfStudy: user.field_of_study,
        technology: user.tech_name,
        role: user.role_name,
        status: user.internship_status,
        progress: user.progress_percentage,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get technologies
router.get("/technologies", async (req, res) => {
  try {
    const technologies = await Technology.getAll();
    res.json(technologies);
  } catch (error) {
    console.error("Get technologies error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
