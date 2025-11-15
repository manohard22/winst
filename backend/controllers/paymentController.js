// @ts-nocheck
/**
 * Payment Controller
 * Handles enrollment with payment processing flow
 */

const { PaymentGateway } = require('../utils/paymentGateway');
const db = require('../config/database');

const payment = new PaymentGateway();

/**
 * Step 1: Initiate payment - Create Razorpay order
 * Called when user clicks "Enroll" button
 */
exports.initiatePayment = async (req, res) => {
  try {
    const { programId, studentId, amount, email, fullName } = req.body;

    // Validate required fields
    if (!programId || !studentId || !amount || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: programId, studentId, amount, email'
      });
    }

    // Amount should be >= 1 rupee for testing
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1'
      });
    }

    console.log(`💳 Initiating payment for student ${studentId} to enroll in program ${programId}`);

    // Create Razorpay order
    const orderResult = await payment.createOrder(
      amount,
      studentId,
      email,
      {
        programId: programId,
        studentId: studentId,
        fullName: fullName,
        type: 'enrollment'
      }
    );

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: orderResult.error
      });
    }

    // Store order in database for tracking
    const orderData = orderResult.data;
    
    try {
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${studentId.substring(0, 8)}`;
      
      const insertResult = await db.query(
        `INSERT INTO orders (
          student_id, 
          program_id, 
          order_number,
          amount,
          final_amount,
          status, 
          payment_method,
          payment_gateway,
          gateway_order_id,
          currency,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING id`,
        [
          studentId,
          programId,
          orderNumber,
          amount,
          amount,
          'pending',
          'razorpay',
          'razorpay',
          orderData.order_id,
          'INR'
        ]
      );
      
      console.log(`✅ Order stored in database with ID: ${insertResult.rows[0].id}`);
    } catch (dbError) {
      console.log('⚠️  Could not store order in DB, but order created in Razorpay:', dbError.message);
      console.log('Database error:', dbError);
    }

    // Return order details to frontend
    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: orderData.order_id,
        amount: orderData.amount,
        amountInPaise: orderData.amountInPaise,
        currency: orderData.currency,
        keyId: payment.keyId,
        studentId: studentId,
        email: email,
        name: fullName
      }
    });

  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
};

/**
 * Step 2: Verify payment signature - Called after successful Razorpay payment
 * Razorpay sends: razorpay_payment_id, razorpay_order_id, razorpay_signature
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      programId,
      studentId 
    } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    console.log(`🔐 Verifying payment signature for order ${razorpay_order_id}`);

    // Verify signature with Razorpay
    const isSignatureValid = payment.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      console.error('❌ Signature verification failed');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Signature mismatch.',
        verified: false
      });
    }

    console.log('✅ Signature verified successfully');

    // Get payment details from Razorpay to confirm payment status
    const paymentDetails = await payment.getPaymentDetails(razorpay_payment_id);

    if (!paymentDetails.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details',
        error: paymentDetails.error
      });
    }

    const paymentStatus = paymentDetails.data.status;
    console.log(`📊 Payment status from Razorpay: ${paymentStatus}`);

    if (paymentStatus !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured yet',
        verified: true,
        status: paymentStatus
      });
    }

    // Payment successful! Now enroll the student
    console.log(`✅ Payment captured. Proceeding with enrollment for student ${studentId}`);

    try {
      // Update order status in database
      await db.query(
        `UPDATE orders SET 
          status = $1, 
          transaction_id = $2, 
          final_amount = $3,
          updated_at = NOW()
        WHERE gateway_order_id = $4`,
        [
          'paid',
          razorpay_payment_id,
          paymentDetails.data.amount / 100, // Convert from paise
          razorpay_order_id
        ]
      );

      // Create enrollment record
      const enrollmentResult = await db.query(
        `INSERT INTO student_internship (
          student_id,
          program_id,
          enrollment_date,
          status,
          is_active,
          created_at
        ) VALUES ($1, $2, NOW(), $3, true, NOW())
        RETURNING id, student_id, program_id, enrollment_date`,
        [studentId, programId, 'active']
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified and enrollment successful!',
        data: {
          verified: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          enrollment: enrollmentResult.rows[0],
          amount: paymentDetails.data.amount / 100,
          currency: 'INR'
        }
      });

    } catch (dbError) {
      console.error('❌ Database error during enrollment:', dbError);
      res.status(500).json({
        success: false,
        message: 'Payment verified but enrollment failed',
        verified: true,
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Step 3: Get payment status - Check if payment is successful
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Get order details from database
    const orderResult = await db.query(
      `SELECT * FROM orders WHERE gateway_order_id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        orderId: order.gateway_order_id,
        status: order.status,
        amount: order.amount,
        studentId: order.student_id,
        programId: order.program_id,
        createdAt: order.created_at,
        paidAt: order.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message
    });
  }
};

/**
 * Handle payment failure
 */
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error, reason } = req.body;

    console.error(`❌ Payment failed for order ${orderId}:`, reason);

    // Update order status
    try {
      await db.query(
        `UPDATE orders SET 
          status = $1, 
          updated_at = NOW()
        WHERE gateway_order_id = $2`,
        ['failed', orderId]
      );
    } catch (dbError) {
      console.log('⚠️  Could not update order status:', dbError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        orderId: orderId,
        status: 'failed',
        reason: reason
      }
    });

  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment failure',
      error: error.message
    });
  }
};

/**
 * Get Razorpay key for frontend
 */
exports.getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        keyId: payment.keyId,
        mode: payment.mode
      }
    });
  } catch (error) {
    console.error('❌ Error fetching Razorpay key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Razorpay key'
    });
  }
};

module.exports = exports;
