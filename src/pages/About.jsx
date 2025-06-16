import React from "react";
import { Users, Target, Award, Globe } from "lucide-react";

const About = () => {
  const stats = [
    { number: "2500+", label: "Students Trained" },
    { number: "150+", label: "Partner Companies" },
    { number: "95%", label: "Placement Rate" },
    { number: "50+", label: "Expert Mentors" },
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-lucro-blue" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from curriculum design to student support.",
    },
    {
      icon: <Users className="h-8 w-8 text-lucro-blue" />,
      title: "Community",
      description:
        "Building a strong community of learners, mentors, and industry professionals.",
    },
    {
      icon: <Award className="h-8 w-8 text-lucro-blue" />,
      title: "Innovation",
      description:
        "Constantly innovating our teaching methods and staying ahead of industry trends.",
    },
    {
      icon: <Globe className="h-8 w-8 text-lucro-blue" />,
      title: "Impact",
      description:
        "Creating positive impact in students' lives and contributing to the tech ecosystem.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Lucro</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We are dedicated to bridging the gap between academic learning and
            industry requirements through comprehensive internship programs and
            professional development.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Lucro, we believe that every student deserves the opportunity
                to launch a successful career in technology. Our mission is to
                provide high-quality, practical education that prepares students
                for the real world.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We combine theoretical knowledge with hands-on experience,
                ensuring our students are job-ready from day one. Our
                comprehensive programs cover the latest technologies and
                industry best practices.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-lucro-blue rounded-full"></div>
                  <span className="text-gray-700">
                    Industry-relevant curriculum
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-lucro-blue rounded-full"></div>
                  <span className="text-gray-700">
                    Expert mentorship and guidance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-lucro-blue rounded-full"></div>
                  <span className="text-gray-700">
                    Real-world project experience
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-lucro-blue rounded-full"></div>
                  <span className="text-gray-700">
                    Career placement support
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-lucro-light-blue rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-lucro-blue mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-lucro-light-gray">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the experience
              we provide to our students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals who are passionate about
              student success and industry innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-24 h-24 bg-lucro-light-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-lucro-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rajesh Kumar
              </h3>
              <p className="text-lucro-blue font-medium mb-3">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                15+ years in tech industry with experience at Google and
                Microsoft. Passionate about education and student development.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-lucro-light-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-lucro-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Priya Sharma
              </h3>
              <p className="text-lucro-blue font-medium mb-3">
                Head of Programs
              </p>
              <p className="text-gray-600 text-sm">
                Former Amazon engineer with expertise in curriculum development
                and student mentorship programs.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-lucro-light-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-lucro-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Amit Patel
              </h3>
              <p className="text-lucro-blue font-medium mb-3">CTO</p>
              <p className="text-gray-600 text-sm">
                Technology leader with 12+ years experience in building scalable
                platforms and educational technology solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
