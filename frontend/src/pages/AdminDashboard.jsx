import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plus, Users, Briefcase, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react'
import api from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalInternships: 0,
    totalApplications: 0,
    totalStudents: 0,
    totalRevenue: 0
  })
  const [internships, setInternships] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    stipend: '',
    duration: '',
    applicationFee: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [internshipsRes, applicationsRes] = await Promise.all([
        api.get('/internships'),
        api.get('/applications')
      ])
      
      const internshipsData = internshipsRes.data
      const applicationsData = applicationsRes.data
      
      setInternships(internshipsData)
      setApplications(applicationsData)
      
      setStats({
        totalInternships: internshipsData.length,
        totalApplications: applicationsData.length,
        totalStudents: new Set(applicationsData.map(app => app.user_id)).size,
        totalRevenue: applicationsData.reduce((sum, app) => sum + (app.payment?.amount || 0), 0)
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInternship = async (e) => {
    e.preventDefault()
    try {
      await api.post('/internships', {
        ...newInternship,
        stipend: parseInt(newInternship.stipend),
        application_fee: parseInt(newInternship.applicationFee)
      })
      
      toast.success('Internship created successfully!')
      setShowCreateModal(false)
      setNewInternship({
        title: '',
        company: '',
        description: '',
        location: '',
        stipend: '',
        duration: '',
        applicationFee: ''
      })
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to create internship')
    }
  }

  const handleDeleteInternship = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await api.delete(`/internships/${id}`)
        toast.success('Internship deleted successfully!')
        fetchDashboardData()
      } catch (error) {
        toast.error('Failed to delete internship')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage internships and track applications</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Internship
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <Briefcase className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalInternships}</div>
            <div className="text-gray-600">Total Internships</div>
          </Card>
          
          <Card className="text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
            <div className="text-gray-600">Applications</div>
          </Card>
          
          <Card className="text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
            <div className="text-gray-600">Students</div>
          </Card>
          
          <Card className="text-center">
            <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-gray-600">Revenue</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Internships */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Internships</h2>
            <div className="space-y-4">
              {internships.slice(0, 5).map((internship) => (
                <div key={internship.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{internship.title}</h3>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                    <p className="text-sm text-gray-500">₹{internship.stipend.toLocaleString()}/month</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteInternship(internship.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Applications */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{application.user?.name}</h3>
                    <p className="text-sm text-gray-600">{application.internship?.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(application.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Create Internship Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Internship</h2>
              <form onSubmit={handleCreateInternship} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newInternship.title}
                    onChange={(e) => setNewInternship({...newInternship, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({...newInternship, company: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="input-field"
                    value={newInternship.description}
                    onChange={(e) => setNewInternship({...newInternship, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={newInternship.location}
                      onChange={(e) => setNewInternship({...newInternship, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g., 3 months"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (₹)</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={newInternship.stipend}
                      onChange={(e) => setNewInternship({...newInternship, stipend: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee (₹)</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={newInternship.applicationFee}
                      onChange={(e) => setNewInternship({...newInternship, applicationFee: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Internship
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
