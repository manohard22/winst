# 💳 WINST Payment Gateway Integration Guide

## 📋 Overview

This document outlines the complete payment gateway integration setup for the WINST Internship Portal using **Razorpay** as the primary payment processor.

## 🔄 Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW DIAGRAM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (User clicks Enroll)                              │
│         ↓                                                    │
│  Payment Modal Opens (Razorpay)                             │
│         ↓                                                    │
│  User enters payment details                                │
│         ↓                                                    │
│  Razorpay processes payment                                 │
│         ↓                                                    │
│  Callback sent to Backend /api/payments/verify              │
│         ↓                                                    │
│  Backend validates signature & amount                       │
│         ↓                                                    │
│  ┌─ SUCCESS ──→ Create enrollment + Send confirmation email │
│  │                                                           │
│  └─ FAILURE ──→ Show error, allow retry or cancel           │
│         ↓                                                    │
│  Frontend redirects to success/failure page                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Current Implementation Status

### ✅ Already Exists
- `backend/routes/payments.js` - Partial payment API endpoints
- `database/schema.sql` - Orders and payments tables
- `frontend/src/pages/Payment.jsx` - Payment page template
- `frontend/src/pages/PaymentHistory.jsx` - Payment history display
- Database schema with orders and payments tables

### ⚠️ Needs Implementation
- Modular Razorpay service class
- Payment signature verification
- Enrollment flow integration with payment
- Payment status check in enrollments
- Proper error handling and logging
- Payment success/failure pages

## 🛠️ Setup Steps (In Order)

### STEP 1: Get Razorpay Credentials

You will provide:
- **Razorpay Account ID** (Your merchant account)
- **Razorpay Key ID** (Public key for frontend)
- **Razorpay Key Secret** (Private key for backend verification - KEEP SECRET)

These will be configured in:
```
Backend: .env file
  RAZORPAY_KEY_ID=<your_public_key>
  RAZORPAY_KEY_SECRET=<your_secret_key>

Frontend: .env.local file
  VITE_RAZORPAY_KEY_ID=<your_public_key>
```

### STEP 2: Create Backend Payment Service Module

**File: `backend/utils/paymentGateway.js`**
- Razorpay client initialization
- Order creation helper
- Signature verification function
- Error handling utilities

### STEP 3: Create Verification Utility

**File: `backend/utils/razorpayVerification.js`**
- HMAC SHA256 signature verification
- Payment amount validation
- Status checks

### STEP 4: Update Payment API Routes

**File: `backend/routes/payments.js`**
Add three endpoints:
1. `POST /api/payments/orders` - Create Razorpay order
2. `POST /api/payments/verify` - Verify payment signature
3. `POST /api/payments/callback` - Handle payment webhook

### STEP 5: Update Enrollment Logic

**File: `backend/routes/enrollments.js`**
- Check if payment is completed before allowing enrollment
- Validate order status
- Create enrollment only after successful payment

### STEP 6: Create Frontend Payment Modal Component

**File: `frontend/src/components/PaymentModal.jsx`**
- Razorpay payment form
- Amount calculation
- Error handling
- Success/failure handlers

### STEP 7: Update Frontend Enroll Flow

**File: `frontend/src/pages/ProgramDetail.jsx`**
- Modify `handleEnroll` to show payment modal
- Pass program and pricing details
- Handle payment completion

### STEP 8: Create Success/Failure Pages

**File: `frontend/src/pages/PaymentSuccess.jsx`**
- Show confirmation
- Auto-redirect to dashboard

**File: `frontend/src/pages/PaymentFailure.jsx`**
- Show error details
- Retry button

## 📊 Database Tables

### `orders` table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES users(id),
    program_id UUID REFERENCES internship_programs(id),
    order_number VARCHAR(50) UNIQUE,
    amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    status VARCHAR(20) -- 'pending', 'paid', 'failed', 'cancelled'
    payment_gateway VARCHAR(50),
    gateway_order_id VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### `payments` table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(10,2),
    currency VARCHAR(5) DEFAULT 'INR',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_payment_id VARCHAR(200),
    gateway_order_id VARCHAR(200),
    status VARCHAR(20) -- 'pending', 'success', 'failed'
    processed_at TIMESTAMP,
    created_at TIMESTAMP
);
```

## 🔐 Security Considerations

1. **Never expose secret key** - Keep RAZORPAY_KEY_SECRET server-side only
2. **Always verify signature** - Validate HMAC-SHA256 signature on callback
3. **Verify amount** - Check requested amount matches stored order amount
4. **Use HTTPS** - All payment endpoints must use HTTPS in production
5. **Idempotent operations** - Handle duplicate callbacks gracefully

## 📋 Razorpay Integration Details

### Order Creation Flow
```javascript
// On frontend enroll click:
1. Call backend POST /api/payments/orders
   - Pass: programId, userId, amount
   
2. Backend returns:
   - Razorpay order ID
   - Amount (in paise)
   - Currency
   - Customer details
   
3. Open Razorpay payment modal with these details
```

### Payment Verification Flow
```javascript
// After user completes payment:
1. Razorpay sends callback with:
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature
   
2. Backend verifies:
   - Signature validity
   - Payment amount
   - Order existence
   
3. If valid:
   - Mark order as PAID
   - Create enrollment
   - Send confirmation email
   - Return success to frontend
```

## 🧪 Testing

### Test Cards (Razorpay Sandbox)
```
Success:
  Card: 4111111111111111
  Expiry: Any future date
  CVV: Any 3 digits

Failure:
  Card: 4000000000000002
  Expiry: Any future date
  CVV: Any 3 digits
```

## 📝 Environment Variables Template

```bash
# Backend .env
RAZORPAY_KEY_ID=your_public_key_here
RAZORPAY_KEY_SECRET=your_secret_key_here
PAYMENT_MODE=test  # or 'live' in production
PAYMENT_CURRENCY=INR

# Frontend .env.local
VITE_RAZORPAY_KEY_ID=your_public_key_here
VITE_PAYMENT_API_URL=http://localhost:3001/api/payments
```

## 🚀 Implementation Roadmap

1. **Phase 1**: Create backend payment service (modular, testable)
2. **Phase 2**: Create frontend payment component (reusable modal)
3. **Phase 3**: Integrate with enrollment flow
4. **Phase 4**: Create success/failure pages
5. **Phase 5**: Add payment history and receipts
6. **Phase 6**: Implement refund logic
7. **Phase 7**: Add affiliate/referral payment logic

## ⚠️ Important Notes

- **Razorpay account required** - You need a live Razorpay merchant account
- **Test mode available** - Sandbox environment for testing
- **Signature verification critical** - Never skip verification step
- **Amount in paise** - Razorpay uses paise (1 INR = 100 paise)
- **Idempotency key** - Consider adding for duplicate payment prevention

## 📚 Razorpay Documentation

- Official Docs: https://razorpay.com/docs/
- API Reference: https://razorpay.com/docs/api/
- Payment Forms: https://razorpay.com/docs/payment-gateway/web-integration/hosted-checkout/
- Node.js SDK: https://github.com/razorpay/razorpay-node

## ✨ Ready for Implementation?

When you provide your Razorpay credentials, we can immediately:
1. Create the backend payment service module
2. Set up all API endpoints
3. Create the frontend payment component
4. Integrate with enrollment flow
5. Test the complete payment process

**Please provide your Razorpay account details to proceed!**
