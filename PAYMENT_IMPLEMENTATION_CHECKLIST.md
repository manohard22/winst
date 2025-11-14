# 🚀 Payment Gateway Implementation Checklist

## 📋 Pre-Implementation Requirements

### Get Your Razorpay Credentials
- [ ] Create Razorpay account at https://razorpay.com
- [ ] Complete merchant verification
- [ ] Get API Key ID (Public Key)
- [ ] Get API Key Secret (Private Key)
- [ ] Get Account ID

**When ready, provide:**
```
RAZORPAY_KEY_ID: ___________________________
RAZORPAY_KEY_SECRET: ___________________________
Account ID: ___________________________
```

## 🔧 Implementation Phases

### PHASE 1: Backend Infrastructure Setup

#### Task 1.1: Install Razorpay Node SDK
```bash
cd backend
npm install razorpay
```

#### Task 1.2: Update Payment Gateway Service
**File:** `backend/utils/paymentGateway.js`
- [ ] Implement Razorpay client initialization
- [ ] Implement createOrder() with actual API call
- [ ] Implement getPaymentDetails()
- [ ] Implement refundPayment()
- [ ] Test with sandbox credentials

#### Task 1.3: Create Verification Utilities
**File:** `backend/utils/razorpayVerification.js`
```javascript
// Utilities for payment verification:
- signatureVerification(orderId, paymentId, signature)
- validatePaymentAmount(orderId, expectedAmount)
- validateOrderStatus(orderId)
- handleDuplicatePayment(orderId, paymentId)
```

#### Task 1.4: Update Payment Routes
**File:** `backend/routes/payments.js`

Add/Update endpoints:

**1. POST /api/payments/create-order**
```
Request:
{
  "programId": "uuid",
  "referralCode": "optional_code"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "order_1234567890",
    "amount": 200000,  // in paise
    "amountInRupees": 2000,
    "currency": "INR",
    "keyId": "rzp_test_xxxxx"
  }
}
```

**2. POST /api/payments/verify**
```
Request:
{
  "orderId": "order_1234567890",
  "paymentId": "pay_1234567890",
  "signature": "abcdef1234567890"
}

Response:
{
  "success": true,
  "data": {
    "enrolled": true,
    "enrollmentId": "uuid"
  }
}
```

**3. GET /api/payments/status/:orderId**
```
Response:
{
  "success": true,
  "data": {
    "orderId": "order_id",
    "status": "paid|pending|failed",
    "paymentId": "pay_id",
    "amount": 2000,
    "paidAt": "timestamp"
  }
}
```

### PHASE 2: Database Schema Verification

#### Task 2.1: Verify Tables Exist
- [ ] Check `orders` table exists with all columns
- [ ] Check `payments` table exists with all columns
- [ ] Check relationship: payments.order_id → orders.id
- [ ] Check `student_internship` table for enrollment tracking

#### Task 2.2: Verify Indexes
- [ ] Index on orders.student_id
- [ ] Index on orders.status
- [ ] Index on payments.order_id
- [ ] Index on payments.gateway_payment_id (Razorpay payment ID)

### PHASE 3: Enrollment Flow Integration

#### Task 3.1: Update Enrollment Route
**File:** `backend/routes/enrollments.js`

Modify POST /api/enrollments:
```javascript
// Check if payment is completed
const paymentResult = await pool.query(`
  SELECT p.status FROM payments p
  JOIN orders o ON p.order_id = o.id
  WHERE o.student_id = $1 AND o.program_id = $2
  AND p.status = 'success'
  ORDER BY p.created_at DESC LIMIT 1
`, [userId, programId]);

if (paymentResult.rows.length === 0) {
  return res.status(400).json({
    success: false,
    message: 'Payment not completed. Please complete payment first.'
  });
}

// Only then proceed with enrollment
```

### PHASE 4: Frontend Implementation

#### Task 4.1: Create Payment Modal Component
**File:** `frontend/src/components/PaymentModal.jsx`

Features needed:
- [ ] Display program and pricing details
- [ ] Load Razorpay script dynamically
- [ ] Handle payment modal opening
- [ ] Process payment response
- [ ] Show loading states
- [ ] Handle errors gracefully
- [ ] Close modal on success/failure

Template structure:
```jsx
const PaymentModal = ({ 
  isOpen, 
  program, 
  amount, 
  orderId, 
  onSuccess, 
  onFailure, 
  onClose 
}) => {
  // Use Razorpay.Checkout to open payment form
  // Handle payment success: call onSuccess()
  // Handle payment failure: call onFailure()
}
```

#### Task 4.2: Create Payment Success Page
**File:** `frontend/src/pages/PaymentSuccess.jsx`

Features:
- [ ] Display success message
- [ ] Show enrollment confirmation
- [ ] Display order details
- [ ] Download invoice button
- [ ] Auto-redirect to dashboard after 3 seconds
- [ ] Show next steps

#### Task 4.3: Create Payment Failure Page
**File:** `frontend/src/pages/PaymentFailure.jsx`

Features:
- [ ] Display error message
- [ ] Show failure reason
- [ ] Retry button
- [ ] Back to program button
- [ ] Contact support option

#### Task 4.4: Update Program Detail Component
**File:** `frontend/src/pages/ProgramDetail.jsx`

Modify `handleEnroll`:
```javascript
// Instead of direct enrollment:
// 1. Call /api/payments/create-order
// 2. Open PaymentModal with order details
// 3. On payment success:
//    - Call /api/enrollments to create enrollment
//    - Navigate to success page
```

#### Task 4.5: Update Environment Variables
**File:** `frontend/.env.local`
```
VITE_RAZORPAY_KEY_ID=your_public_key_here
VITE_API_BASE_URL=http://localhost:3001/api
```

### PHASE 5: Testing

#### Task 5.1: Backend Testing
- [ ] Test order creation with sandbox credentials
- [ ] Test signature verification
- [ ] Test payment verification endpoint
- [ ] Test duplicate payment handling
- [ ] Test error scenarios

#### Task 5.2: Frontend Testing
```
Razorpay Test Cards:
✅ Success: 4111111111111111 (Any future expiry, Any CVV)
❌ Failure: 4000000000000002 (Any future expiry, Any CVV)
```

Test flow:
- [ ] Click Enroll on program detail page
- [ ] See payment modal
- [ ] Enter test card details
- [ ] Complete payment
- [ ] Verify signature on backend
- [ ] Check enrollment created
- [ ] See success page

#### Task 5.3: Database Testing
- [ ] Verify order created in orders table
- [ ] Verify payment created in payments table
- [ ] Verify enrollment created in student_internship table
- [ ] Verify correct order numbers and transaction IDs

### PHASE 6: Production Readiness

#### Task 6.1: Security Audit
- [ ] Never expose secret key in frontend
- [ ] Always verify signatures server-side
- [ ] Use HTTPS only in production
- [ ] Validate amounts before processing
- [ ] Implement rate limiting on payment endpoints

#### Task 6.2: Error Handling
- [ ] Implement retry logic for failed payments
- [ ] Handle network timeouts
- [ ] Log all payment transactions
- [ ] Alert on unusual activity

#### Task 6.3: User Experience
- [ ] Add payment processing spinner
- [ ] Show payment method options
- [ ] Implement saved payment methods (future)
- [ ] Add payment history view
- [ ] Implement invoice generation

#### Task 6.4: Documentation
- [ ] Add API documentation for payment endpoints
- [ ] Create user guide for payment process
- [ ] Document troubleshooting steps
- [ ] Create admin payment monitoring guide

## 📝 Testing Scenarios

### Scenario 1: Successful Payment
1. User selects program
2. Clicks "Enroll Now"
3. Payment modal opens
4. Enters test success card: 4111111111111111
5. Completes payment
6. Backend verifies signature
7. Enrollment created
8. Success page displayed

### Scenario 2: Failed Payment
1. User selects program
2. Clicks "Enroll Now"
3. Payment modal opens
4. Enters test failure card: 4000000000000002
5. Payment fails
6. Failure page displayed
7. User can retry

### Scenario 3: Duplicate Payment Prevention
1. Same user attempts to pay twice for same program
2. First payment succeeds, enrollment created
3. Second payment attempt shows error: "Already enrolled"

### Scenario 4: Referral Code Application
1. User has valid referral code
2. Program shows discounted price
3. During checkout, referral discount applied
4. Order created with reduced amount
5. Payment processed for discounted amount

## 🔍 Debugging Tips

### Payment not creating order:
- [ ] Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
- [ ] Verify Razorpay SDK is installed
- [ ] Check Razorpay API response in logs

### Signature verification failing:
- [ ] Verify orderId and paymentId match Razorpay response
- [ ] Check RAZORPAY_KEY_SECRET is correct
- [ ] Verify signature comes from Razorpay callback
- [ ] Check for whitespace in IDs

### Enrollment not creating:
- [ ] Verify payment status is 'success' in database
- [ ] Check orders table has correct program_id
- [ ] Verify user permissions
- [ ] Check program max_participants limit

### Frontend not opening payment modal:
- [ ] Check Razorpay script loaded (check console)
- [ ] Verify VITE_RAZORPAY_KEY_ID set in .env.local
- [ ] Check browser console for errors
- [ ] Verify orderId returned from backend

## 📞 Support Resources

- **Razorpay Docs**: https://razorpay.com/docs/
- **Node SDK**: https://github.com/razorpay/razorpay-node
- **Troubleshooting**: https://razorpay.com/support/
- **Test Credentials**: https://razorpay.com/docs/payments/payments/test-mode/

## ✅ Final Checklist

- [ ] Razorpay account created and verified
- [ ] API keys obtained and stored in .env
- [ ] Backend payment service implemented
- [ ] Payment routes created and tested
- [ ] Enrollment flow updated with payment requirement
- [ ] Frontend payment modal created
- [ ] Success/failure pages created
- [ ] Environment variables configured
- [ ] All components integrated
- [ ] Testing completed with test cards
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Ready for production deployment

## 🎉 Ready to Begin?

Once you provide your **Razorpay credentials**, we can start implementing immediately!

**Please confirm when you're ready with your account details.**
