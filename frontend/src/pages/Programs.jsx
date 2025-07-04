import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Clock, Users, Star, Filter, MapPin, Award, BookOpen, TrendingUp } from 'lucide-react'

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
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Internship Programs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and enroll in our comprehensive internship programs designed to accelerate your career
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search programs..."
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">All Difficulty Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">
                {programs.length} Programs Available
              </span>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Sort by Popular</span>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Program Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
                <img
                  src={program.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(program.difficultyLevel)}`}>
                    {program.difficultyLevel?.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium text-gray-700 ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {program.technologies?.slice(0, 3).map((tech) => (
                      <div key={tech.id} className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        {tech.iconUrl && (
                          <img src={tech.iconUrl} alt={tech.name} className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-xs font-medium text-gray-700">{tech.name}</span>
                      </div>
                    ))}
                    {program.technologies?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                        +{program.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Program Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{program.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{program.currentParticipants}/{program.maxParticipants}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Certificate</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Remote</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {program.mentorshipIncluded && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Mentorship
                      </span>
                    )}
                    {program.projectBased && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Projects
                      </span>
                    )}
                    {program.certificateProvided && (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing and CTA */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {program.discountPercentage > 0 ? (
                        <div>
                          <span className="text-lg font-bold text-primary-600">₹{program.finalPrice}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">₹{program.price}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                            {program.discountPercentage}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary-600">₹{program.finalPrice}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Starting from</div>
                      <div className="text-sm font-medium text-gray-700">₹{Math.round(program.finalPrice / program.durationWeeks)}/week</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/programs/${program.id}`}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
                    >
                      View Details & Enroll
                    </Link>
                    <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters to find more opportunities</p>
            <button 
              onClick={() => setFilters({ search: '', difficulty: '', category: '' })}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {programs.length > 0 && programs.length >= 9 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Load More Programs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Programs
