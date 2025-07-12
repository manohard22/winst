import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Users, Gift, Copy, Mail, Calendar, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Referrals = () => {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newReferralEmail, setNewReferralEmail] = useState('')

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    try {
      const response = await api.get('/referrals/my-referrals')
      setReferrals(response.data.data.referrals)
    } catch (error) {
      console.error('Failed to fetch referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReferral = async (e) => {
    e.preventDefault()
    if (!newReferralEmail) return

    setGenerating(true)
    try {
      await api.post('/referrals/generate', { email: newReferralEmail })
      setNewReferralEmail('')
      fetchReferrals()
      toast.success('Referral code generated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate referral')
    } finally {
      setGenerating(false)
    }
  }

  const copyReferralCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Referral code copied to clipboard!')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refer Friends</h1>
        <p className="text-gray-600">Invite friends and both get ₹499 discount on internships!</p>
      </div>

      {/* Referral Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <Gift className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-blue-900">How Referrals Work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="font-semibold text-blue-900">Generate Code</h3>
            <p className="text-sm text-blue-700">Create a referral code for your friend</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="font-semibold text-blue-900">Friend Enrolls</h3>
            <p className="text-sm text-blue-700">They use your code and get ₹499 off</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="font-semibold text-blue-900">You Both Win</h3>
            <p className="text-sm text-blue-700">You get ₹499 credit for next purchase</p>
          </div>
        </div>
      </div>

      {/* Generate New Referral */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Referral</h2>
        <form onSubmit={generateReferral} className="flex gap-4">
          <input
            type="email"
            placeholder="Enter friend's email address"
            className="flex-1 input-field"
            value={newReferralEmail}
            onChange={(e) => setNewReferralEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={generating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Code'}
          </button>
        </form>
      </div>

      {/* Referral List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referrals</h2>
        
        {referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{referral.referredEmail}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {new Date(referral.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Discount: ₹{referral.discountAmount}
                      </div>
                      {referral.usedAt && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Used: {new Date(referral.usedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {referral.referralCode}
                    </code>
                    <button
                      onClick={() => copyReferralCode(referral.referralCode)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Copy referral code"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {referral.referredUser && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{referral.referredUser.firstName} {referral.referredUser.lastName}</strong> has joined using your referral!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No referrals yet</h3>
            <p className="mt-1 text-sm text-gray-500">Generate your first referral code above</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Referrals
