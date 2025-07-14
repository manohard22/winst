import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Upload,
  Github,
  ExternalLink,
  FileText,
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Code,
  Globe,
  BookOpen,
  Award,
  PlayCircle,
  Download,
  Eye,
} from "lucide-react";

const ProjectSubmission = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("requirements");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveDemoUrl: "",
    documentationUrl: "",
    videoDemoUrl: "",
    technologiesUsed: "",
    challengesFaced: "",
    learningOutcomes: "",
  });

  // Mock data for demonstration
  const mockRequirements = [
    {
      id: "req_001",
      title: "E-commerce Website Project",
      description:
        "Build a fully functional e-commerce website with user authentication, product catalog, shopping cart, and payment integration.",
      type: "major_project",
      status: "active",
      dueDate: "2025-02-15T23:59:59Z",
      maxScore: 100,
      requirements: [
        "User registration and authentication system",
        "Product catalog with search and filtering",
        "Shopping cart and checkout process",
        "Payment gateway integration",
        "Admin panel for product management",
        "Responsive design for mobile devices",
      ],
      technicalSpecs: [
        "Frontend: React.js or Next.js",
        "Backend: Node.js with Express or Python Django",
        "Database: MongoDB or PostgreSQL",
        "Payment: Stripe or Razorpay integration",
        "Deployment: Vercel, Netlify, or AWS",
      ],
      submissionFormat: [
        "Source code repository (GitHub/GitLab)",
        "Live demo URL",
        "Documentation (README.md)",
        "Video demonstration (5-10 minutes)",
        "Technical report (PDF)",
      ],
    },
    {
      id: "req_002",
      title: "Mini Project: Task Management App",
      description:
        "Create a simple task management application with CRUD operations and user interface.",
      type: "mini_project",
      status: "submitted",
      dueDate: "2025-01-20T23:59:59Z",
      maxScore: 50,
      requirements: [
        "Add, edit, delete tasks",
        "Mark tasks as complete/incomplete",
        "Filter tasks by status",
        "Local storage persistence",
        "Clean and intuitive UI",
      ],
      technicalSpecs: [
        "Frontend: HTML, CSS, JavaScript or React",
        "Storage: Local Storage or IndexedDB",
        "Styling: CSS3 or Tailwind CSS",
      ],
      submissionFormat: [
        "Source code repository",
        "Live demo URL",
        "Basic documentation",
      ],
    },
    {
      id: "req_003",
      title: "API Integration Project",
      description:
        "Build a web application that integrates with third-party APIs and displays data in an interactive dashboard.",
      type: "mini_project",
      status: "active",
      dueDate: "2025-02-01T23:59:59Z",
      maxScore: 75,
      requirements: [
        "Integrate with at least 2 different APIs",
        "Create responsive dashboard layout",
        "Implement data visualization",
        "Add error handling for API failures",
        "Include loading states and animations",
      ],
      technicalSpecs: [
        "Frontend: React.js with hooks",
        "APIs: Weather, News, or Finance APIs",
        "Charts: Chart.js or D3.js",
        "HTTP Client: Axios or Fetch API",
      ],
      submissionFormat: [
        "GitHub repository with clean code",
        "Deployed application URL",
        "API documentation",
        "Demo video (3-5 minutes)",
      ],
    },
  ];

  const mockSubmissions = [
    {
      id: "sub_001",
      requirementId: "req_002",
      title: "TaskMaster - Personal Task Manager",
      description:
        "A modern task management application built with React and Tailwind CSS featuring drag-and-drop functionality, categories, and priority levels.",
      githubUrl: "https://github.com/student/taskmaster-app",
      liveDemoUrl: "https://taskmaster-demo.vercel.app",
      videoDemoUrl: "https://youtube.com/watch?v=demo123",
      technologiesUsed: "React, Tailwind CSS, Local Storage, React DnD",
      status: "reviewed",
      submittedAt: "2025-01-18T15:30:00Z",
      score: 45,
      feedback:
        "Excellent implementation with great user experience. The drag-and-drop functionality works smoothly and the UI is very intuitive.",
      reviewedAt: "2025-01-20T10:15:00Z",
    },
    {
      id: "sub_002",
      requirementId: "req_001",
      title: "ShopEasy - E-commerce Platform",
      description:
        "A comprehensive e-commerce solution with user authentication, product management, shopping cart, and payment integration using Stripe.",
      githubUrl: "https://github.com/student/shopeasy-platform",
      liveDemoUrl: "https://shopeasy-demo.vercel.app",
      videoDemoUrl: "https://youtube.com/watch?v=ecommerce-demo",
      technologiesUsed: "React, Node.js, MongoDB, Stripe, Tailwind CSS",
      status: "submitted",
      submittedAt: "2025-01-22T18:45:00Z",
      score: null,
      feedback: null,
      reviewedAt: null,
    },
  ];

  useEffect(() => {
    fetchRequirements();
    fetchSubmissions();
  }, [programId]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setRequirements(mockRequirements);
        if (mockRequirements.length > 0) {
          setSelectedRequirement(mockRequirements[0]);
        }
        setLoading(false);
      }, 800);

      // Uncomment this for real API integration
      // const response = await api.get(`/projects/requirements/${programId}`);
      // const reqs = response.data.data.requirements;
      // setRequirements(reqs);
      // if (reqs.length > 0) {
      //   setSelectedRequirement(reqs[0]);
      // }
    } catch (error) {
      console.error("Failed to fetch project requirements:", error);
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setSubmissions(mockSubmissions);
      }, 900);

      // Uncomment this for real API integration
      // const response = await api.get(`/projects/submissions/${programId}`);
      // setSubmissions(response.data.data.submissions || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequirement) return;

    setSubmitting(true);
    try {
      // Simulate API call
      const newSubmission = {
        id: `sub_${Date.now()}`,
        requirementId: selectedRequirement.id,
        ...formData,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        score: null,
        feedback: null,
      };

      setTimeout(() => {
        setSubmissions([newSubmission, ...submissions]);
        setFormData({
          title: "",
          description: "",
          githubUrl: "",
          liveDemoUrl: "",
          documentationUrl: "",
          videoDemoUrl: "",
          technologiesUsed: "",
          challengesFaced: "",
          learningOutcomes: "",
        });
        setSubmitting(false);
        setActiveTab("submissions");
        // Show success message in real implementation
        alert("Project submitted successfully!");
      }, 2000);

      // Uncomment this for real API integration
      // await api.post(`/projects/submit/${selectedRequirement.id}`, formData);
      // fetchSubmissions();
      // setFormData({ /* reset form */ });
    } catch (error) {
      console.error("Failed to submit project:", error);
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs_revision":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <CheckCircle className="h-4 w-4" />;
      case "needs_revision":
        return <AlertCircle className="h-4 w-4" />;
      case "active":
        return <PlayCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/my-enrollments"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Project Submissions
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Submit your projects and track your progress
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                {
                  id: "requirements",
                  name: "Project Requirements",
                  icon: BookOpen,
                },
                { id: "submit", name: "Submit Project", icon: Upload },
                { id: "submissions", name: "My Submissions", icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Requirements Tab */}
            {activeTab === "requirements" && (
              <div className="space-y-6">
                {requirements.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Requirements List */}
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Project Requirements
                      </h3>
                      <div className="space-y-3">
                        {requirements.map((requirement) => (
                          <div
                            key={requirement.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedRequirement?.id === requirement.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedRequirement(requirement)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {requirement.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {requirement.type
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                  requirement.status
                                )}`}
                              >
                                {getStatusIcon(requirement.status)}
                                <span className="ml-1">
                                  {requirement.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              </span>
                            </div>
                            <div className="mt-3 flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                Due: {formatDate(requirement.dueDate)}
                              </span>
                              {isOverdue(requirement.dueDate) && (
                                <span className="ml-2 text-red-600 font-medium">
                                  OVERDUE
                                </span>
                              )}
                              {!isOverdue(requirement.dueDate) &&
                                getDaysUntilDue(requirement.dueDate) <= 7 && (
                                  <span className="ml-2 text-orange-600 font-medium">
                                    {getDaysUntilDue(requirement.dueDate)} days
                                    left
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Requirement Details */}
                    <div className="lg:col-span-2">
                      {selectedRequirement ? (
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {selectedRequirement.title}
                                </h3>
                                <p className="text-gray-600 mt-2">
                                  {selectedRequirement.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Max Score
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                  {selectedRequirement.maxScore}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Requirements */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Requirements
                                </h4>
                                <ul className="space-y-2">
                                  {selectedRequirement.requirements.map(
                                    (req, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start space-x-2 text-sm"
                                      >
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{req}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              {/* Technical Specs */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <Code className="h-4 w-4 mr-2 text-purple-600" />
                                  Technical Specifications
                                </h4>
                                <ul className="space-y-2">
                                  {selectedRequirement.technicalSpecs.map(
                                    (spec, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start space-x-2 text-sm"
                                      >
                                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{spec}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Submission Format */}
                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Upload className="h-4 w-4 mr-2 text-orange-600" />
                                Submission Format
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedRequirement.submissionFormat.map(
                                  (format, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm"
                                    >
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span>{format}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Select a Project Requirement
                          </h3>
                          <p className="text-gray-500">
                            Choose a project from the list to view its details
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Project Requirements
                    </h3>
                    <p className="text-gray-500">
                      Project requirements will appear here when they are
                      assigned
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Tab */}
            {activeTab === "submit" && (
              <div className="space-y-6">
                {selectedRequirement ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Submitting for: {selectedRequirement.title}
                      </h3>
                      <p className="text-sm text-blue-700">
                        Due: {formatDate(selectedRequirement.dueDate)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Project Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="technologiesUsed"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Technologies Used *
                        </label>
                        <input
                          type="text"
                          id="technologiesUsed"
                          name="technologiesUsed"
                          value={formData.technologiesUsed}
                          onChange={handleInputChange}
                          placeholder="e.g., React, Node.js, MongoDB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Project Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your project, its features, and functionality..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="githubUrl"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          <Github className="inline h-4 w-4 mr-1" />
                          GitHub Repository URL *
                        </label>
                        <input
                          type="url"
                          id="githubUrl"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username/project"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="liveDemoUrl"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          <Globe className="inline h-4 w-4 mr-1" />
                          Live Demo URL
                        </label>
                        <input
                          type="url"
                          id="liveDemoUrl"
                          name="liveDemoUrl"
                          value={formData.liveDemoUrl}
                          onChange={handleInputChange}
                          placeholder="https://yourproject.vercel.app"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="videoDemoUrl"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          <Video className="inline h-4 w-4 mr-1" />
                          Video Demo URL
                        </label>
                        <input
                          type="url"
                          id="videoDemoUrl"
                          name="videoDemoUrl"
                          value={formData.videoDemoUrl}
                          onChange={handleInputChange}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="documentationUrl"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          <FileText className="inline h-4 w-4 mr-1" />
                          Documentation URL
                        </label>
                        <input
                          type="url"
                          id="documentationUrl"
                          name="documentationUrl"
                          value={formData.documentationUrl}
                          onChange={handleInputChange}
                          placeholder="Link to documentation or README"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="challengesFaced"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Challenges Faced
                      </label>
                      <textarea
                        id="challengesFaced"
                        name="challengesFaced"
                        rows={3}
                        value={formData.challengesFaced}
                        onChange={handleInputChange}
                        placeholder="Describe any challenges you encountered and how you solved them..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="learningOutcomes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Learning Outcomes
                      </label>
                      <textarea
                        id="learningOutcomes"
                        name="learningOutcomes"
                        rows={3}
                        value={formData.learningOutcomes}
                        onChange={handleInputChange}
                        placeholder="What did you learn from this project?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("requirements")}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Project
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a Project to Submit
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Choose a project requirement from the Requirements tab
                      first
                    </p>
                    <button
                      onClick={() => setActiveTab("requirements")}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Requirements
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === "submissions" && (
              <div className="space-y-6">
                {submissions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {submissions.map((submission) => {
                      const requirement = requirements.find(
                        (req) => req.id === submission.requirementId
                      );
                      return (
                        <div
                          key={submission.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {submission.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                For: {requirement?.title || "Unknown Project"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                  submission.status
                                )}`}
                              >
                                {getStatusIcon(submission.status)}
                                <span className="ml-1">
                                  {submission.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              </span>
                              {submission.score !== null && (
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">
                                    Score
                                  </div>
                                  <div className="text-xl font-bold text-green-600">
                                    {submission.score}/{requirement?.maxScore}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {submission.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-600">
                                Technologies:
                              </span>
                              <p className="font-medium">
                                {submission.technologiesUsed}
                              </p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Submitted:</span>
                              <p className="font-medium">
                                {formatDate(submission.submittedAt)}
                              </p>
                            </div>
                            {submission.reviewedAt && (
                              <div className="text-sm">
                                <span className="text-gray-600">Reviewed:</span>
                                <p className="font-medium">
                                  {formatDate(submission.reviewedAt)}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {submission.githubUrl && (
                              <a
                                href={submission.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                              >
                                <Github className="h-4 w-4 mr-1" />
                                Code
                              </a>
                            )}
                            {submission.liveDemoUrl && (
                              <a
                                href={submission.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Globe className="h-4 w-4 mr-1" />
                                Live Demo
                              </a>
                            )}
                            {submission.videoDemoUrl && (
                              <a
                                href={submission.videoDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Video
                              </a>
                            )}
                          </div>

                          {submission.feedback && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h4 className="font-semibold text-yellow-900 mb-2">
                                Instructor Feedback
                              </h4>
                              <p className="text-yellow-800">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Submissions Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Your project submissions will appear here after you submit
                      them
                    </p>
                    <button
                      onClick={() => setActiveTab("submit")}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Your First Project
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
