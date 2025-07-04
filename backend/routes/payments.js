const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        p.title as program_title,
        p.image_url as program_image,
        pay.status as payment_status,
        pay.processed_at as payment_processed_at
      FROM orders o
      JOIN internship_programs p ON o.program_id = p.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE o.student_id = $1
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        orders: result.rows.map(order => ({
          id: order.id,
          orderNumber: order.order_number,
          programTitle: order.program_title,
          programImage: order.program_image,
          amount: parseFloat(order.amount),
          discountAmount: parseFloat(order.discount_amount),
          finalAmount: parseFloat(order.final_amount),
          currency: order.currency,
          status: order.status,
          paymentMethod: order.payment_method,
          paymentGateway: order.payment_gateway,
          transactionId: order.transaction_id,
          paymentStatus: order.payment_status,
          paymentProcessedAt: order.payment_processed_at,
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

// Create order for program enrollment
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }

    // Get program details
    const programResult = await pool.query(
      'SELECT id, title, price, discount_percentage, final_price FROM internship_programs WHERE id = $1 AND is_active = true',
      [programId]
    );

    if (programResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const program = programResult.rows[0];

    // Check if user already has a pending/paid order for this program
    const existingOrder = await pool.query(
      'SELECT id FROM orders WHERE student_id = $1 AND program_id = $2 AND status IN ($3, $4)',
      [req.user.id, programId, 'pending', 'paid']
    );

    if (existingOrder.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Order already exists for this program'
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Calculate amounts
    const amount = parseFloat(program.price);
    const discountAmount = amount * (program.discount_percentage / 100);
    const finalAmount = parseFloat(program.final_price);

    // Create order
    const orderResult = await pool.query(`
      INSERT INTO orders (
        student_id, program_id, order_number, amount, 
        discount_amount, final_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id, order_number, amount, discount_amount, final_amount, status, created_at
    `, [req.user.id, programId, orderNumber, amount, discountAmount, finalAmount]);

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
          discountAmount: parseFloat(order.discount_amount),
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

// Verify payment and complete order
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required'
      });
    }

    // Get order details
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE order_number = $1 AND student_id = $2',
      [orderId, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // In a real implementation, you would verify the signature with Razorpay
    // For demo purposes, we'll assume the payment is successful

    // Update order status
    await pool.query(
      'UPDATE orders SET status = $1, payment_method = $2, transaction_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      ['paid', 'razorpay', paymentId, order.id]
    );

    // Create payment record
    await pool.query(`
      INSERT INTO payments (
        order_id, amount, currency, payment_method, payment_gateway,
        gateway_payment_id, status, processed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    `, [order.id, order.final_amount, 'INR', 'razorpay', 'razorpay', paymentId, 'success']);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order.id,
        status: 'paid'
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

module.exports = router;
