import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Star,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-lucro-blue" />,
      title: "Expert Mentorship",
      description: "Learn from industry professionals with years of experience",
    },
    {
      icon: <Award className="h-8 w-8 text-lucro-blue" />,
      title: "Certified Programs",
      description: "Get industry-recognized certificates upon completion",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-lucro-blue" />,
      title: "Practical Learning",
      description: "Work on real projects and build your portfolio",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-lucro-blue" />,
      title: "Career Growth",
      description: "Accelerate your career with hands-on experience",
    },
  ];

  const technologies = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "Angular",
    "Vue.js",
    "MongoDB",
    "MySQL",
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Developer",
      company: "TCS",
      content:
        "Lucro's internship program helped me land my dream job. The mentorship was exceptional!",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "Data Analyst",
      company: "Wipro",
      content:
        "The practical approach and real-world projects made all the difference in my learning journey.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      role: "Full Stack Developer",
      company: "Infosys",
      content:
        "Best investment in my career. The certificate from Lucro opened many doors for me.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Launch Your Tech Career with
                <span className="text-lucro-orange"> Lucro</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of students who have transformed their careers
                through our comprehensive internship programs. Get hands-on
                experience, expert mentorship, and industry-recognized
                certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-lucro-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors duration-200 text-center"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white hover:bg-white hover:text-lucro-blue font-semibold py-3 px-8 rounded-md transition-colors duration-200 text-center"
                >
                  Explore Programs
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Active Students</span>
                    <span className="text-2xl font-bold">2,500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Success Rate</span>
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Partner Companies</span>
                    <span className="text-2xl font-bold">150+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lucro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive internship programs designed to bridge
              the gap between academic learning and industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="section-padding bg-lucro-light-gray">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the most in-demand technologies and frameworks used by top
              companies worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-white text-lucro-blue px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our alumni who have successfully launched their careers
              after completing our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lucro-blue text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already transformed their
            careers. Start your internship today!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-lucro-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors duration-200"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
