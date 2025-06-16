import React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const Careers = () => {
  const jobs = [
    {
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time Internship",
      salary: "₹15,000 - ₹25,000/month",
      description:
        "Join our frontend team to build amazing user experiences using React, TypeScript, and modern web technologies.",
      requirements: [
        "Knowledge of React.js and JavaScript",
        "Understanding of HTML5, CSS3, and responsive design",
        "Familiarity with Git version control",
        "Strong problem-solving skills",
      ],
      posted: "2 days ago",
    },
    {
      title: "Backend Developer Intern",
      department: "Engineering",
      location: "Remote",
      type: "Full-time Internship",
      salary: "₹18,000 - ₹28,000/month",
      description:
        "Work on scalable backend systems using Node.js, Express, and database technologies.",
      requirements: [
        "Experience with Node.js and Express.js",
        "Knowledge of databases (MongoDB, MySQL)",
        "Understanding of RESTful APIs",
        "Basic knowledge of cloud platforms",
      ],
      posted: "1 week ago",
    },
    {
      title: "Data Science Intern",
      department: "Analytics",
      location: "Hyderabad, India",
      type: "Full-time Internship",
      salary: "₹20,000 - ₹30,000/month",
      description:
        "Analyze data, build machine learning models, and derive insights to drive business decisions.",
      requirements: [
        "Proficiency in Python and R",
        "Knowledge of machine learning algorithms",
        "Experience with pandas, numpy, scikit-learn",
        "Statistical analysis skills",
      ],
      posted: "3 days ago",
    },
    {
      title: "Digital Marketing Intern",
      department: "Marketing",
      location: "Mumbai, India",
      type: "Part-time Internship",
      salary: "₹12,000 - ₹20,000/month",
      description:
        "Help create and execute digital marketing campaigns across various channels.",
      requirements: [
        "Understanding of digital marketing concepts",
        "Knowledge of social media platforms",
        "Basic knowledge of SEO and SEM",
        "Creative thinking and communication skills",
      ],
      posted: "5 days ago",
    },
    {
      title: "UI/UX Design Intern",
      department: "Design",
      location: "Pune, India",
      type: "Full-time Internship",
      salary: "₹15,000 - ₹22,000/month",
      description:
        "Design intuitive user interfaces and create exceptional user experiences for our products.",
      requirements: [
        "Proficiency in Figma or Adobe XD",
        "Understanding of design principles",
        "Knowledge of user research methods",
        "Portfolio showcasing design work",
      ],
      posted: "1 day ago",
    },
    {
      title: "DevOps Intern",
      department: "Engineering",
      location: "Chennai, India",
      type: "Full-time Internship",
      salary: "₹18,000 - ₹26,000/month",
      description:
        "Learn and implement DevOps practices, CI/CD pipelines, and cloud infrastructure management.",
      requirements: [
        "Basic knowledge of Linux systems",
        "Understanding of Docker and containerization",
        "Familiarity with AWS or Azure",
        "Interest in automation and scripting",
      ],
      posted: "4 days ago",
    },
  ];

  const benefits = [
    {
      icon: <GraduationCap className="h-8 w-8 text-lucro-blue" />,
      title: "Learning & Development",
      description:
        "Continuous learning opportunities with access to courses and certifications",
    },
    {
      icon: <Users className="h-8 w-8 text-lucro-blue" />,
      title: "Mentorship Program",
      description:
        "Get paired with experienced professionals for guidance and career development",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-lucro-blue" />,
      title: "Real Projects",
      description:
        "Work on actual projects that impact our business and gain practical experience",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-lucro-blue" />,
      title: "Competitive Stipend",
      description:
        "Receive competitive compensation for your contributions and hard work",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Start your career with us! We offer exciting internship
            opportunities across various domains with mentorship from industry
            experts.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Intern With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a supportive environment where you can learn, grow, and
              make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="section-padding bg-lucro-light-gray">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our current internship opportunities and find the perfect
              role to start your career.
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-sm text-gray-500">
                          Posted {job.posted}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{job.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Requirements:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:ml-6 mt-4 lg:mt-0">
                    <button className="btn-primary w-full lg:w-auto">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined application process is designed to identify the
              best candidates efficiently.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Submit Application
                  </h3>
                  <p className="text-gray-600">
                    Apply online with your resume and cover letter through our
                    portal.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Initial Screening
                  </h3>
                  <p className="text-gray-600">
                    Our HR team will review your application and contact
                    qualified candidates.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Technical Assessment
                  </h3>
                  <p className="text-gray-600">
                    Complete a technical assessment relevant to your chosen
                    field.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Final Interview
                  </h3>
                  <p className="text-gray-600">
                    Meet with our team leads and discuss your goals and
                    expectations.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-green text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Welcome Aboard!
                  </h3>
                  <p className="text-gray-600">
                    Join our team and start your exciting internship journey
                    with us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lucro-blue text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on these amazing opportunities. Apply today and take
            the first step towards your dream career!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-lucro-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors duration-200">
              Browse All Jobs
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-lucro-blue font-semibold py-3 px-8 rounded-md transition-colors duration-200">
              Contact HR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
