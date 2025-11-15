const https = require('https');

// Test credentials
const keyId = 'rzp_test_Rg6RU7sG2Gb5tj';
const keySecret = '6FDt2PXoDCAPdq7s55eB2P59';

const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

console.log('Testing Razorpay API - Proper Format...');

// Create the data properly
const data = new URLSearchParams();
data.append('amount', '100');
data.append('currency', 'INR');
data.append('receipt', 'test-' + Date.now());
data.append('notes[test]', 'true');
data.append('notes[customer_id]', 'cust123');

const dataStr = data.toString();

const options = {
  hostname: 'api.razorpay.com',
  port: 443,
  path: '/v1/orders',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(dataStr)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  console.log('Status Code:', res.statusCode);

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      if (parsed.id) {
        console.log('✅ SUCCESS! Order created:', parsed.id);
        console.log('Amount:', parsed.amount);
        console.log('Currency:', parsed.currency);
      } else if (parsed.error) {
        console.log('❌ Error:', parsed.error.description);
      } else {
        console.log('\nResponse:', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('\nResponse (raw):', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error.message);
});

req.write(dataStr);
req.end();
