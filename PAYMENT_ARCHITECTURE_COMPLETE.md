# Complete Payment Gateway Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│                                                                      │
│  ProgramDetail.jsx                                                  │
│  ├─ User clicks "Enroll Now" button                               │
│  └─ Triggers: setShowPaymentModal(true)                           │
│                                                                      │
│          ↓                                                          │
│                                                                      │
│  PaymentModal.jsx (New Component)                                  │
│  ├─ Shows program details and ₹1 fee                             │
│  ├─ User clicks "Pay ₹1"                                         │
│  └─ Calls: POST /api/payments/initiate                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                           │
│                                                                      │
│  POST /api/payments/initiate                                        │
│  (paymentController.initiatePayment)                                │
│  ├─ Validate input (amount, email, etc)                           │
│  ├─ Call: paymentGateway.createOrder()                            │
│  │        ↓ (HTTPS to Razorpay API)                               │
│  │        Creates Razorpay Order                                  │
│  │        Returns: order_id, keyId, amountInPaise                │
│  ├─ Store order in DB: orders table (status: pending)             │
│  └─ Return order details to frontend                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ Response
┌─────────────────────────────────────────────────────────────────────┐
│                    RAZORPAY CHECKOUT (Browser)                      │
│                                                                      │
│  Razorpay Popup Window Opens                                       │
│  ├─ Shows payment form                                             │
│  ├─ User enters test card: 4111 1111 1111 1111                   │
│  ├─ User enters expiry: 12/25                                     │
│  ├─ User enters CVV: 123                                          │
│  ├─ User clicks "Pay ₹1"                                          │
│  └─ Razorpay processes payment                                    │
│       ├─ Deducts from test wallet (no real money)                 │
│       └─ Returns payment result to frontend callback              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                      ↓ Callback Response
┌─────────────────────────────────────────────────────────────────────┐
│                 FRONTEND CALLBACK (PaymentModal)                    │
│                                                                      │
│  handler: function(response) {                                      │
│    ├─ Receive:                                                     │
│    │  ├─ razorpay_payment_id (e.g., pay_XXXXX)                   │
│    │  ├─ razorpay_order_id (e.g., order_XXXXX)                   │
│    │  └─ razorpay_signature (HMAC-SHA256 hash)                   │
│    │                                                               │
│    ├─ Call: POST /api/payments/verify                            │
│    └─ Send payment details to backend for verification           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND VERIFICATION                             │
│                                                                      │
│  POST /api/payments/verify                                          │
│  (paymentController.verifyPayment)                                  │
│                                                                      │
│  Step 1: Verify Signature (CRITICAL FOR SECURITY)                 │
│  ├─ Extract: orderId, paymentId, signature from request           │
│  ├─ Create data string: "${orderId}|${paymentId}"                 │
│  ├─ Generate HMAC-SHA256 hash using RAZORPAY_KEY_SECRET          │
│  ├─ Compare with received signature                               │
│  └─ If mismatch: Reject payment (fraud protection)                │
│                                                                      │
│  Step 2: Fetch Payment Details from Razorpay                      │
│  ├─ Call: GET /api/v1/payments/{paymentId}                       │
│  ├─ Verify payment status = "captured"                            │
│  └─ Return amount and payment info                                │
│                                                                      │
│  Step 3: Create Enrollment in Database                            │
│  ├─ INSERT INTO orders (status='paid', razorpay_payment_id, ...)  │
│  ├─ INSERT INTO student_internship (student_id, program_id, ...)  │
│  └─ Commit transaction                                            │
│                                                                      │
│  Step 4: Return Success Response                                  │
│  └─ verified: true                                                │
│     enrollment: { id, student_id, program_id, enrollment_date }   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                        ↓ Success Response
┌─────────────────────────────────────────────────────────────────────┐
│              FRONTEND SUCCESS HANDLER (PaymentModal)                │
│                                                                      │
│  ├─ setPaymentStatus('success')                                   │
│  ├─ Show checkmark icon                                           │
│  ├─ Display: "Payment successful! Enrollment completed."          │
│  ├─ Call: onPaymentSuccess() callback                             │
│  ├─ Wait 2 seconds                                                │
│  └─ navigate('/student/dashboard')                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                                │
│                                                                      │
│  ✅ New enrollment visible in "My Enrollments"                     │
│  ✅ Can access program modules                                     │
│  ✅ Payment receipt available                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Breakdown

### 1. PaymentModal.jsx (Frontend)
**Location:** `frontend/src/components/PaymentModal.jsx`

**Props:**
```javascript
{
  isOpen: true,                    // Modal visibility
  onClose: () => {},               // Close callback
  program: {
    id: 1,
    title: "Node.js Mastery",
    price: 1
  },
  student: {
    id: 5,
    email: "student@example.com",
    fullName: "John Doe",
    phone: "+91..."
  },
  onPaymentSuccess: (data) => {}   // Success callback
}
```

**Flow:**
1. Opens modal when `isOpen={true}`
2. Shows program details
3. User clicks "Pay ₹X"
4. Calls `POST /api/payments/initiate`
5. Loads Razorpay checkout script
6. Opens Razorpay popup
7. Handles success/failure callbacks
8. Verifies payment via backend
9. Redirects on success

**State Management:**
- `loading` - Show spinner during processing
- `paymentStatus` - 'processing', 'success', 'failed', null
- `errorMessage` - Display error details
- `orderId` - Track Razorpay order ID

---

### 2. PaymentController.js (Backend)
**Location:** `backend/controllers/paymentController.js`

**Functions:**

#### initiatePayment()
```javascript
POST /api/payments/initiate
Request: {
  programId: 1,
  studentId: 5,
  amount: 1,
  email: "student@example.com",
  fullName: "John Doe"
}

Response: {
  success: true,
  data: {
    orderId: "order_Rg6RU7sG2Gb5tj",
    amount: 1,
    amountInPaise: 100,
    currency: "INR",
    keyId: "rzp_test_Rg6RU7sG2Gb5tj",
    studentId: 5,
    email: "student@example.com",
    name: "John Doe"
  }
}
```

**Logic:**
1. Validate input fields
2. Check amount >= 1
3. Create Razorpay order via gateway
4. Store order in DB (status: pending)
5. Return order details to frontend

#### verifyPayment()
```javascript
POST /api/payments/verify
Request: {
  razorpay_payment_id: "pay_Rg6RU7sG2Gb5tj",
  razorpay_order_id: "order_Rg6RU7sG2Gb5tj",
  razorpay_signature: "9ef4dff...",
  programId: 1,
  studentId: 5
}

Response: {
  success: true,
  data: {
    verified: true,
    paymentId: "pay_...",
    orderId: "order_...",
    enrollment: { id, student_id, program_id, enrollment_date }
  }
}
```

**Logic:**
1. Verify Razorpay signature (CRITICAL!)
2. Fetch payment details from Razorpay
3. Check payment status = "captured"
4. Update order in DB (status: paid)
5. Create enrollment record
6. Return success with enrollment details

#### getPaymentStatus()
```javascript
GET /api/payments/status/:orderId

Response: {
  success: true,
  data: {
    orderId: "order_...",
    status: "paid",
    amount: 1,
    studentId: 5,
    programId: 1,
    createdAt: "2025-11-15...",
    paidAt: "2025-11-15..."
  }
}
```

#### handlePaymentFailure()
```javascript
POST /api/payments/failure
Request: {
  orderId: "order_...",
  error: "CANCELLED",
  reason: "User cancelled the payment"
}

Response: {
  success: true,
  data: {
    orderId: "order_...",
    status: "failed",
    reason: "User cancelled the payment"
  }
}
```

---

### 3. PaymentGateway.js (Backend Utility)
**Location:** `backend/utils/paymentGateway.js`

**Responsibilities:**
- Direct HTTPS communication with Razorpay API
- Signature verification
- Order creation
- Payment fetching
- Refund processing

**Key Methods:**

#### createOrder()
```javascript
const orderResult = await paymentGateway.createOrder(
  amount,        // ₹ in rupees
  customerId,    // student ID
  email,         // student email
  metadata       // { programId, studentId, etc }
);
```

**What it does:**
1. Validates amount and customer ID
2. Converts rupees to paise (1 rupee = 100 paise)
3. Makes HTTPS POST request to Razorpay API
4. Creates order with metadata and receipt
5. Returns order details with order_id

#### verifyPaymentSignature()
```javascript
const isValid = paymentGateway.verifyPaymentSignature(
  orderId,
  paymentId,
  signature
);
```

**What it does:**
1. Creates data string: "${orderId}|${paymentId}"
2. Generates HMAC-SHA256 hash using KEY_SECRET
3. Compares with received signature
4. Returns true/false
5. **This prevents payment tampering!**

#### getPaymentDetails()
```javascript
const paymentDetails = await paymentGateway.getPaymentDetails(paymentId);
```

**What it does:**
1. Makes HTTPS GET request to Razorpay API
2. Fetches complete payment information
3. Returns payment status, amount, customer info
4. Confirms payment is "captured"

---

### 4. Database Schema

```sql
-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  program_id INTEGER NOT NULL,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  final_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE student_internship (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  program_id INTEGER NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Records Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  razorpay_payment_id VARCHAR(100),
  amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Data Flow Example

### Successful Payment Scenario

```
1. User Data in Frontend:
   user = { id: 5, email: "john@example.com", name: "John Doe" }
   program = { id: 1, title: "Node.js", price: 1 }

2. Frontend calls initiatePayment:
   POST /api/payments/initiate
   Body: {
     programId: 1,
     studentId: 5,
     amount: 1,
     email: "john@example.com",
     fullName: "John Doe"
   }

3. Backend creates Razorpay order:
   PaymentGateway.createOrder(1, 5, "john@example.com", {...})
   ├─ Convert: 1 rupee = 100 paise
   ├─ Create: receipt = "RCP-5-1731676200000"
   ├─ Call HTTPS: POST api.razorpay.com/api/v1/orders
   └─ Return: order_id = "order_Rg6RU7sG2Gb5tj"

4. Backend stores in DB:
   INSERT INTO orders VALUES (
     null, 5, 1, "order_Rg6RU7sG2Gb5tj", 1.00, 'pending', ...
   )

5. Frontend receives order details:
   {
     orderId: "order_Rg6RU7sG2Gb5tj",
     keyId: "rzp_test_Rg6RU7sG2Gb5tj",
     amount: 1,
     amountInPaise: 100,
     currency: "INR"
   }

6. Frontend opens Razorpay Checkout:
   new window.Razorpay({
     key: "rzp_test_Rg6RU7sG2Gb5tj",
     order_id: "order_Rg6RU7sG2Gb5tj",
     amount: 100
   })

7. User enters test card and pays:
   Card: 4111 1111 1111 1111
   Expiry: 12/25
   CVV: 123

8. Razorpay processes payment:
   ├─ Validates card
   ├─ Deducts from test wallet (no real money)
   ├─ Creates payment_id = "pay_Rg6RU7sG2Gb5tj"
   └─ Calls handler callback with payment details

9. Frontend receives payment callback:
   {
     razorpay_order_id: "order_Rg6RU7sG2Gb5tj",
     razorpay_payment_id: "pay_Rg6RU7sG2Gb5tj",
     razorpay_signature: "9ef4dffbfd84f1318f6739a3ce19f9d..."
   }

10. Frontend calls verifyPayment:
    POST /api/payments/verify
    Body: {
      razorpay_payment_id: "pay_Rg6RU7sG2Gb5tj",
      razorpay_order_id: "order_Rg6RU7sG2Gb5tj",
      razorpay_signature: "9ef4dffbfd84f1318f...",
      programId: 1,
      studentId: 5
    }

11. Backend verifies signature:
    ├─ data = "order_Rg6RU7sG2Gb5tj|pay_Rg6RU7sG2Gb5tj"
    ├─ hash = HMAC-SHA256(data, KEY_SECRET)
    ├─ Compare hash with received signature
    └─ PASS ✅

12. Backend fetches payment from Razorpay:
    GET /api/v1/payments/pay_Rg6RU7sG2Gb5tj
    Response:
    {
      id: "pay_Rg6RU7sG2Gb5tj",
      amount: 100,
      currency: "INR",
      status: "captured"
    }

13. Backend creates enrollment:
    INSERT INTO student_internship VALUES (
      null, 5, 1, NOW(), 'active', true, NOW()
    )

14. Backend updates order:
    UPDATE orders SET
      status = 'paid',
      razorpay_payment_id = 'pay_Rg6RU7sG2Gb5tj',
      final_amount = 1.00
    WHERE razorpay_order_id = 'order_Rg6RU7sG2Gb5tj'

15. Backend returns success:
    {
      success: true,
      data: {
        verified: true,
        paymentId: "pay_Rg6RU7sG2Gb5tj",
        enrollment: { id: 10, student_id: 5, program_id: 1 }
      }
    }

16. Frontend receives success:
    ├─ setPaymentStatus('success')
    ├─ Show checkmark icon
    ├─ Display success message
    ├─ Wait 2 seconds
    └─ navigate('/student/dashboard')

17. User sees dashboard:
    ├─ New enrollment appears in "My Enrollments"
    ├─ Can access program modules
    └─ Payment record shows in history
```

---

## Security Implementation

### 1. Signature Verification (Most Important)
```javascript
// Frontend sends payment details after Razorpay checkout
// Backend verifies signature to ensure payment wasn't tampered

const data = `${orderId}|${paymentId}`;
const expectedSig = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(data)
  .digest('hex');

if (expectedSig !== receivedSignature) {
  // Payment is FAKE - REJECT IT!
  throw new Error('Signature verification failed');
}
```

### 2. Amount Validation
```javascript
// Verify amount hasn't changed
if (paymentDetails.amount !== expectedAmount * 100) {
  throw new Error('Amount mismatch - possible fraud');
}
```

### 3. Payment Status Check
```javascript
// Only accept captured payments
if (paymentDetails.status !== 'captured') {
  throw new Error('Payment not captured');
}
```

### 4. Database Transaction
```javascript
// Use transactions to ensure atomicity
BEGIN TRANSACTION
  UPDATE orders SET status = 'paid'
  INSERT INTO student_internship ...
COMMIT TRANSACTION
// If any step fails, entire transaction rolls back
```

---

## Environment Variables

```bash
# Test Mode (Current)
RAZORPAY_KEY_ID=rzp_test_Rg6RU7sG2Gb5tj
RAZORPAY_KEY_SECRET=6FDt2PXoDCAPdq7s55eB2P59
RAZORPAY_ACCOUNT_ID=6FDt2PXoDCAPdq7s55eB2P59
PAYMENT_MODE=test
PAYMENT_AMOUNT_MIN=1

# Production Mode (When Ready)
RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET
RAZORPAY_ACCOUNT_ID=YOUR_ACTUAL_ACCOUNT_ID
PAYMENT_MODE=live
PAYMENT_AMOUNT_MIN=100
```

---

## API Request/Response Examples

### 1. Initiate Payment

**Request:**
```bash
curl -X POST http://localhost:3001/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "programId": 1,
    "studentId": 5,
    "amount": 1,
    "email": "john@example.com",
    "fullName": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_Rg6RU7sG2Gb5tj",
    "amount": 1,
    "amountInPaise": 100,
    "currency": "INR",
    "keyId": "rzp_test_Rg6RU7sG2Gb5tj",
    "studentId": 5,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 2. Verify Payment

**Request:**
```bash
curl -X POST http://localhost:3001/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_payment_id": "pay_Rg6RU7sG2Gb5tj",
    "razorpay_order_id": "order_Rg6RU7sG2Gb5tj",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d...",
    "programId": 1,
    "studentId": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and enrollment successful!",
  "data": {
    "verified": true,
    "paymentId": "pay_Rg6RU7sG2Gb5tj",
    "orderId": "order_Rg6RU7sG2Gb5tj",
    "enrollment": {
      "id": 10,
      "student_id": 5,
      "program_id": 1,
      "enrollment_date": "2025-11-15T10:30:00Z"
    },
    "amount": 1,
    "currency": "INR"
  }
}
```

---

## Testing Commands

```bash
# Test 1: Get Razorpay Key
curl http://localhost:3001/api/payments/key

# Test 2: Create Order
curl -X POST http://localhost:3001/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"programId":1,"studentId":5,"amount":1,"email":"test@example.com","fullName":"Test User"}'

# Test 3: Check Payment Status
curl http://localhost:3001/api/payments/status/order_XXXXX

# Test 4: View Database Orders
psql -U winst_db_user -d winst_portal_db -c "SELECT * FROM orders LIMIT 5;"

# Test 5: View Enrollments
psql -U winst_db_user -d winst_portal_db -c "SELECT * FROM student_internship WHERE student_id=5 LIMIT 5;"
```

---

**Status: FULLY OPERATIONAL** ✅
**Ready for: TESTING & PRODUCTION**
