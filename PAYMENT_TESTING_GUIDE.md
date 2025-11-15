# Razorpay Payment Gateway - Complete Testing Guide

## 🎯 Quick Start - Test Payment in 5 Minutes

### 1. Ensure Servers are Running

**Terminal 1 - Backend:**
```powershell
cd "e:\winst project\winst\backend"
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd "e:\winst project\winst\frontend"
npm run dev
```

### 2. Environment Variables Already Set
Your `.env` file is already configured with:
```
RAZORPAY_KEY_ID=rzp_test_Rg6RU7sG2Gb5tj
RAZORPAY_KEY_SECRET=6FDt2PXoDCAPdq7s55eB2P59
RAZORPAY_ACCOUNT_ID=6FDt2PXoDCAPdq7s55eB2P59
PAYMENT_MODE=test
```

---

## 🧪 Test Payment Process

### What's the Flow?

```
User Views Program → Clicks "Enroll" → Payment Modal Opens
  → User Clicks "Pay ₹1" → Razorpay Checkout Opens
  → User Enters Test Card Details → Payment Processed
  → Backend Verifies Signature → Enrollment Created
  → Success Page → Redirected to Dashboard
```

### Test Cards (Use in Razorpay Checkout)

#### ✅ Successful Payment
```
Card Number:  4111 1111 1111 1111
Expiry:       12/25 (any future date)
CVV:          123 (any 3 digits)
Email:        Any email
Name:         Any name
```

#### ❌ Failed Payment (Declined)
```
Card Number:  4000 0000 0000 0002
Expiry:       12/25
CVV:          123
```

#### ⚠️ Timeout Payment
```
Card Number:  4000 0000 0000 0102
Expiry:       12/25
CVV:          123
```

---

## 🔍 Step-by-Step Testing

### Step 1: Access Frontend
1. Open http://localhost:5173 in browser
2. If not logged in:
   - Click "Sign Up" or "Login"
   - Create test account or login with existing user

### Step 2: Navigate to Programs
1. Click on "Programs" or "Internships" menu
2. Browse available programs
3. Click on any program card

### Step 3: Open Payment Modal
1. On program detail page, look for "Enroll" or "Enroll Now" button
2. Click the button
3. **PaymentModal component opens** showing:
   - Program name
   - Enrollment fee (₹1 for testing)
   - "Pay ₹1" button

### Step 4: Initiate Payment
1. Click "Pay ₹1" button in modal
2. You'll see "Processing..." indicator
3. Backend makes call to: `POST /api/payments/initiate`
4. Razorpay order is created
5. **Razorpay Checkout opens** (popup window)

### Step 5: Complete Razorpay Checkout
1. **In Razorpay Popup:**
   - Check amount shows ₹1
   - Check program title is correct
   
2. **Select Payment Method:**
   - Default is Credit Card
   - Fill test card details:
     ```
     Card Number:  4111 1111 1111 1111
     Expiry:       12 / 25
     CVV:          123
     ```
   
3. **Fill Customer Details:**
   - Name: (auto-filled from your profile)
   - Email: (auto-filled from your profile)
   - Contact: (optional)

4. **Click "Pay ₹1"** in Razorpay popup

### Step 6: Verify Backend Processing
1. Check backend logs (Terminal 1) for:
   ```
   📋 Initiating payment...
   ✅ Order created successfully: order_XXXXX
   🔐 Verifying payment signature...
   ✅ Signature verified successfully
   ✅ Enrollment created
   ```

2. If you see `❌ Signature verification failed`:
   - Check RAZORPAY_KEY_SECRET in .env
   - Restart backend with updated credentials

### Step 7: Verify Success
1. Frontend shows **"Payment successful! Enrollment completed."**
2. Modal closes after 2 seconds
3. **Redirected to Dashboard**
4. New enrollment should appear in "My Enrollments"

---

## 📊 Verify in Database

### Check Orders Table
```sql
-- Connect to database
psql -U winst_db_user -d winst_portal_db

-- View latest orders
SELECT 
  order_id,
  student_id,
  program_id,
  amount,
  status,
  razorpay_order_id,
  razorpay_payment_id,
  created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
```

Expected output after successful payment:
```
 order_id | student_id | program_id | amount | status | razorpay_order_id | razorpay_payment_id | created_at
----------+------------+------------+--------+--------+-------------------+---------------------+-----------
        1 |          5 |          1 |      1 | paid   | order_XXXXX       | pay_XXXXX           | 2025-11-15
```

### Check Enrollments
```sql
-- View student enrollments
SELECT 
  id,
  student_id,
  program_id,
  enrollment_date,
  status,
  is_active
FROM student_internship 
WHERE student_id = YOUR_STUDENT_ID
ORDER BY enrollment_date DESC;
```

---

## 🛠️ API Testing (Using Curl or Postman)

### Test 1: Get Razorpay Key
```bash
curl http://localhost:3001/api/payments/key

# Expected Response:
# {
#   "success": true,
#   "data": {
#     "keyId": "rzp_test_Rg6RU7sG2Gb5tj",
#     "mode": "test"
#   }
# }
```

### Test 2: Initiate Payment
```bash
curl -X POST http://localhost:3001/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "programId": 1,
    "studentId": 5,
    "amount": 1,
    "email": "student@example.com",
    "fullName": "John Doe"
  }'

# Expected Response:
# {
#   "success": true,
#   "message": "Payment order created successfully",
#   "data": {
#     "orderId": "order_Rg6RU7sG2Gb5tj",
#     "amount": 1,
#     "amountInPaise": 100,
#     "currency": "INR",
#     "keyId": "rzp_test_Rg6RU7sG2Gb5tj",
#     "studentId": 5,
#     "email": "student@example.com",
#     "name": "John Doe"
#   }
# }
```

### Test 3: Check Payment Status
```bash
curl http://localhost:3001/api/payments/status/order_XXXXX

# Replace order_XXXXX with actual order ID from previous response
```

---

## ✅ Complete Testing Checklist

### Initial Setup
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] .env file has Razorpay credentials
- [ ] Database connection working

### Payment Flow - Success Path
- [ ] Can access program detail page
- [ ] "Enroll" button visible and clickable
- [ ] Payment modal opens correctly
- [ ] Payment modal shows correct program and amount
- [ ] "Pay ₹1" button triggers Razorpay checkout
- [ ] Razorpay checkout opens as popup
- [ ] Test card payment completes
- [ ] Backend logs show "Signature verified"
- [ ] Success message displays
- [ ] Redirected to dashboard
- [ ] New enrollment visible in dashboard

### Payment Flow - Failure Path
- [ ] Click "Cancel" in modal closes it gracefully
- [ ] Test card 4000 0000 0000 0002 shows error
- [ ] Error message displays clearly
- [ ] User can click "Try Again" to retry
- [ ] Can close modal and try different payment

### Database Verification
- [ ] Order created with status "pending"
- [ ] Order updated to status "paid" after payment
- [ ] Payment record created in payments table
- [ ] Enrollment record created in student_internship
- [ ] All timestamps correct (created_at, updated_at)

### Security
- [ ] Signature verification working (not bypassed)
- [ ] Invalid signatures rejected
- [ ] Only valid payments create enrollments
- [ ] Order associated with correct student

---

## 🔧 Troubleshooting

### Issue: "Failed to create payment order"
```
❌ Error: Failed to create payment order
   Message: Network error or invalid credentials

✅ Solution:
1. Check backend is running: npm start in backend folder
2. Check .env has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
3. Check network tab in DevTools (F12)
4. Check backend logs for error details
```

### Issue: "Payment verification failed"
```
❌ Error: Payment verification failed. Signature mismatch.

✅ Solution:
1. Verify RAZORPAY_KEY_SECRET is EXACTLY correct in .env
2. Restart backend after updating .env
3. Check that key_secret has no extra spaces
4. Compare with dashboard value character by character
5. Test with fresh payment after fix
```

### Issue: Payment succeeds but no enrollment created
```
❌ Symptom: Success message shows but enrollment not in dashboard

✅ Solution:
1. Check backend logs for database errors
2. Verify student_id and program_id in request
3. Check student_internship table exists
4. Run this query: SELECT * FROM student_internship WHERE student_id = YOUR_ID;
5. Check for any database constraints
```

### Issue: Razorpay checkout doesn't open
```
❌ Error: Razorpay checkout popup doesn't appear

✅ Solution:
1. Check browser popup blocker is disabled
2. Open DevTools Console (F12)
3. Type: window.Razorpay (should show function)
4. Check if script loaded: check Network tab for checkout.razorpay.com
5. Check RAZORPAY_KEY_ID is valid
6. Test with incognito window to avoid popup blocker
```

### Issue: "Amount must be at least ₹1"
```
❌ Error: Amount validation failed

✅ Solution:
1. Ensure program.price >= 1
2. Or edit test to use higher amount
3. Frontend should enforce minimum
```

---

## 📈 Next Steps After Testing

### Customize for Production

1. **Update Amount:**
   - Change from ₹1 to actual program prices
   - Test with different amounts (₹499, ₹999, etc.)

2. **Enhance Success Page:**
   - Show enrollment certificate
   - Display course modules
   - Send confirmation email
   - Update dashboard with immediate reflection

3. **Add Post-Payment Flow:**
   - Generate enrollment confirmation
   - Send welcome email with course links
   - Create student profile update
   - Show next steps (first task, etc.)

4. **Integrate with Affiliates:**
   - Calculate affiliate commission
   - Update referral status
   - Send commission notification

5. **Implement Refund System:**
   - Add refund button for within 7 days
   - Process refund through Razorpay
   - Update order status to "refunded"

---

## 💡 Key Implementation Details

### PaymentModal Component (Frontend)
- Location: `frontend/src/components/PaymentModal.jsx`
- Handles entire payment UI and flow
- Integrates with Razorpay checkout
- Calls backend endpoints
- Shows status (processing, success, failed)

### Payment Controller (Backend)
- Location: `backend/controllers/paymentController.js`
- `initiatePayment()` - Creates Razorpay order
- `verifyPayment()` - Verifies signature, creates enrollment
- `getPaymentStatus()` - Check payment status
- `handlePaymentFailure()` - Log failures

### Payment Gateway (Backend)
- Location: `backend/utils/paymentGateway.js`
- Direct Razorpay API integration using HTTPS
- Signature verification with crypto
- Order creation with metadata
- Payment fetching and refund processing

### Payment Routes
- Location: `backend/routes/payments.js`
- All payment endpoints defined
- Combined with legacy order endpoints
- Uses payment controller for logic

---

## 🚀 Production Checklist

Before going live:

- [ ] Test with real program prices (not ₹1)
- [ ] Update RAZORPAY_KEY_ID to live key
- [ ] Update RAZORPAY_KEY_SECRET to live secret
- [ ] Set PAYMENT_MODE=live
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable CSRF protection
- [ ] Add payment reconciliation
- [ ] Set up logging/monitoring
- [ ] Create refund workflow
- [ ] Write support docs
- [ ] Test payment failure handling
- [ ] Backup database before launch

---

## 📞 Support

For technical questions:
1. Check backend logs (`npm start` output)
2. Check browser console (F12 → Console tab)
3. Check database directly with psql
4. Use curl to test API directly
5. Review error messages in PaymentModal

---

**Last Updated:** November 15, 2025
**Status:** Ready for Testing ✅
