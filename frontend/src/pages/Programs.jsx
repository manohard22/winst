import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Clock, Users, Star, Filter } from 'lucide-react'

const Programs = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    category: ''
  })

  useEffect(() => {
    fetchPrograms()
  }, [filters])

  const fetchPrograms = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      
      const response = await api.get(`/programs?${params.toString()}`)
      setPrograms(response.data.data.programs)
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
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
        <h1 className="text-2xl font-bold text-gray-900">Internship Programs</h1>
        <p className="text-gray-600">Discover and enroll in our comprehensive internship programs</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search programs..."
              className="input-field"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div>
            <select
              className="input-field"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="card hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={program.imageUrl || '/placeholder-course.jpg'}
                alt={program.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(program.difficultyLevel)}`}>
                  {program.difficultyLevel?.toUpperCase()}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {program.durationWeeks} weeks
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{program.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {program.technologies?.slice(0, 3).map((tech) => (
                  <span key={tech.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tech.name}
                  </span>
                ))}
                {program.technologies?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{program.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {program.currentParticipants}/{program.maxParticipants} enrolled
                </div>
                <div className="text-right">
                  {program.discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">₹{program.price}</span>
                  )}
                  <span className="text-lg font-bold text-primary-600 ml-1">₹{program.finalPrice}</span>
                </div>
              </div>

              <Link
                to={`/programs/${program.id}`}
                className="w-full btn-primary text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  )
}

export default Programs
