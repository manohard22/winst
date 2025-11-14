# 🏗️ Payment Gateway Architecture & Modular Design

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WINST PAYMENT SYSTEM ARCHITECTURE              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐                    ┌──────────────────────┐  │
│  │  FRONTEND (React)│                    │  BACKEND (Node.js)   │  │
│  ├──────────────────┤                    ├──────────────────────┤  │
│  │  ProgramDetail   │◄──Enroll Click──►│  /payments/create    │  │
│  │  .handleEnroll()│                    │  -order endpoint     │  │
│  └────────┬─────────┘                    ├──────────────────────┤  │
│           │                              │  PaymentGateway      │  │
│           │                              │  Service Class       │  │
│           │                              ├──────────────────────┤  │
│           │                              │  razorpayVerify.js   │  │
│           │                              │  (Signature check)   │  │
│           │                              ├──────────────────────┤  │
│           │                              │  /payments/verify    │  │
│           │                              │  -payment endpoint   │  │
│           ▼                              └──────┬───────────────┘  │
│  ┌─────────────────────┐                        │                 │
│  │  PaymentModal.jsx   │                        │                 │
│  │  (Razorpay form)    │                        ▼                 │
│  └────────┬────────────┘             ┌─────────────────────────┐  │
│           │                          │  PostgreSQL Database    │  │
│           │                          ├─────────────────────────┤  │
│           ├──────Razorpay──────►    │  orders table           │  │
│           │    JS Library            │  payments table         │  │
│           │                          │  student_internship     │  │
│           │                          └─────────────────────────┘  │
│           ▼                                                         │
│  ┌─────────────────────┐                                          │
│  │ Success/Failure Page│                                          │
│  │ + Enrollment        │                                          │
│  └─────────────────────┘                                          │
│                                                                    │
│  ┌──────────────┐                     ┌──────────────────────┐   │
│  │ RAZORPAY API │◄────Webhook────────│  /payments/webhook   │   │
│  │ (Payment      │   Callbacks       │  (Optional)          │   │
│  │  Processing) │                     └──────────────────────┘   │
│  └──────────────┘                                                 │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## 🧩 Modular Component Structure

### Backend Modules

```
backend/
├── utils/
│   ├── paymentGateway.js          ◄── Main payment service
│   ├── razorpayVerification.js    ◄── Signature verification
│   └── paymentLogger.js           ◄── Payment logging
│
├── routes/
│   ├── payments.js                ◄── Payment endpoints
│   │   ├── POST /create-order
│   │   ├── POST /verify
│   │   ├── GET /status/:orderId
│   │   └── POST /webhook (optional)
│   │
│   └── enrollments.js             ◄── Updated with payment check
│       ├── POST / (now checks payment)
│       └── GET / (list enrollments)
│
├── config/
│   └── database.js                ◄── DB connection
│
└── middleware/
    ├── auth.js                    ◄── Auth middleware
    └── paymentAuth.js             ◄── Payment-specific auth
```

### Frontend Components

```
frontend/src/
├── components/
│   ├── PaymentModal.jsx           ◄── Razorpay modal
│   ├── PaymentButton.jsx          ◄── Trigger payment
│   ├── PricingDisplay.jsx         ◄── Show price/discount
│   └── PaymentHistory.jsx         ◄── Transaction history
│
├── pages/
│   ├── ProgramDetail.jsx          ◄── Modified with payment
│   ├── PaymentSuccess.jsx         ◄── Success confirmation
│   ├── PaymentFailure.jsx         ◄── Failure handling
│   └── PaymentHistory.jsx         ◄── History view
│
└── services/
    ├── paymentService.js          ◄── API calls
    ├── razorpayLoader.js          ◄── Dynamic script loading
    └── api.js                     ◄── Existing API service
```

## 🔄 Data Flow Diagrams

### 1. Order Creation Flow

```
┌─────────────┐
│   Frontend  │
│   Enroll    │
│   Button    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────┐
│  Call:                           │
│  POST /api/payments/create-order │
│  {                               │
│    "programId": "uuid",          │
│    "referralCode": "optional"    │
│  }                               │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Backend Route Handler           │
│  - Validate program exists       │
│  - Check if already enrolled     │
│  - Calculate discounts           │
│  - Apply referral code if valid  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  PaymentGateway Service          │
│  - createOrder(amount, userId)   │
│  - Make Razorpay API call        │
│  - Get order_id, amount, etc.    │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Database                        │
│  - Insert order record           │
│  - Status: 'pending'             │
│  - Store gateway_order_id        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Response to Frontend:           │
│  {                               │
│    "orderId": "order_123",       │
│    "amount": 200000,             │
│    "currency": "INR"             │
│  }                               │
└──────────────────────────────────┘
```

### 2. Payment Verification Flow

```
┌──────────────────────┐
│  Razorpay Response   │
│  (from JS handler)   │
│  {                   │
│    "orderId": "...",│
│    "paymentId":"...",│
│    "signature":"..." │
│  }                   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Frontend:                           │
│  POST /api/payments/verify           │
│  body: razorpay response             │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Backend Route Handler:              │
│  - Validate all fields exist         │
│  - Get order from database           │
│  - Get user details                  │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Signature Verification:             │
│  - Create: HMAC(order|payment)       │
│  - Compare with received signature   │
│  - Prevents tampering                │
└──────────┬──────────────────────────┘
           │
           ├─ Invalid ──► Return Error
           │
           ├─ Valid ──┐
           │          │
           ▼          ▼
┌──────────────────────────────────────┐
│  Database Updates:                   │
│  - orders.status = 'paid'            │
│  - Insert payment record             │
│  - payments.status = 'success'       │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Create Enrollment:                  │
│  POST /api/enrollments               │
│  {                                   │
│    "programId": "uuid",              │
│    "verifiedPaymentId": "..."        │
│  }                                   │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Send Confirmation Email             │
│  - User email with receipt           │
│  - Program details                   │
│  - Next steps                        │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Response to Frontend:               │
│  {                                   │
│    "success": true,                  │
│    "enrolled": true,                 │
│    "enrollmentId": "..."             │
│  }                                   │
└──────────────────────────────────────┘
```

## 🔐 Security Layer

```
┌─────────────────────────────────────────────────┐
│           SECURITY VERIFICATION CHAIN            │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. SIGNATURE VERIFICATION                       │
│     ├─ HMAC-SHA256(orderId|paymentId)           │
│     └─ Compare with Razorpay signature          │
│                                                  │
│  2. AMOUNT VALIDATION                            │
│     ├─ Fetch order amount from DB               │
│     ├─ Compare with payment amount              │
│     └─ Reject if mismatch                       │
│                                                  │
│  3. ORDER STATUS CHECK                           │
│     ├─ Verify order exists                      │
│     ├─ Verify order status is 'pending'         │
│     └─ Prevent duplicate processing             │
│                                                  │
│  4. USER AUTHORIZATION                          │
│     ├─ Verify JWT token valid                   │
│     ├─ Verify user matches order                │
│     └─ Prevent payment hijacking                │
│                                                  │
│  5. IDEMPOTENCY CHECK                            │
│     ├─ Check if payment already processed       │
│     ├─ Use payment_id as unique key             │
│     └─ Prevent double enrollment                │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 💾 Database Schema Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT TABLES                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  orders                                                      │
│  ├─ id (UUID, PK)                                          │
│  ├─ student_id (FK → users)                                │
│  ├─ program_id (FK → internship_programs)                  │
│  ├─ order_number (UNIQUE)                                  │
│  ├─ amount (original price)                                │
│  ├─ discount_amount                                         │
│  ├─ final_amount (amount - discount)                       │
│  ├─ status (pending|paid|failed|cancelled)                 │
│  ├─ payment_gateway (razorpay)                             │
│  ├─ gateway_order_id (Razorpay order ID)                   │
│  ├─ referral_code                                          │
│  ├─ created_at                                             │
│  └─ updated_at                                             │
│                                                              │
│  payments                                                    │
│  ├─ id (UUID, PK)                                          │
│  ├─ order_id (FK → orders)                                 │
│  ├─ amount (final_amount paid)                             │
│  ├─ currency (INR)                                         │
│  ├─ payment_method (card|upi|netbanking|wallet)            │
│  ├─ payment_gateway (razorpay)                             │
│  ├─ gateway_payment_id (Razorpay payment ID)               │
│  ├─ gateway_order_id (Razorpay order ID)                   │
│  ├─ status (pending|success|failed|refunded)               │
│  ├─ processed_at (timestamp)                               │
│  ├─ created_at                                             │
│  └─ updated_at                                             │
│                                                              │
│  student_internship                                         │
│  ├─ id (UUID, PK)                                          │
│  ├─ student_id (FK → users)                                │
│  ├─ program_id (FK → internship_programs)                  │
│  ├─ enrollment_date                                        │
│  ├─ status (active|completed|dropped)                      │
│  ├─ payment_id (FK → payments) [NEW]                       │
│  └─ ... other fields                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔗 API Endpoints Summary

```
╔════════════════════════════════════════════════════════════════╗
║              PAYMENT API ENDPOINTS                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  CREATE ORDER (Prepare payment)                                ║
║  POST /api/payments/create-order                               ║
║  Auth: Required (JWT)                                          ║
║  Body: {                                                       ║
║    "programId": "uuid",                                        ║
║    "referralCode": "optional_code"                             ║
║  }                                                             ║
║  Response: { orderId, amount, currency }                       ║
║                                                                ║
║  VERIFY PAYMENT (Process after Razorpay)                       ║
║  POST /api/payments/verify                                     ║
║  Auth: Required (JWT)                                          ║
║  Body: {                                                       ║
║    "orderId": "razorpay_order_id",                             ║
║    "paymentId": "razorpay_payment_id",                         ║
║    "signature": "razorpay_signature"                           ║
║  }                                                             ║
║  Response: { success, enrolled, enrollmentId }                 ║
║                                                                ║
║  GET PAYMENT STATUS (Check payment state)                      ║
║  GET /api/payments/status/:orderId                             ║
║  Auth: Required (JWT)                                          ║
║  Response: { status, amount, paymentId, paidAt }               ║
║                                                                ║
║  LIST ORDERS (User payment history)                            ║
║  GET /api/payments/orders                                      ║
║  Auth: Required (JWT)                                          ║
║  Response: { orders: [...] }                                   ║
║                                                                ║
║  CREATE ENROLLMENT (After payment)                             ║
║  POST /api/enrollments                                         ║
║  Auth: Required (JWT)                                          ║
║  Body: { "programId": "uuid" }                                 ║
║  Note: Now requires prior payment                              ║
║  Response: { enrollmentId, status }                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

## 🧪 Test Scenarios & Expected Behavior

### Scenario: Complete Payment & Enrollment

```
Step 1: User clicks "Enroll Now"
├─ Frontend: Navigate to ProgramDetail page
├─ Display: Program details with price
└─ State: isEnrolled = false

Step 2: Frontend calls POST /api/payments/create-order
├─ Backend: Validates program exists
├─ Backend: Creates order in DB (status: pending)
├─ Backend: Calls PaymentGateway.createOrder()
├─ Backend: Returns order details
└─ Frontend: Has orderId, amount, keyId

Step 3: Frontend opens PaymentModal with Razorpay
├─ Razorpay: Loads payment form
├─ User: Enters card: 4111111111111111 (test success)
├─ User: Clicks Pay
└─ Razorpay: Processes payment (mock in test mode)

Step 4: Razorpay sends callback with response
├─ paymentId: razorpay_payment_1234567890
├─ orderId: order_abcdefghij
├─ signature: razorpay_signature_xyz
└─ Frontend: Captures in handler

Step 5: Frontend calls POST /api/payments/verify
├─ Backend: Extracts orderId, paymentId, signature
├─ Backend: Validates signature (critical!)
├─ Backend: Verifies amount matches
├─ Backend: Updates order status = 'paid'
├─ Backend: Creates payment record
├─ Backend: Creates enrollment via internal call
├─ Backend: Sends confirmation email
└─ Backend: Returns success response

Step 6: Frontend redirects to PaymentSuccess page
├─ Display: "Payment successful!"
├─ Show: Order details
├─ Show: Enrollment confirmation
├─ Button: "Go to Dashboard"
└─ Auto-redirect after 3 seconds

Step 7: Backend state
├─ Database:
│  ├─ orders.status = 'paid'
│  ├─ payments.status = 'success'
│  └─ student_internship created
├─ Email sent to user
└─ User fully enrolled
```

## 🚀 Deployment Checklist

- [ ] All payment code committed to git
- [ ] Environment variables configured on production server
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Payment endpoints secured (HTTPS only)
- [ ] Razorpay production credentials obtained
- [ ] Webhook endpoint configured (optional)
- [ ] Payment logs configured
- [ ] Error monitoring set up (Sentry/DataDog)
- [ ] Database backups scheduled
- [ ] Payment processing tested end-to-end
- [ ] User documentation prepared

## 📞 When You're Ready

Provide your Razorpay credentials and we'll:
1. Implement all backend payment services
2. Create payment modal component
3. Integrate with enrollment flow
4. Test with your actual credentials
5. Deploy to production

**You will provide:**
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- Account details for testing
