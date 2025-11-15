// @ts-nocheck
/**
 * Payment Routes
 * Handles enrollment payment flow with Razorpay integration
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

/**
 * @route   POST /api/v1/payment/initiate
 * @desc    Initiate payment for enrollment
 * @access  Public (student can initiate payment)
 * @body    { programId, studentId, amount, email, fullName }
 * @returns { orderId, keyId, amount, currency }
 */
router.post('/initiate', paymentController.initiatePayment);

/**
 * @route   POST /api/v1/payment/verify
 * @desc    Verify Razorpay payment signature and complete enrollment
 * @access  Public
 * @body    { razorpay_payment_id, razorpay_order_id, razorpay_signature, programId, studentId }
 * @returns { verified, paymentId, enrollment }
 */
router.post('/verify', paymentController.verifyPayment);

/**
 * @route   GET /api/v1/payment/status/:orderId
 * @desc    Check payment status
 * @access  Public
 * @returns { status, amount, studentId, programId }
 */
router.get('/status/:orderId', paymentController.getPaymentStatus);

/**
 * @route   POST /api/v1/payment/failure
 * @desc    Handle payment failure
 * @access  Public
 * @body    { orderId, error, reason }
 * @returns { status, reason }
 */
router.post('/failure', paymentController.handlePaymentFailure);

/**
 * @route   GET /api/v1/payment/key
 * @desc    Get Razorpay public key for frontend
 * @access  Public
 * @returns { keyId, mode }
 */
router.get('/key', paymentController.getRazorpayKey);

module.exports = router;
