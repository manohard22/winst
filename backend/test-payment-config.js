require('dotenv').config();

const { PaymentGateway } = require('./utils/paymentGateway');

async function test() {
  const payment = new PaymentGateway();
  
  console.log('\n🔍 Checking Razorpay Configuration:');
  console.log('   Key ID:', payment.keyId ? '✅ Loaded' : '❌ Missing');
  console.log('   Key Secret:', payment.keySecret ? '✅ Loaded' : '❌ Missing');
  console.log('   API Base URL:', payment.apiBaseUrl);
  console.log('   API Version:', payment.apiVersion);
  console.log('   Mode:', payment.mode);
  console.log('');
  
  if (!payment.keyId || !payment.keySecret) {
    console.log('❌ Razorpay credentials not configured!');
    process.exit(1);
  }
  
  console.log('🚀 Testing order creation with $1 INR...\n');
  
  const result = await payment.createOrder(
    1,
    'test-student-123',
    'test@example.com',
    {
      programId: 'prog-123',
      studentId: 'test-student-123',
      fullName: 'Test User',
      type: 'enrollment'
    }
  );
  
  if (result.success) {
    console.log('✅ SUCCESS! Order created');
    console.log('   Order ID:', result.data.order_id);
    console.log('   Amount:', result.data.amount, 'INR');
  } else {
    console.log('❌ FAILED! Could not create order');
    console.log('   Error:', result.error);
  }
  
  process.exit(result.success ? 0 : 1);
}

test();
