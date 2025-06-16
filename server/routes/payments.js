import express from "express";
import { Payment } from "../models/Payment.js";
import { Technology } from "../models/Technology.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Create payment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { amount, method, transactionId, technology } = req.body;

    if (!amount || !method || !technology) {
      return res
        .status(400)
        .json({ message: "Amount, method, and technology are required" });
    }

    // Get technology ID
    const tech = await Technology.getByName(technology);
    if (!tech) {
      return res.status(400).json({ message: "Invalid technology" });
    }

    const payment = await Payment.create({
      userId: req.user.userId,
      techId: tech.tech_id,
      amount,
      method,
      transactionId: transactionId || `TXN${Date.now()}`,
      gateway: "Razorpay",
    });

    res.status(201).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Server error during payment processing" });
  }
});

// Get user payments
router.get("/my-payments", authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.getPaymentsByUser(req.user.userId);
    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
