import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const Assessment = () => {
  const { programId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [attemptId, setAttemptId] = useState(null)

  useEffect(() => {
    startAssessment()
  }, [programId])

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmit()
    }
  }, [timeLeft])

  const startAssessment = async () => {
    try {
      // Start assessment attempt
      const startResponse = await api.post(`/assessments/start/${programId}`)
      setAttemptId(startResponse.data.data.attemptId)

      // Get questions
      const questionsResponse = await api.get(`/assessments/program/${programId}`)
      setQuestions(questionsResponse.data.data.questions)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start assessment')
      navigate('/enrollments')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    setSubmitting(true)
    
    try {
      const submissionData = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))

      const response = await api.post(`/assessments/submit/${attemptId}`, {
        answers: submissionData
      })

      const result = response.data.data
      
      toast.success(`Assessment completed! Score: ${result.scorePercentage}%`)
      navigate('/enrollments')
    } catch (error) {
      toast.error('Failed to submit assessment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/enrollments')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Enrollments
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Program Assessment</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-orange-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {questions[currentQuestion].questionText}
              </h2>
              
              {questions[currentQuestion].questionType === 'multiple_choice' && (
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question_${questions[currentQuestion].id}`}
                        value={option}
                        checked={answers[questions[currentQuestion].id] === option}
                        onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {questions[currentQuestion].questionType === 'short_answer' && (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Enter your answer..."
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Question Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[questions[index]?.id]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assessment
