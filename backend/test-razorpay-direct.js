const https = require('https');

// Test credentials
const keyId = 'rzp_test_Rg6RU7sG2Gb5tj';
const keySecret = '6FDt2PXoDCAPdq7s55eB2P59';

const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

console.log('Testing Razorpay API with credentials...');
console.log('Key ID:', keyId);
console.log('Key Secret:', keySecret.substring(0, 5) + '...');
console.log('Auth header:', auth.substring(0, 20) + '...');

const data = new URLSearchParams({
  amount: 100,
  currency: 'INR',
  receipt: 'test-' + Date.now(),
  notes: { test: 'true' }
}).toString();

const options = {
  hostname: 'api.razorpay.com',
  port: 443,
  path: '/v1/orders',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
};

console.log('\nMaking request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  let responseData = '';

  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      console.log('\nResponse:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('\nResponse (raw):', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error.message);
});

console.log('\nSending data:', data.substring(0, 50) + '...');
req.write(data);
req.end();
