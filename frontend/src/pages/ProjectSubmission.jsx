import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft, Upload, Github, ExternalLink, FileText, Video } from 'lucide-react'
import toast from 'react-hot-toast'

const ProjectSubmission = () => {
  const { programId } = useParams()
  const navigate = useNavigate()
  const [requirements, setRequirements] = useState([])
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveDemoUrl: '',
    documentationUrl: '',
    videoDemoUrl: '',
    technologiesUsed: '',
    challengesFaced: '',
    learningOutcomes: ''
  })

  useEffect(() => {
    fetchRequirements()
  }, [programId])

  const fetchRequirements = async () => {
    try {
      const response = await api.get(`/projects/requirements/${programId}`)
      const reqs = response.data.data.requirements
      setRequirements(reqs)
      if (reqs.length > 0) {
        setSelectedRequirement(reqs[0])
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch project requirements')
      navigate('/enrollments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/projects/submit', {
        programId,
        projectRequirementId: selectedRequirement.id,
        ...formData
      })

      toast.success('Project submitted successfully!')
      navigate('/enrollments')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/enrollments')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Enrollments
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Requirements */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Requirements</h2>
              
              {selectedRequirement && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedRequirement.title}</h3>
                    <p className="text-gray-600 mt-2">{selectedRequirement.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <pre className="text-sm text-blue-800 whitespace-pre-wrap">{selectedRequirement.requirements}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deliverables:</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <pre className="text-sm text-green-800 whitespace-pre-wrap">{selectedRequirement.deliverables}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Evaluation Criteria:</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <pre className="text-sm text-yellow-800 whitespace-pre-wrap">{selectedRequirement.evaluationCriteria}</pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Estimated Duration: {selectedRequirement.estimatedDurationWeeks} weeks</span>
                    <span>Max Score: {selectedRequirement.maxScore} points</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Project</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  placeholder="Enter your project title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="input-field"
                  placeholder="Describe your project, its features, and functionality"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Github className="inline h-4 w-4 mr-1" />
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  required
                  className="input-field"
                  placeholder="https://github.com/username/repository"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ExternalLink className="inline h-4 w-4 mr-1" />
                  Live Demo URL
                </label>
                <input
                  type="url"
                  name="liveDemoUrl"
                  className="input-field"
                  placeholder="https://your-project-demo.netlify.app"
                  value={formData.liveDemoUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Documentation URL
                </label>
                <input
                  type="url"
                  name="documentationUrl"
                  className="input-field"
                  placeholder="Link to your project documentation"
                  value={formData.documentationUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Video className="inline h-4 w-4 mr-1" />
                  Video Demo URL
                </label>
                <input
                  type="url"
                  name="videoDemoUrl"
                  className="input-field"
                  placeholder="YouTube/Vimeo link to your project demo"
                  value={formData.videoDemoUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <textarea
                  name="technologiesUsed"
                  rows={3}
                  className="input-field"
                  placeholder="List the technologies, frameworks, and tools you used"
                  value={formData.technologiesUsed}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenges Faced
                </label>
                <textarea
                  name="challengesFaced"
                  rows={3}
                  className="input-field"
                  placeholder="Describe the main challenges you encountered and how you solved them"
                  value={formData.challengesFaced}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Outcomes
                </label>
                <textarea
                  name="learningOutcomes"
                  rows={3}
                  className="input-field"
                  placeholder="What did you learn from this project?"
                  value={formData.learningOutcomes}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSubmission
