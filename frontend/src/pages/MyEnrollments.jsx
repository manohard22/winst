import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Calendar, Clock, Award, CheckSquare } from 'lucide-react'

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments')
      setEnrollments(response.data.data.enrollments)
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'enrolled': return 'bg-yellow-100 text-yellow-800'
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
        <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>
        <p className="text-gray-600">Track your progress across all enrolled programs</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={enrollment.imageUrl || '/placeholder-course.jpg'}
                    alt={enrollment.programTitle}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {enrollment.programTitle}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{enrollment.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Enrolled on {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {enrollment.durationWeeks} weeks
                </div>

                {enrollment.mentor && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Mentor:</span>
                    <span className="ml-1">
                      {enrollment.mentor.firstName} {enrollment.mentor.lastName}
                    </span>
                  </div>
                )}

                {enrollment.certificateIssued && (
                  <div className="flex items-center text-sm text-green-600">
                    <Award className="h-4 w-4 mr-2" />
                    Certificate earned!
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/tasks/${enrollment.programId}`}
                  className="flex-1 btn-primary text-center"
                >
                  <CheckSquare className="h-4 w-4 mr-2 inline" />
                  View Tasks
                </Link>
                <Link
                  to={`/programs/${enrollment.programId}`}
                  className="flex-1 btn-secondary text-center"
                >
                  View Program
                </Link>
              </div>

              {enrollment.feedback && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Feedback:</strong> {enrollment.feedback}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by enrolling in a program</p>
          <div className="mt-6">
            <Link to="/programs" className="btn-primary">
              Browse Programs
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyEnrollments
