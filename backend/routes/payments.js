// @ts-nocheck
/**
 * Payment Routes - Razorpay Integration
 * Handles enrollment payment flow
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');
const paymentController = require('../controllers/paymentController');

/**
 * Step 1: Get Razorpay public key
 */
router.get('/key', paymentController.getRazorpayKey);

/**
 * Step 2: Initiate payment for enrollment
 * POST /api/payments/initiate
 * Body: { programId, studentId, amount, email, fullName }
 */
router.post('/initiate', paymentController.initiatePayment);

/**
 * Step 3: Verify payment and complete enrollment
 * POST /api/payments/verify
 * Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, programId, studentId }
 */
router.post('/verify', paymentController.verifyPayment);

/**
 * Check payment status
 * GET /api/payments/status/:orderId
 */
router.get('/status/:orderId', paymentController.getPaymentStatus);

/**
 * Handle payment failure
 * POST /api/payments/failure
 */
router.post('/failure', paymentController.handlePaymentFailure);

/**
 * Legacy: Get user's orders (authenticated)
 */
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        p.title as program_title,
        p.image_url as program_image
      FROM orders o
      JOIN internship_programs p ON o.program_id = p.id
      WHERE o.student_id = $1
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        orders: result.rows.map(order => ({
          id: order.id,
          programTitle: order.program_title,
          amount: parseFloat(order.amount),
          finalAmount: parseFloat(order.final_amount),
          status: order.status,
          paymentMethod: order.payment_method,
          transactionId: order.razorpay_payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

/**
 * Legacy: Create order for program enrollment
 */
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { programId, referralCode } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }

    // Get program details
    const programResult = await pool.query(
      'SELECT id, title, price FROM internship_programs WHERE id = $1 AND is_active = true',
      [programId]
    );

    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const program = programResult.rows[0];

    // Check if user already enrolled
    const existingOrder = await pool.query(
      'SELECT id FROM orders WHERE student_id = $1 AND program_id = $2 AND status = $3',
      [req.user.id, programId, 'paid']
    );

    if (existingOrder.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this program'
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order
    const orderResult = await pool.query(`
      INSERT INTO orders (
        student_id, program_id, order_number, amount, final_amount, status, referral_code
      ) VALUES ($1, $2, $3, $4, $5, 'pending', $6)
      RETURNING id, order_number, amount, final_amount, status, created_at
    `, [req.user.id, programId, orderNumber, program.price, program.price, referralCode || null]);

    const order = orderResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.id,
          orderNumber: order.order_number,
          programTitle: program.title,
          amount: parseFloat(order.amount),
          finalAmount: parseFloat(order.final_amount),
          status: order.status,
          createdAt: order.created_at
        }
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

module.exports = router;
