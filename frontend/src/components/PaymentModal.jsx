import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * Payment Modal Component
 * Handles Razorpay payment flow for enrollment
 * 
 * Props:
 * - isOpen: boolean - Whether modal is visible
 * - onClose: function - Callback when modal closes
 * - program: object - Program details { id, title, price }
 * - student: object - Student details { id, email, fullName }
 * - onPaymentSuccess: function - Callback after successful payment
 */
const PaymentModal = ({ isOpen, onClose, program, student, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
      };
      document.body.appendChild(script);
    } else {
      console.log('✅ Razorpay already loaded');
    }
  }, []);

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus('processing');
      setErrorMessage('');

      // Step 1: Initiate payment - Create Razorpay order
      console.log('📋 Initiating payment...');
      const initiateResponse = await api.post('/payments/initiate', {
        programId: program.id,
        studentId: student.id,
        amount: program.price || 1, // Minimum ₹1 for testing
        email: student.email,
        fullName: student.fullName
      });

      if (!initiateResponse.data.success) {
        throw new Error(initiateResponse.data.message || 'Failed to create payment order');
      }

      const orderData = initiateResponse.data.data;
      setOrderId(orderData.orderId);

      console.log('✅ Order created:', orderData.orderId);

      // Razorpay payment options
      const options = {
        key: orderData.keyId, // Razorpay public key
        amount: orderData.amountInPaise, // Amount in paise
        currency: orderData.currency,
        name: 'Winst Internships',
        description: `Enrollment for ${program.title}`,
        order_id: orderData.orderId,
        
        prefill: {
          name: student.fullName,
          email: student.email,
          contact: student.phone || ''
        },

        theme: {
          color: '#3b82f6'
        },

        // Success callback
        handler: async function (response) {
          console.log('✅ Payment callback received:', response);
          
          try {
            setPaymentStatus('processing');
            
            // Step 2: Verify payment signature
            console.log('🔐 Verifying payment signature...');
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              programId: program.id,
              studentId: student.id
            });

            if (!verifyResponse.data.success) {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }

            console.log('✅ Payment verified and enrollment successful!');
            setPaymentStatus('success');
            
            toast.success('Payment successful! Enrollment completed.');

            // Call success callback
            if (onPaymentSuccess) {
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                enrollment: verifyResponse.data.data.enrollment
              });
            }

            // Redirect after 2 seconds
            setTimeout(() => {
              onClose();
              navigate('/student/dashboard');
            }, 2000);

          } catch (verifyError) {
            console.error('❌ Payment verification failed:', verifyError);
            setPaymentStatus('failed');
            setErrorMessage(verifyError.message || 'Payment verification failed');
            toast.error('Payment verification failed: ' + verifyError.message);
          }
        },

        // Failure callback
        modal: {
          ondismiss: function () {
            console.log('❌ Payment modal dismissed by user');
            setPaymentStatus('failed');
            setErrorMessage('Payment was cancelled');
            toast.error('Payment cancelled');
          }
        }
      };

      // Open Razorpay checkout
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded. Please refresh the page and try again.');
      }

      const rzp = new window.Razorpay(options);
      
      // Handle errors during checkout open
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        setPaymentStatus('failed');
        setErrorMessage(response.error.reason || 'Payment failed');
        
        // Call failure endpoint
        api.post('/payments/failure', {
          orderId: orderData.orderId,
          error: response.error.code,
          reason: response.error.reason
        }).catch(err => console.log('Could not log failure:', err));

        toast.error('Payment failed: ' + (response.error.reason || 'Unknown error'));
      });

      console.log('🔓 Opening Razorpay checkout...');
      rzp.open();

    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.message || 'Failed to initiate payment');
      toast.error('Payment error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (paymentStatus !== 'processing') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard size={28} />
            Enroll Now
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {!paymentStatus && (
            <>
              {/* Program Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{program?.title}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Enrollment Fee:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{program?.price || 1}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  One-time payment for lifetime access
                </p>
              </div>

              {/* Security Info */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg flex gap-3">
                <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                  <p className="text-xs text-blue-700">
                    Your payment is secure and encrypted
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay ₹{program?.price || 1}
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader size={40} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Processing payment...</p>
              <p className="text-sm text-gray-500">Please wait, do not close this window</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 text-center mb-4">
                You have successfully enrolled in {program?.title}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle size={48} className="text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 text-center mb-4">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
