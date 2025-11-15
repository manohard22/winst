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

// @ts-nocheck
const crypto = require('crypto');
const https = require('https');

class PaymentGateway {
  constructor() {
    // Initialize Razorpay client when credentials are provided
    this.keyId = process.env.RAZORPAY_KEY_ID;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET;
    this.accountId = process.env.RAZORPAY_ACCOUNT_ID;
    this.mode = process.env.PAYMENT_MODE || 'test';
    this.currency = 'INR';
    this.apiBaseUrl = 'api.razorpay.com';
    this.apiVersion = 'v1';
    
    if (!this.keyId || !this.keySecret) {
      console.warn('⚠️  Razorpay credentials not configured in .env');
    } else {
      console.log('✅ Razorpay credentials loaded successfully');
    }
  }

  /**
   * Make HTTP request to Razorpay API
   */
  async makeApiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
      
      const options = {
        hostname: this.apiBaseUrl,
        port: 443,
        path: `/api/${this.apiVersion}${path}`,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const jsonResponse = JSON.parse(responseData);
            resolve({
              statusCode: res.statusCode,
              data: jsonResponse
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: responseData
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        const params = new URLSearchParams(data).toString();
        req.write(params);
      }

      req.end();
    });
  }

  /**
   * Create a Razorpay order
   * 
   * @param {number} amount - Amount in rupees
   * @param {string} customerId - Customer/User ID
   * @param {string} email - Customer email
   * @param {object} metadata - Additional metadata (programId, studentId, etc)
   * @returns {Promise} Order details with order_id, amount, currency
   */
  async createOrder(amount, customerId, email, metadata = {}) {
    try {
      // Validate input
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount. Amount must be greater than 0');
      }

      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      // Amount in paise (1 rupee = 100 paise)
      const amountInPaise = Math.round(amount * 100);

      const orderData = {
        amount: amountInPaise,
        currency: this.currency,
        receipt: `RCP-${customerId}-${Date.now()}`,
        notes: {
          customer_id: customerId,
          email: email,
          program_id: metadata.programId || null,
          student_id: metadata.studentId || customerId,
          enrollment_date: new Date().toISOString(),
          ...metadata
        }
      };

      console.log('📋 Creating Razorpay order:', {
        amount: amount + ' INR',
        amountInPaise: amountInPaise,
        customerId: customerId,
        email: email
      });

      const response = await this.makeApiRequest('POST', '/orders', orderData);

      if (response.statusCode === 200) {
        console.log('✅ Order created successfully:', response.data.id);
        return {
          success: true,
          data: {
            order_id: response.data.id,
            amount: amount,
            amountInPaise: amountInPaise,
            currency: this.currency,
            customer_id: customerId,
            email: email,
            status: response.data.status,
            created_at: response.data.created_at
          }
        };
      } else {
        throw new Error(`Razorpay API error: ${response.statusCode}`);
      }
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

      const response = await this.makeApiRequest('GET', `/payments/${paymentId}`);

      if (response.statusCode === 200) {
        console.log('✅ Payment details fetched:', response.data.id);
        return {
          success: true,
          data: response.data
        };
      } else {
        throw new Error(`Razorpay API error: ${response.statusCode}`);
      }
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
   * @param {number} amount - Amount to refund in rupees (optional, full refund if not specified)
   * @returns {Promise} Refund details
   */
  async refundPayment(paymentId, amount = null) {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const refundData = {};

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to paise
      }

      console.log('💰 Processing refund for payment:', paymentId, amount ? `Amount: ${amount} INR` : 'Full refund');

      const response = await this.makeApiRequest('POST', `/payments/${paymentId}/refund`, refundData);

      if (response.statusCode === 200) {
        console.log('✅ Refund processed successfully:', response.data.id);
        return {
          success: true,
          data: {
            refund_id: response.data.id,
            payment_id: paymentId,
            amount: amount,
            status: response.data.status
          }
        };
      } else {
        throw new Error(`Razorpay API error: ${response.statusCode}`);
      }
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
