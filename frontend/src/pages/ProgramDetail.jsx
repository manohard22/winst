import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Clock, Users, Award, CheckCircle, ArrowLeft } from 'lucide-react'

const ProgramDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchProgram()
    checkEnrollment()
  }, [id])

  const fetchProgram = async () => {
    try {
      const response = await api.get(`/programs/${id}`)
      setProgram(response.data.data.program)
    } catch (error) {
      console.error('Failed to fetch program:', error)
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

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await api.post('/enrollments', { programId: id })
      setIsEnrolled(true)
      alert('Successfully enrolled in the program!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Program not found</h2>
        <button onClick={() => navigate('/programs')} className="mt-4 btn-primary">
          Back to Programs
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/programs')}
        className="flex items-center text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Programs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <img
              src={program.imageUrl || '/placeholder-course.jpg'}
              alt={program.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{program.description}</p>
          </div>

          {/* Technologies */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Technologies You'll Learn</h2>
            <div className="flex flex-wrap gap-2">
              {program.technologies?.map((tech) => (
                <div key={tech.id} className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                  {tech.iconUrl && (
                    <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 mr-2" />
                  )}
                  <span className="text-blue-800 font-medium">{tech.name}</span>
                  {tech.isPrimary && (
                    <span className="ml-2 px-1 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {program.requirements && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{program.requirements}</p>
              </div>
            </div>
          )}

          {/* Learning Outcomes */}
          {program.learningOutcomes && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What You'll Learn</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">{program.learningOutcomes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary-600">₹{program.finalPrice}</div>
              {program.discountPercentage > 0 && (
                <div className="text-sm text-gray-500">
                  <span className="line-through">₹{program.price}</span>
                  <span className="ml-2 text-green-600 font-medium">
                    {program.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {isEnrolled ? (
              <div className="text-center">
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Already Enrolled
                </div>
                <button
                  onClick={() => navigate('/enrollments')}
                  className="w-full btn-secondary"
                >
                  View My Enrollments
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration
                </div>
                <span className="font-medium">{program.durationWeeks} weeks</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Enrolled
                </div>
                <span className="font-medium">
                  {program.currentParticipants}/{program.maxParticipants}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  Certificate
                </div>
                <span className="font-medium">
                  {program.certificateProvided ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Difficulty</span>
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
            </div>
          </div>

          {/* Features */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
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
                  <span className="text-sm">Remote Friendly</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramDetail
