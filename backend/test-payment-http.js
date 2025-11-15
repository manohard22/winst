const http = require('http');

// Wait for backend to be ready
setTimeout(() => {
  const data = JSON.stringify({
    programId: '770e8400-e29b-41d4-a716-446655440000',
    studentId: '550e8400-e29b-12d3-a456-426614174000',
    amount: 1,
    email: 'testuser@example.com',
    fullName: 'Test Student'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/payments/initiate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('🚀 Testing Payment Initiation via HTTP API...\n');

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        console.log('Status Code:', res.statusCode);
        console.log('\nResponse:');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.success) {
          console.log('\n✅ Payment order created successfully!');
          console.log('Order ID:', parsed.data.orderId);
          console.log('Amount:', parsed.data.amount, 'INR');
          console.log('\nYou can now test payment with Razorpay test card:');
          console.log('Card: 4111 1111 1111 1111');
          console.log('Expiry: Any future date (e.g., 12/25)');
          console.log('CVV: Any 3 digits (e.g., 123)');
        } else {
          console.log('\n❌ Payment order creation failed');
          if (parsed.error) {
            console.log('Error:', parsed.error);
          }
        }
      } catch (e) {
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.error('\nMake sure backend is running on port 3001');
  });

  req.write(data);
  req.end();
}, 2000);
