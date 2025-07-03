import React from 'react'
import { Target, Users, Award, Globe } from 'lucide-react'
import Card from '../components/Card'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To bridge the gap between talented students and innovative companies, creating meaningful internship opportunities that shape the future workforce.'
    },
    {
      icon: Users,
      title: 'Our Community',
      description: 'A thriving ecosystem of 10,000+ students, 200+ companies, and countless success stories that inspire us every day.'
    },
    {
      icon: Award,
      title: 'Our Standards',
      description: 'We maintain the highest standards in vetting opportunities, ensuring every internship provides real value and learning experiences.'
    },
    {
      icon: Globe,
      title: 'Our Reach',
      description: 'Connecting talent globally with opportunities across industries, from startups to Fortune 500 companies.'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Lucro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to revolutionize how students find and secure meaningful internship opportunities. 
            Since our founding, we've been dedicated to creating a platform that truly serves both students and employers.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, Lucro emerged from a simple observation: the internship application process 
                was broken. Students struggled to find quality opportunities, while companies couldn't connect 
                with the right talent.
              </p>
              <p className="text-gray-600 mb-4">
                We set out to change that by creating a platform that prioritizes quality over quantity, 
                transparency over confusion, and meaningful connections over mass applications.
              </p>
              <p className="text-gray-600">
                Today, we're proud to be the trusted bridge between ambitious students and forward-thinking 
                companies, facilitating thousands of successful internship placements.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary-600 mb-2">3+</div>
                <div className="text-gray-700 mb-6">Years of Excellence</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">4.9/5</div>
                    <div className="text-sm text-gray-600">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 mb-8">
            Meet the passionate individuals working to transform internship experiences
          </p>
          <div className="bg-primary-50 rounded-lg p-8">
            <p className="text-gray-700 italic">
              "We believe that every student deserves access to meaningful opportunities that can 
              shape their career trajectory. That's why we've built Lucro to be more than just a 
              platform – it's a community dedicated to student success."
            </p>
            <div className="mt-4">
              <div className="font-semibold text-gray-900">- The Lucro Team</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
