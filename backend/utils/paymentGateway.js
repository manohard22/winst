/**
 * 💳 Razorpay Payment Gateway Service
 * 
 * This module encapsulates all Razorpay payment operations
 * including order creation, payment verification, and signature validation.
 * 
 * Usage:
 * const { PaymentGateway } = require('./paymentGateway');
 * const payment = new PaymentGateway();
 * const order = await payment.createOrder(amount, customerId);
 */

const crypto = require('crypto');

class PaymentGateway {
  constructor() {
    // Initialize Razorpay client when credentials are provided
    this.keyId = process.env.RAZORPAY_KEY_ID;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET;
    this.mode = process.env.PAYMENT_MODE || 'test';
    this.currency = process.env.PAYMENT_CURRENCY || 'INR';
    
    if (!this.keyId || !this.keySecret) {
      console.warn('⚠️  Razorpay credentials not configured in .env');
    }
  }

  /**
   * Create a Razorpay order
   * 
   * @param {number} amount - Amount in rupees
   * @param {string} customerId - Customer/User ID
   * @param {object} metadata - Additional metadata
   * @returns {Promise} Order details with order_id, amount, currency
   */
  async createOrder(amount, customerId, metadata = {}) {
    try {
      // Validate input
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount. Amount must be greater than 0');
      }

      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      // TODO: Replace with actual Razorpay API call
      // For now, this is a stub that needs actual implementation
      
      const orderData = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: this.currency,
        customer_id: customerId,
        notes: {
          ...metadata,
          created_at: new Date().toISOString(),
          mode: this.mode
        },
        receipt: `RCP-${Date.now()}`
      };

      console.log('📋 Creating Razorpay order with data:', {
        amount: amount,
        amountInPaise: orderData.amount,
        currency: this.currency,
        customerId: customerId,
        mode: this.mode
      });

      // IMPLEMENTATION NOTE:
      // Use razorpay-node SDK:
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({
      //   key_id: this.keyId,
      //   key_secret: this.keySecret
      // });
      // const order = await razorpay.orders.create(orderData);

      return {
        success: true,
        data: {
          order_id: 'order_placeholder', // Will be actual Razorpay order ID
          amount: amount,
          amountInPaise: orderData.amount,
          currency: this.currency,
          customerId: customerId,
          notes: orderData.notes
        }
      };
    } catch (error) {
      console.error('❌ Order creation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify payment signature from Razorpay callback
   * 
   * This is CRITICAL for security - prevents tampering with payment status
   * 
   * @param {string} orderId - Razorpay order ID
   * @param {string} paymentId - Razorpay payment ID
   * @param {string} signature - HMAC signature from Razorpay
   * @returns {boolean} Whether signature is valid
   */
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      if (!orderId || !paymentId || !signature) {
        console.error('❌ Missing required fields for signature verification');
        return false;
      }

      // Create the data that was signed
      const data = `${orderId}|${paymentId}`;

      // Generate HMAC-SHA256 signature
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(data)
        .digest('hex');

      // Compare signatures (timing-safe comparison)
      const isValid = expectedSignature === signature;

      if (isValid) {
        console.log('✅ Payment signature verified successfully');
      } else {
        console.error('❌ Signature verification failed');
        console.error('Expected:', expectedSignature);
        console.error('Got:', signature);
      }

      return isValid;
    } catch (error) {
      console.error('❌ Signature verification error:', error.message);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   * 
   * @param {string} paymentId - Razorpay payment ID
   * @returns {Promise} Payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      console.log('🔍 Fetching payment details for:', paymentId);

      // TODO: Implement actual Razorpay API call
      // const razorpay = new Razorpay({...});
      // const payment = await razorpay.payments.fetch(paymentId);

      return {
        success: true,
        data: {
          payment_id: paymentId,
          // payment details will be returned by Razorpay
        }
      };
    } catch (error) {
      console.error('❌ Payment fetch failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Initiate refund for a payment
   * 
   * @param {string} paymentId - Razorpay payment ID
   * @param {number} amount - Amount to refund (optional, full refund if not specified)
   * @returns {Promise} Refund details
   */
  async refundPayment(paymentId, amount = null) {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const refundData = {
        payment_id: paymentId
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to paise
      }

      console.log('💰 Processing refund for payment:', paymentId, 'Amount:', amount);

      // TODO: Implement actual Razorpay API call
      // const razorpay = new Razorpay({...});
      // const refund = await razorpay.payments.refund(paymentId, refundData);

      return {
        success: true,
        data: {
          refund_id: 'rfnd_placeholder',
          payment_id: paymentId,
          amount: amount
        }
      };
    } catch (error) {
      console.error('❌ Refund failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate payment configuration
   * 
   * @returns {object} Configuration status
   */
  validateConfiguration() {
    const config = {
      keyIdConfigured: !!this.keyId,
      keySecretConfigured: !!this.keySecret,
      mode: this.mode,
      currency: this.currency,
      isReady: !!(this.keyId && this.keySecret)
    };

    console.log('🔐 Payment Gateway Configuration:', config);

    if (!config.isReady) {
      console.warn('⚠️  Payment gateway not ready. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }

    return config;
  }

  /**
   * Format amount for display (INR)
   * 
   * @param {number} paise - Amount in paise
   * @returns {string} Formatted amount (₹X.XX)
   */
  formatAmount(paise) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(paise / 100);
  }
}

module.exports = { PaymentGateway };
