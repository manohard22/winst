import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Smartphone,
  Database,
  TrendingUp,
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Code className="h-12 w-12 text-lucro-blue" />,
      title: "Web Development",
      description:
        "Master modern web technologies including React, Node.js, and full-stack development.",
      duration: "3-6 months",
      level: "Beginner to Advanced",
      technologies: ["React", "Node.js", "MongoDB", "Express.js"],
      price: "₹15,000",
    },
    {
      icon: <Smartphone className="h-12 w-12 text-lucro-blue" />,
      title: "Mobile Development",
      description:
        "Build native and cross-platform mobile applications for iOS and Android.",
      duration: "4-6 months",
      level: "Intermediate",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
      price: "₹18,000",
    },
    {
      icon: <Database className="h-12 w-12 text-lucro-blue" />,
      title: "Data Science",
      description:
        "Learn data analysis, machine learning, and AI with hands-on projects.",
      duration: "4-8 months",
      level: "Beginner to Advanced",
      technologies: ["Python", "R", "TensorFlow", "Pandas"],
      price: "₹20,000",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-lucro-blue" />,
      title: "Digital Marketing",
      description:
        "Master digital marketing strategies, SEO, social media, and analytics.",
      duration: "2-4 months",
      level: "Beginner",
      technologies: ["Google Analytics", "SEO Tools", "Social Media"],
      price: "₹12,000",
    },
    {
      icon: <Globe className="h-12 w-12 text-lucro-blue" />,
      title: "Cloud Computing",
      description:
        "Learn AWS, Azure, and Google Cloud platforms with practical implementations.",
      duration: "3-5 months",
      level: "Intermediate",
      technologies: ["AWS", "Azure", "Docker", "Kubernetes"],
      price: "₹16,000",
    },
    {
      icon: <Shield className="h-12 w-12 text-lucro-blue" />,
      title: "Cybersecurity",
      description:
        "Understand security principles, ethical hacking, and network security.",
      duration: "4-6 months",
      level: "Intermediate to Advanced",
      technologies: ["Kali Linux", "Wireshark", "Metasploit", "OWASP"],
      price: "₹22,000",
    },
  ];

  const features = [
    "Live project experience",
    "Industry expert mentors",
    "Flexible learning schedule",
    "Job placement assistance",
    "Certificate upon completion",
    "24/7 technical support",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose from our comprehensive range of internship programs designed
            to give you practical, industry-relevant skills.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">{service.icon}</div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-4 text-center">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {service.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Level:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {service.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-lg font-bold text-lucro-blue">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-lucro-light-blue text-lucro-blue px-2 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/register"
                  className="btn-primary w-full text-center inline-flex items-center justify-center"
                >
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-lucro-light-gray">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Included
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every internship program comes with comprehensive support and
              resources to ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg"
              >
                <CheckCircle className="h-6 w-6 text-lucro-green flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lucro-blue text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already started their journey
            with us. Choose your program and begin today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-lucro-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              Get Started Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-lucro-blue font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
