import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Clock, Users, Award, CheckCircle, ArrowLeft, Star, Play, Download, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const ProgramDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchProgram()
    if (user) {
      checkEnrollment()
    }
  }, [id, user])

  const fetchProgram = async () => {
    try {
      const response = await api.get(`/programs/${id}`)
      setProgram(response.data.data.program)
    } catch (error) {
      console.error('Failed to fetch program:', error)
      toast.error('Failed to load program details')
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/enrollments')
      const enrollments = response.data.data.enrollments
      const enrolled = enrollments.some(e => e.programId === id)
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error('Failed to check enrollment:', error)
    }
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to enroll')
      navigate('/login')
      return
    }

    setEnrolling(true)
    
    try {
      // Create order first
      const orderResponse = await api.post('/payments/orders', { programId: id })
      const order = orderResponse.data.data.order

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: order.finalAmount * 100, // Convert to paise
        currency: 'INR',
        name: 'Lucro Internship Portal',
        description: `Enrollment for ${program.title}`,
        order_id: order.orderNumber,
        handler: async function (response) {
          try {
            // Verify payment and enroll
            await api.post('/enrollments', { 
              programId: id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
            
            setIsEnrolled(true)
            toast.success('Successfully enrolled! Welcome to the program!')
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setEnrolling(false)
          }
        }
      }
      
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error('Failed to initiate payment')
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Program not found</h2>
            <button onClick={() => navigate('/programs')} className="mt-4 btn-primary">
              Back to Programs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/programs')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700">
                <img
                  src={program.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      program.difficultyLevel === 'beginner' 
                        ? 'bg-green-500 text-white'
                        : program.difficultyLevel === 'intermediate'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {program.difficultyLevel?.toUpperCase()}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm ml-1">4.8 (124 reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
                  <p className="text-lg opacity-90">Transform your career in {program.durationWeeks} weeks</p>
                </div>
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all">
                  <Play className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>

            {/* Program Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Program</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{program.description}</p>
              
              {/* Detailed Program Content */}
              {program.title.toLowerCase().includes('full stack') && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Full Stack Development Tracks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">🔥 MERN Stack</h4>
                      <p className="text-sm text-gray-700">MongoDB + Express.js + React + Node.js</p>
                      <div className="text-xs text-blue-600 mt-2">Most Popular Choice</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">⚡ MEAN Stack</h4>
                      <p className="text-sm text-gray-700">MongoDB + Express.js + Angular + Node.js</p>
                      <div className="text-xs text-green-600 mt-2">Enterprise Ready</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">🎯 React + .NET</h4>
                      <p className="text-sm text-gray-700">React Frontend + .NET Core Backend</p>
                      <div className="text-xs text-purple-600 mt-2">Microsoft Stack</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">🔧 Vue + Laravel</h4>
                      <p className="text-sm text-gray-700">Vue.js Frontend + Laravel PHP Backend</p>
                      <div className="text-xs text-orange-600 mt-2">Rapid Development</div>
                    </div>
                  </div>
                </div>
              )}

              {program.title.toLowerCase().includes('frontend') && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 Frontend Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">⚛️ React Ecosystem</h4>
                      <p className="text-sm text-gray-700">React, Redux, Next.js, TypeScript</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">🟢 Vue.js Stack</h4>
                      <p className="text-sm text-gray-700">Vue 3, Vuex, Nuxt.js, Composition API</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">🅰️ Angular Framework</h4>
                      <p className="text-sm text-gray-700">Angular 15+, RxJS, NgRx, Material</p>
                    </div>
                  </div>
                </div>
              )}

              {program.title.toLowerCase().includes('backend') && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">⚙️ Backend Technologies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">🟢 Node.js Stack</h4>
                      <p className="text-sm text-gray-700">Express.js, MongoDB, PostgreSQL, Redis</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">🐍 Python Stack</h4>
                      <p className="text-sm text-gray-700">Django, Flask, FastAPI, PostgreSQL</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">☕ Java Stack</h4>
                      <p className="text-sm text-gray-700">Spring Boot, Hibernate, MySQL</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">🔷 .NET Stack</h4>
                      <p className="text-sm text-gray-700">.NET Core, Entity Framework, SQL Server</p>
                    </div>
                  </div>
                </div>
              )}

              {program.title.toLowerCase().includes('ui') && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 UI Design Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-pink-200">
                      <h4 className="font-semibold text-pink-900 mb-2">🎯 Web UI Design</h4>
                      <p className="text-sm text-gray-700">Responsive Design, CSS Grid, Flexbox</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">📱 Mobile UI Design</h4>
                      <p className="text-sm text-gray-700">iOS, Android, Cross-platform Design</p>
                    </div>
                  </div>
                </div>
              )}

              {program.title.toLowerCase().includes('data') && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Data Science Tracks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">🐍 Python for Data Science</h4>
                      <p className="text-sm text-gray-700">Pandas, NumPy, Matplotlib, Scikit-learn</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">📈 Business Analytics</h4>
                      <p className="text-sm text-gray-700">SQL, Excel, Tableau, Power BI</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Key Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{program.durationWeeks} Weeks</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{program.currentParticipants}+ Students</div>
                  <div className="text-sm text-gray-600">Enrolled</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Certificate</div>
                  <div className="text-sm text-gray-600">On Completion</div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies You'll Master</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {program.technologies?.map((tech) => (
                  <div key={tech.id} className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                    {tech.iconUrl && (
                      <img src={tech.iconUrl} alt={tech.name} className="w-12 h-12 mb-3" />
                    )}
                    <span className="font-medium text-gray-900 text-center">{tech.name}</span>
                    {tech.isPrimary && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full mt-1">
                        Core
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {program.requirements && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-gray-700">{program.requirements}</p>
                  </div>
                </div>
              )}

              {program.learningOutcomes && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Outcomes</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-700">{program.learningOutcomes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="mb-2">
                  <span className="text-3xl font-bold text-primary-600">₹2,000</span>
                </div>
                <div className="text-sm text-gray-600">One-time payment • Lifetime access</div>
                <div className="text-xs text-green-600 font-medium mt-1">🎯 Fixed price for all internships</div>
              </div>

              {isEnrolled ? (
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center text-green-600 mb-3">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="font-semibold">Already Enrolled</span>
                  </div>
                  <button
                    onClick={() => navigate('/enrollments')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handlePayment}
                    disabled={enrolling}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Add to Wishlist
                  </button>
                </div>
              )}

              {/* Payment Security */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Secure Payment</span>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  Powered by Razorpay • 256-bit SSL encryption
                </div>
              </div>

              {/* Program Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What's Included:</h4>
                <div className="space-y-2">
                  {program.mentorshipIncluded && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">1-on-1 Mentorship</span>
                    </div>
                  )}
                  {program.projectBased && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Hands-on Projects</span>
                    </div>
                  )}
                  {program.certificateProvided && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Certificate of Completion</span>
                    </div>
                  )}
                  {program.remoteAllowed && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">100% Remote Learning</span>
                    </div>
                  )}
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Lifetime Access</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">24/7 Community Support</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Job Placement Assistance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Program Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{program.durationWeeks} weeks</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Enrolled Students</span>
                  <span className="font-medium">
                    {program.currentParticipants}/{program.maxParticipants}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty Level</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    program.difficultyLevel === 'beginner' 
                      ? 'bg-green-100 text-green-800'
                      : program.difficultyLevel === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {program.difficultyLevel?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium">
                    {program.certificateProvided ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Format</span>
                  <span className="font-medium">
                    {program.remoteAllowed ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Brochure */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <h4 className="font-semibold text-primary-900 mb-2">Want to learn more?</h4>
              <p className="text-primary-700 text-sm mb-4">Download our detailed program brochure</p>
              <button className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramDetail
