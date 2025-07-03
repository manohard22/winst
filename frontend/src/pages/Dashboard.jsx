import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { BookOpen, GraduationCap, CheckSquare, Award } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    enrollments: 0,
    completedTasks: 0,
    certificates: 0,
    totalPrograms: 0
  })
  const [recentEnrollments, setRecentEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, programsRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/programs')
      ])

      const enrollments = enrollmentsRes.data.data.enrollments
      const programs = programsRes.data.data.programs

      setStats({
        enrollments: enrollments.length,
        completedTasks: 0, // Will be calculated from tasks
        certificates: enrollments.filter(e => e.certificateIssued).length,
        totalPrograms: programs.length
      })

      setRecentEnrollments(enrollments.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Active Enrollments',
      value: stats.enrollments,
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    {
      title: 'Available Programs',
      value: stats.totalPrograms,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'bg-yellow-500'
    },
    {
      title: 'Certificates Earned',
      value: stats.certificates,
      icon: Award,
      color: 'bg-purple-500'
    }
  ]

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
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your internships</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enrollments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Enrollments</h2>
          <Link to="/enrollments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {recentEnrollments.length > 0 ? (
          <div className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={enrollment.imageUrl || '/placeholder-course.jpg'}
                    alt={enrollment.programTitle}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{enrollment.programTitle}</h3>
                    <p className="text-sm text-gray-600">
                      Enrolled on {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    enrollment.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : enrollment.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enrollment.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {enrollment.progressPercentage}% Complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/programs" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
              <span className="font-medium">Browse Programs</span>
            </Link>
            <Link to="/profile" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CheckSquare className="h-5 w-5 text-primary-600 mr-3" />
              <span className="font-medium">Update Profile</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No upcoming deadlines</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
