import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Carousel from '../components/Carousel'
import { Search, Briefcase, Users, Award, TrendingUp, Star, ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const Home = () => {
  const [featuredPrograms, setFeaturedPrograms] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedPrograms()
  }, [])

  const fetchFeaturedPrograms = async () => {
    try {
      const response = await api.get('/programs?limit=6')
      setFeaturedPrograms(response.data.data.programs || [])
    } catch (error) {
      console.error('Failed to fetch featured programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredPrograms.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredPrograms.length / 3)) % Math.ceil(featuredPrograms.length / 3))
  }

  const features = [
    {
      icon: Search,
      title: 'Industry-Focused Learning',
      description: 'Our internships are designed with real industry requirements, ensuring you learn skills that employers actually need in today\'s competitive market.'
    },
    {
      icon: Briefcase,
      title: 'Hands-On Experience',
      description: 'Work on live projects and build a portfolio that showcases your abilities. Every internship includes practical assignments that mirror real workplace scenarios.'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn directly from industry professionals who have years of experience. Get personalized guidance and career advice throughout your journey.'
    },
    {
      icon: Award,
      title: 'Recognized Certification',
      description: 'Earn certificates that are valued by top companies. Our completion certificates demonstrate your commitment to professional development.'
    }
  ]

  const stats = [
    { number: '2,500+', label: 'Students Trained' },
    { number: '50+', label: 'Live Internships' },
    { number: '100+', label: 'Partner Companies' },
    { number: '94%', label: 'Placement Success' }
  ]

  const testimonials = [
    {
      name: 'Arjun Mehta',
      role: 'Software Developer at TCS',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: 'Lucro\'s Full Stack internship gave me the confidence and skills I needed to land my first job. The practical approach made all the difference.'
    },
    {
      name: 'Kavya Reddy',
      role: 'UI/UX Designer at Flipkart',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      content: 'The UI/UX design internship at Lucro was incredibly comprehensive. I learned industry-standard tools and design thinking methodologies.'
    },
    {
      name: 'Rohit Sharma',
      role: 'Data Analyst at Accenture',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      content: 'The data science program helped me transition from a non-tech background to a successful career in analytics. Highly recommended!'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Your Career with 
                <span className="text-yellow-300"> Real-World Internships</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Bridge the gap between academic learning and industry requirements. Join Lucro's practical internship programs designed by industry experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/programs" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl">
                  Explore Internships
                </Link>
                <Link to="/signup" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-center">
                  Start Learning Today
                </Link>
              </div>
            </div>
            <div className="slide-up">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" 
                  alt="Students learning together" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">94%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Internship Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully crafted internship programs, each designed to provide industry-relevant skills and practical experience.
            </p>
          </div>

          {!loading && featuredPrograms.length > 0 && (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(featuredPrograms.length / 3) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPrograms.slice(slideIndex * 3, slideIndex * 3 + 3).map((program) => (
                          <div key={program.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
                              <img
                                src={program.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'}
                                alt={program.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  program.difficultyLevel === 'beginner' 
                                    ? 'bg-green-100 text-green-800'
                                    : program.difficultyLevel === 'intermediate'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
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

                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {program.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {program.description}
                              </p>

                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{program.durationWeeks} weeks</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-primary-600">₹{program.finalPrice}</span>
                                  {program.discountPercentage > 0 && (
                                    <span className="text-sm text-gray-500 line-through ml-2">₹{program.price}</span>
                                  )}
                                </div>
                              </div>

                              <Link
                                to={`/programs/${program.id}`}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {Math.ceil(featuredPrograms.length / 3) > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {Math.ceil(featuredPrograms.length / 3) > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(featuredPrograms.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/programs" 
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All Internships
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lucro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing high-quality, practical learning experiences that prepare you for real-world challenges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to kickstart your career transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Path</h3>
              <p className="text-gray-600">Select from our diverse range of internship programs based on your interests and career goals</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn & Practice</h3>
              <p className="text-gray-600">Engage with hands-on projects, receive mentorship, and build real-world skills through practical assignments</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Launch Your Career</h3>
              <p className="text-gray-600">Graduate with a strong portfolio, industry connections, and the confidence to excel in your chosen field</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from students who transformed their careers with Lucro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of students who have successfully launched their careers through Lucro's practical internship programs. 
            Your future starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Learning Today
            </Link>
            <Link to="/programs" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center">
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
