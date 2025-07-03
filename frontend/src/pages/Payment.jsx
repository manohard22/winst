import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Shield, CheckCircle } from 'lucide-react'
import api from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const Payment = () => {
  const { internshipId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchInternship()
  }, [internshipId])

  const fetchInternship = async () => {
    try {
      const response = await api.get(`/internships/${internshipId}`)
      setInternship(response.data)
    } catch (error) {
      console.error('Failed to fetch internship:', error)
      toast.error('Failed to load internship details')
      navigate('/internships')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)
    
    try {
      // Initiate payment
      const response = await api.post('/payment/initiate', {
        internship_id: internshipId,
        amount: internship.application_fee
      })
      
      const { order_id, amount, currency } = response.data
      
      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert to paise
        currency: currency,
        name: 'Lucro Internships',
        description: `Application fee for ${internship.title}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await api.post('/payment/callback', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internship_id: internshipId
            })
            
            toast.success('Payment successful! Application submitted.')
            navigate('/dashboard/student')
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#2563eb'
        }
      }
      
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error('Failed to initiate payment')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship not found</h2>
          <Button onClick={() => navigate('/internships')}>
            Back to Internships
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Application</h1>
          <p className="text-gray-600">Secure payment to submit your internship application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Internship Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Internship Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{internship.title}</h3>
                <p className="text-gray-600">{internship.company}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{internship.location}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{internship.duration}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Stipend:</span>
                  <span className="font-medium">₹{internship.stipend.toLocaleString()}/month</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{internship.description}</p>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center"><span className="text-gray-600">Application Fee:</span>
                <span className="font-medium">₹{internship.application_fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium">₹0</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-primary-600">₹{internship.application_fee}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Secure Payment</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• PCI DSS compliant</li>
                <li>• Powered by Razorpay</li>
              </ul>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : `Pay ₹${internship.application_fee}`}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Payment
