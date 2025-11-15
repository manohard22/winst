# Razorpay Payment Flow - Complete Guide

## How Razorpay Payment Works

### The Complete Flow

```
┌─────────────────┐
│  Student/User   │
│  Clicks "Enroll"│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   PaymentModal Opens            │
│   Shows: Program Name & ₹1 Fee  │
└────────┬────────────────────────┘
         │
         │ User clicks "Pay ₹1"
         ▼
┌─────────────────────────────────┐
│  Frontend Calls Backend          │
│  POST /api/payments/initiate    │
│  Sends: programId, studentId,   │
│         amount, email, fullName │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Backend Creates Razorpay Order │
│  Calls: Razorpay API via HTTPS  │
│  Returns: order_id, keyId       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend Opens Razorpay Popup  │
│  THIS IS WHERE PAYMENT HAPPENS! │
│  User Sees Multiple Options:    │
│  • Credit/Debit Cards           │
│  • UPI (Google Pay, PhonePe)    │
│  • Net Banking                  │
│  • Digital Wallets              │
└────────┬────────────────────────┘
         │
         │ User Selects Payment Method
         │ Enters Details (Card/UPI)
         │ Completes Payment
         ▼
┌─────────────────────────────────┐
│  Razorpay Processes Payment     │
│  Returns: payment_id, signature │
│  Calls: Frontend Handler        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend Calls Backend         │
│  POST /api/payments/verify      │
│  Sends: payment_id, order_id,   │
│         signature               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Backend Verifies Signature     │
│  Checks: Payment Status         │
│  Creates: Enrollment Record     │
│  Updates: Order Status to 'paid'│
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend Shows Success Message │
│  Redirects to Dashboard         │
│  Student Can Access Course      │
└─────────────────────────────────┘
```

---

## Why User Doesn't See Payment Popup

If Razorpay checkout isn't opening, it's one of these issues:

### Issue 1: Razorpay Script Not Loaded
**Problem:** `window.Razorpay` is undefined
**Solution:** Check browser console (F12) for script loading errors
```javascript
// Check in browser console:
window.Razorpay  // Should be a function, not undefined
```

### Issue 2: Wrong Razorpay Key
**Problem:** Invalid RAZORPAY_KEY_ID in backend
**Solution:** Verify in .env file
```
RAZORPAY_KEY_ID=rzp_test_Rg6RU7sG2Gb5tj  // Must start with rzp_test_ or rzp_live_
```

### Issue 3: Backend Not Creating Order
**Problem:** POST /api/payments/initiate fails
**Solution:** Check backend logs for errors

### Issue 4: Popup Blocker
**Problem:** Browser blocks Razorpay popup
**Solution:** Disable popup blocker, or open in incognito window

---

## How to Test Payment

### Step-by-Step Testing

#### 1. Clear Browser Cache
```
Ctrl + Shift + Delete
Select "Cookies and other site data"
Select "Cached images and files"
Click "Clear data"
```

#### 2. Start Servers
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 3. Open DevTools
- Go to http://localhost:5173
- Press F12 to open DevTools
- Go to "Console" tab
- Keep console open while testing

#### 4. Navigate to Program
- Login if needed
- Go to "Programs" or "Internships"
- Click on "Full Stack Web Development with MERN"
- Click "Enroll Now" button

#### 5. Watch Console Logs
You should see:
```
📋 Initiating payment...
✅ Order created: order_XXXXX
✅ Razorpay script loaded successfully
🔓 Opening Razorpay checkout...
```

#### 6. Razorpay Popup Should Open
- A popup window will appear
- You'll see payment options
- Select test card payment

#### 7. Enter Test Card Details
**For Success:**
```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Name: Any name
```

**For Failure:**
```
Card Number: 4000 0000 0000 0002
Expiry: 12/25
CVV: 123
```

#### 8. Complete Payment
- Click "Pay" button
- Check console for verification logs

Expected logs:
```
✅ Payment callback received
🔐 Verifying payment signature...
✅ Signature verified successfully
✅ Enrollment created
```

#### 9. Success!
- Green success message appears
- Redirected to dashboard after 2 seconds
- New enrollment visible in "My Enrollments"

---

## If Payment Modal Doesn't Open - Debugging

### Check 1: Browser Console
```javascript
// Open DevTools (F12)
// Go to Console tab
// Paste these commands:

window.Razorpay           // Should be a function
window.location.origin    // Should be http://localhost:5173
```

### Check 2: Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Pay ₹1" button
4. Check requests:
   - POST /api/payments/initiate (should return 200)
   - https://checkout.razorpay.com/... (script load)
```

### Check 3: Backend Logs
```
Look for these logs when you click "Pay":
✅ Order created successfully: order_XXXXX
📋 Creating Razorpay order with data: { ... }
```

If you see error logs, share them!

### Check 4: Browser Issues
```
1. Try incognito/private window (disables extensions)
2. Try different browser (Chrome, Firefox, Safari)
3. Check for popup blocker notifications
4. Disable VPN/proxy if using
```

---

## Real Payment Methods

In test mode, Razorpay offers these test options:

### ✅ Test Credit Card
```
4111 1111 1111 1111
12/25
123
```
**Result:** Payment succeeds

### ✅ Test Debit Card
```
5555 5555 5555 4444
12/25
123
```
**Result:** Payment succeeds

### ✅ Test UPI
```
UPI ID: success@razorpay
```
**Result:** Payment succeeds

### ✅ Test NetBanking
```
Select any bank
Click Pay
```
**Result:** Payment succeeds

### ❌ Failed Payment Card
```
4000 0000 0000 0002
12/25
123
```
**Result:** Payment fails (use to test error handling)

---

## Production Payment Methods

When you go live with real Razorpay keys, users will see:

### Credit/Debit Cards
- Visa, Mastercard, Amex
- All Indian and international cards

### UPI (Digital Wallets)
- Google Pay
- PhonePe
- Paytm
- WhatsApp Pay
- BHIM

### Net Banking
- ICICI Bank
- HDFC Bank
- Axis Bank
- SBI
- And 50+ other banks

### Digital Wallets
- Paytm
- Amazon Pay
- MobiKwik

### EMI Options
- 3, 6, 12 month plans

---

## Money Flow (When Live)

### When Student Pays ₹1
```
Student's Account (-₹1)
         ↓
Razorpay (intermediate)
         ↓
Your Business Account (+₹1, after settlement)

Typically: Settlement happens within 2-3 business days
```

### Money Settlement
- **Test Mode:** No real money involved
- **Live Mode:** 
  - Payment captured immediately when student pays
  - Money settled to your account within 2-3 business days
  - Settlement details visible in Razorpay Dashboard

### Fees
- **Test Mode:** No fees
- **Live Mode:** Razorpay charges ~2-3% (configurable based on plan)

---

## Complete Money Flow Example

### Student Enrollment Process

```
1. Student clicks "Enroll Now"
   └─ No money deducted yet

2. Student completes Razorpay payment
   └─ Student's bank temporarily holds ₹1

3. Backend verifies signature
   └─ Confirms payment authenticity

4. Enrollment created in database
   └─ Student access to course granted

5. Razorpay captures payment
   └─ ₹1 deducted from student's account

6. Razorpay settlement
   └─ ₹1 (minus 2-3% fee) credited to your account
   └─ Usually within 2-3 business days

7. Razorpay sends settlement report
   └─ You can download settlement file
   └─ Track all payments and fees
```

---

## Dashboard Tracking

### Razorpay Dashboard (https://dashboard.razorpay.com)
Shows:
- All orders created
- All payments received
- Success/failure status
- Refunds processed
- Settlement history
- Revenue reports

### Your Database
Shows:
- orders table - All payment orders
- student_internship table - Active enrollments
- payments table - Payment records
- Track which students paid and enrolled

---

## Testing Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Browser DevTools open (F12)
- [ ] Console shows no errors
- [ ] Razorpay script loads (check Network tab)
- [ ] window.Razorpay is defined (check Console)
- [ ] Click "Enroll Now" and see PaymentModal
- [ ] Click "Pay ₹1" and see processing message
- [ ] Razorpay popup opens (may take 2-3 seconds)
- [ ] Can select payment method in popup
- [ ] Can enter test card details
- [ ] Payment processes
- [ ] Success message shows
- [ ] Redirected to dashboard
- [ ] New enrollment in "My Enrollments"
- [ ] Check database: new order and enrollment records

---

## Troubleshooting Commands

```bash
# Check if Razorpay key is set
echo $RAZORPAY_KEY_ID

# View backend logs for payment requests
npm start  # Watch console output

# Check database for orders
psql -U winst_db_user -d winst_portal_db
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
SELECT * FROM student_internship ORDER BY enrollment_date DESC LIMIT 5;

# Clear test enrollments
node clear_nodejs_enrollments.js
```

---

## Common Issues & Fixes

### Issue: "Payment initialization failed"
**Check:**
1. Backend is running
2. RAZORPAY_KEY_ID is valid
3. Network request to /payments/initiate succeeds
4. Check backend logs

### Issue: Razorpay popup doesn't appear
**Check:**
1. window.Razorpay is defined
2. Order creation succeeded
3. No popup blocker
4. Try incognito window
5. Try different browser

### Issue: Payment succeeds but no enrollment created
**Check:**
1. Signature verification working
2. Database connection working
3. Check backend logs for SQL errors
4. Verify student_internship table has proper schema

### Issue: "Signature verification failed"
**Check:**
1. RAZORPAY_KEY_SECRET is correct
2. Key has no extra spaces
3. Restart backend after .env change
4. Check that signature string format is correct

---

## Support Resources

**Razorpay Documentation:**
- https://razorpay.com/docs/
- Integration guide
- Test card list
- Settlement details

**Your Code:**
- `frontend/src/components/PaymentModal.jsx` - Payment UI
- `backend/controllers/paymentController.js` - Payment logic
- `backend/utils/paymentGateway.js` - Razorpay integration
- `backend/routes/payments.js` - API endpoints

---

**Status:** Ready to test ✅
**Mode:** Test (₹1 per enrollment, no real money)
**Next Step:** Follow testing checklist above
