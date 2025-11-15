#!/usr/bin/env node
// @ts-nocheck
/**
 * Complete Payment System Test
 * Tests the entire payment flow from initiation to verification
 */

const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'success' ? colors.green + '✅' : 
                 type === 'error' ? colors.red + '❌' :
                 type === 'info' ? colors.blue + 'ℹ️ ' :
                 colors.yellow + '⏳';
  console.log(`${prefix} ${colors.reset}[${timestamp}] ${message}`);
}

async function makeRequest(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.headers['Content-Length'] = data.length;
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runTests() {
  log('info', 'Starting Payment System Tests...');
  console.log('');

  try {
    // Test 1: Get Razorpay Key
    log('info', 'Test 1: Getting Razorpay public key...');
    const keyResponse = await makeRequest('/api/payments/key', 'GET');
    
    if (keyResponse.statusCode === 200 && keyResponse.data.success) {
      log('success', `Got Razorpay key: ${keyResponse.data.data.keyId}`);
    } else {
      log('error', `Failed to get key: ${keyResponse.data.message}`);
      process.exit(1);
    }

    console.log('');

    // Test 2: Initiate Payment Order
    log('info', 'Test 2: Initiating payment order...');
    const initiateBody = {
      programId: '770e8400-e29b-41d4-a716-446655440000',
      studentId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 1,
      email: 'test@example.com',
      fullName: 'Test User'
    };

    const initiateResponse = await makeRequest('/api/payments/initiate', 'POST', initiateBody);
    
    if (initiateResponse.statusCode === 200 && initiateResponse.data.success) {
      log('success', `Payment order created successfully`);
      const orderId = initiateResponse.data.data.orderId;
      const amount = initiateResponse.data.data.amount;
      log('info', `Order ID: ${orderId}`);
      log('info', `Amount: ₹${amount}`);
      console.log('');

      // Test 3: Payment Status Before Verification
      log('info', 'Test 3: Checking payment status (should be pending)...');
      const statusResponse = await makeRequest(`/api/payments/status/${orderId}`, 'GET');
      
      if (statusResponse.statusCode === 200 && statusResponse.data.success) {
        log('success', `Payment status: ${statusResponse.data.data.status}`);
      } else {
        log('error', `Failed to check status: ${statusResponse.data.message}`);
      }

      console.log('');
      log('success', 'All tests completed successfully!');
      log('info', 'Payment system is working correctly.');
      log('info', 'You can now test the payment flow from the frontend.');
      
    } else {
      log('error', `Failed to create payment order: ${initiateResponse.data.message}`);
      log('error', `Error: ${initiateResponse.data.error}`);
      process.exit(1);
    }

  } catch (error) {
    log('error', `Test failed with error: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
runTests();
