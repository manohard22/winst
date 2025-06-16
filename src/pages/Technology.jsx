import React from "react";
import {
  Code,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Shield,
  Cpu,
  Zap,
} from "lucide-react";

const Technology = () => {
  const technologies = [
    {
      category: "Frontend Development",
      icon: <Code className="h-12 w-12 text-lucro-blue" />,
      description:
        "Modern frontend frameworks and libraries for building responsive user interfaces",
      tools: [
        {
          name: "React.js",
          level: "Advanced",
          description: "Component-based UI library",
        },
        {
          name: "Vue.js",
          level: "Intermediate",
          description: "Progressive JavaScript framework",
        },
        {
          name: "Angular",
          level: "Advanced",
          description: "Full-featured frontend framework",
        },
        {
          name: "TypeScript",
          level: "Advanced",
          description: "Typed superset of JavaScript",
        },
        {
          name: "Tailwind CSS",
          level: "Advanced",
          description: "Utility-first CSS framework",
        },
        {
          name: "Next.js",
          level: "Intermediate",
          description: "React production framework",
        },
      ],
    },
    {
      category: "Backend Development",
      icon: <Database className="h-12 w-12 text-lucro-blue" />,
      description:
        "Server-side technologies for building scalable and secure applications",
      tools: [
        {
          name: "Node.js",
          level: "Advanced",
          description: "JavaScript runtime environment",
        },
        {
          name: "Express.js",
          level: "Advanced",
          description: "Fast web framework for Node.js",
        },
        {
          name: "Python",
          level: "Advanced",
          description: "Versatile programming language",
        },
        {
          name: "Django",
          level: "Intermediate",
          description: "High-level Python web framework",
        },
        {
          name: "Java Spring",
          level: "Intermediate",
          description: "Enterprise Java framework",
        },
        {
          name: "GraphQL",
          level: "Intermediate",
          description: "Query language for APIs",
        },
      ],
    },
    {
      category: "Database Technologies",
      icon: <Cpu className="h-12 w-12 text-lucro-blue" />,
      description: "Modern database solutions for data storage and management",
      tools: [
        {
          name: "MongoDB",
          level: "Advanced",
          description: "NoSQL document database",
        },
        {
          name: "PostgreSQL",
          level: "Advanced",
          description: "Advanced relational database",
        },
        {
          name: "MySQL",
          level: "Advanced",
          description: "Popular relational database",
        },
        {
          name: "Redis",
          level: "Intermediate",
          description: "In-memory data structure store",
        },
        {
          name: "Firebase",
          level: "Intermediate",
          description: "Google's mobile platform",
        },
        {
          name: "Elasticsearch",
          level: "Beginner",
          description: "Search and analytics engine",
        },
      ],
    },
    {
      category: "Cloud & DevOps",
      icon: <Cloud className="h-12 w-12 text-lucro-blue" />,
      description:
        "Cloud platforms and DevOps tools for deployment and scaling",
      tools: [
        {
          name: "AWS",
          level: "Advanced",
          description: "Amazon Web Services cloud platform",
        },
        {
          name: "Azure",
          level: "Intermediate",
          description: "Microsoft cloud platform",
        },
        {
          name: "Docker",
          level: "Advanced",
          description: "Containerization platform",
        },
        {
          name: "Kubernetes",
          level: "Intermediate",
          description: "Container orchestration",
        },
        {
          name: "Jenkins",
          level: "Intermediate",
          description: "Automation server",
        },
        {
          name: "Terraform",
          level: "Beginner",
          description: "Infrastructure as code",
        },
      ],
    },
    {
      category: "Mobile Development",
      icon: <Smartphone className="h-12 w-12 text-lucro-blue" />,
      description:
        "Cross-platform and native mobile app development technologies",
      tools: [
        {
          name: "React Native",
          level: "Advanced",
          description: "Cross-platform mobile framework",
        },
        {
          name: "Flutter",
          level: "Intermediate",
          description: "Google's UI toolkit",
        },
        {
          name: "Swift",
          level: "Intermediate",
          description: "iOS development language",
        },
        {
          name: "Kotlin",
          level: "Intermediate",
          description: "Android development language",
        },
        {
          name: "Ionic",
          level: "Beginner",
          description: "Hybrid mobile app framework",
        },
        {
          name: "Xamarin",
          level: "Beginner",
          description: "Microsoft mobile platform",
        },
      ],
    },
    {
      category: "Data Science & AI",
      icon: <Zap className="h-12 w-12 text-lucro-blue" />,
      description: "Machine learning and data analysis tools and frameworks",
      tools: [
        {
          name: "Python",
          level: "Advanced",
          description: "Primary language for data science",
        },
        {
          name: "TensorFlow",
          level: "Intermediate",
          description: "Machine learning framework",
        },
        {
          name: "PyTorch",
          level: "Intermediate",
          description: "Deep learning framework",
        },
        {
          name: "Pandas",
          level: "Advanced",
          description: "Data manipulation library",
        },
        {
          name: "Scikit-learn",
          level: "Advanced",
          description: "Machine learning library",
        },
        {
          name: "Jupyter",
          level: "Advanced",
          description: "Interactive computing environment",
        },
      ],
    },
  ];

  const stats = [
    { number: "50+", label: "Technologies Covered" },
    { number: "100+", label: "Industry Projects" },
    { number: "24/7", label: "Technical Support" },
    { number: "95%", label: "Job Placement Rate" },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced":
        return "bg-lucro-green text-white";
      case "Intermediate":
        return "bg-lucro-orange text-white";
      case "Beginner":
        return "bg-lucro-blue text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Technology Stack
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Master the latest technologies and frameworks used by top companies
            worldwide. Our comprehensive curriculum covers everything from
            frontend to backend, mobile to cloud.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-lucro-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
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
              Our Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn industry-standard technologies with hands-on projects and
              expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-6">
                  {tech.icon}
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {tech.category}
                    </h3>
                    <p className="text-gray-600 mt-1">{tech.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {tech.tools.map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {tool.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                              tool.level
                            )}`}
                          >
                            {tool.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our structured learning path to master technologies step by
              step.
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
                    Foundation
                  </h3>
                  <p className="text-gray-600">
                    Start with programming fundamentals, HTML, CSS, and
                    JavaScript basics.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Frontend Development
                  </h3>
                  <p className="text-gray-600">
                    Master React.js, state management, and modern frontend
                    tools.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Backend Development
                  </h3>
                  <p className="text-gray-600">
                    Learn server-side programming with Node.js, databases, and
                    APIs.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Full Stack Integration
                  </h3>
                  <p className="text-gray-600">
                    Combine frontend and backend to build complete applications.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-lucro-blue text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Deployment & DevOps
                  </h3>
                  <p className="text-gray-600">
                    Learn cloud deployment, CI/CD, and production best
                    practices.
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
            Ready to Master These Technologies?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our comprehensive internship programs and gain hands-on
            experience with industry-standard technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-lucro-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              Start Learning
            </a>
            <a
              href="/services"
              className="border-2 border-white text-white hover:bg-white hover:text-lucro-blue font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              View Programs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
