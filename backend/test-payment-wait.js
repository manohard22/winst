// Wait 3 seconds then test
setTimeout(async () => {
  const http = require('http');
  
  const data = JSON.stringify({
    programId: '770e8400-e29b-41d4-a716-446655440000',
    studentId: '123e4567-e89b-12d3-a456-426614174000',
    amount: 1,
    email: 'student@example.com',
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

  const req = http.request(options, (res) => {
    let responseData = '';

    console.log(`Status: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        if (parsed.success) {
          console.log('✅ SUCCESS! Payment order created');
          console.log('Order ID:', parsed.data.orderId);
          console.log('Amount:', parsed.data.amount);
        } else {
          console.log('❌ Failed:', parsed.message);
          console.log('Error:', parsed.error);
        }
      } catch (e) {
        console.log('Response (raw):', responseData);
      }
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
}, 3000);
