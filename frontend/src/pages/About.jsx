import React from "react";
import {
  Target,
  Users,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To bridge the skills gap between academic education and industry requirements by providing practical, hands-on learning experiences that prepare students for successful careers.",
    },
    {
      icon: Users,
      title: "Our Community",
      description:
        "A vibrant ecosystem of 2,500+ learners, 50+ industry mentors, and 100+ partner companies working together to create meaningful career opportunities.",
    },
    {
      icon: Award,
      title: "Our Standards",
      description:
        "We maintain rigorous quality standards in our curriculum design, mentor selection, and project assignments to ensure every student receives world-class education.",
    },
    {
      icon: Globe,
      title: "Our Impact",
      description:
        "Empowering students across India with industry-relevant skills, helping them secure better job opportunities and build successful careers in technology.",
    },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      description:
        "Former Tech Lead at Microsoft with 12+ years of experience in software development and team management.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Curriculum",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
      description:
        "Ex-Google engineer and education specialist with expertise in designing industry-aligned learning programs.",
    },
    {
      name: "Arjun Patel",
      role: "Head of Partnerships",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      description:
        "Former startup founder with extensive network in the tech industry, connecting students with opportunities.",
    },
  ];

  const principles = [
    {
      icon: Heart,
      title: "Student-First Approach",
      description:
        "Every decision we make prioritizes student success and learning outcomes.",
    },
    {
      icon: Lightbulb,
      title: "Innovation in Learning",
      description:
        "We continuously evolve our teaching methods to match industry trends.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Rigorous standards ensure consistent, high-quality educational experiences.",
    },
    {
      icon: Zap,
      title: "Practical Focus",
      description:
        "Real-world projects and hands-on learning take precedence over theory.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Winst
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 2021 in Hyderabad, Winst is dedicated to transforming how
            students prepare for their careers. We believe that practical
            experience, combined with expert mentorship, is the key to
            professional success.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                Winst was born from a simple observation: despite having strong
                academic backgrounds, many students struggled to find meaningful
                employment because they lacked practical, industry-relevant
                skills.
              </p>
              <p className="text-gray-600 mb-4">
                Our founders, having worked at top tech companies like Microsoft
                and Google, recognized the gap between what students learn in
                college and what employers actually need. They decided to create
                a platform that would bridge this gap through practical,
                project-based learning.
              </p>
              <p className="text-gray-600">
                Today, Winst has helped over 2,500 students gain practical
                skills and secure better job opportunities. Our success is
                measured not just in numbers, but in the career transformations
                of our students.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary-600 mb-2">
                  3+
                </div>
                <div className="text-gray-700 mb-6">Years of Impact</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">
                      94%
                    </div>
                    <div className="text-sm text-gray-600">Placement Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">
                      4.8/5
                    </div>
                    <div className="text-sm text-gray-600">Student Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600">
              The core values that guide our mission and shape our approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principles Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Principles
            </h2>
            <p className="text-xl text-gray-600">
              The fundamental beliefs that shape how we operate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                2,500+
              </div>
              <div className="text-gray-600">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Industry Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">94%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            "We measure our success by the career transformations of our
            students. Every placement, every skill gained, and every confidence
            boost represents our commitment to excellence in education."
          </p>
          <div className="mt-6">
            <div className="font-semibold text-gray-900">- The Winst Team</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
