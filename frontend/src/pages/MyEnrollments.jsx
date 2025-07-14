import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckSquare,
  Upload,
  ExternalLink,
  User,
} from "lucide-react";
import api from "../services/api";

const MyEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock enrollment data for demonstration
  const mockEnrollments = [
    {
      id: "enr_001",
      programId: "prog_001",
      programTitle: "Full Stack Web Development Bootcamp",
      imageUrl: "/api/placeholder/400/300",
      status: "in_progress",
      progressPercentage: 75,
      enrollmentDate: "2024-11-15T10:00:00Z",
      durationWeeks: 16,
      assessmentCompleted: true,
      assessmentScore: 87,
      projectSubmitted: false,
      certificateIssued: false,
      mentor: {
        firstName: "Raj",
        lastName: "Kumar",
      },
      feedback: "Great progress! Keep up the excellent work on your projects.",
    },
    {
      id: "enr_002",
      programId: "prog_002",
      programTitle: "React Native Mobile Development",
      imageUrl: "/api/placeholder/400/300",
      status: "completed",
      progressPercentage: 100,
      enrollmentDate: "2024-09-01T09:30:00Z",
      durationWeeks: 12,
      assessmentCompleted: true,
      assessmentScore: 92,
      projectSubmitted: true,
      certificateIssued: true,
      mentor: {
        firstName: "Priya",
        lastName: "Sharma",
      },
      feedback:
        "Excellent completion! Your mobile app project was outstanding.",
    },
    {
      id: "enr_003",
      programId: "prog_003",
      programTitle: "Data Science with Python",
      imageUrl: "/api/placeholder/400/300",
      status: "in_progress",
      progressPercentage: 45,
      enrollmentDate: "2024-12-01T11:15:00Z",
      durationWeeks: 20,
      assessmentCompleted: false,
      assessmentScore: null,
      projectSubmitted: false,
      certificateIssued: false,
      mentor: {
        firstName: "Dr. Amit",
        lastName: "Patel",
      },
      feedback: null,
    },
    {
      id: "enr_004",
      programId: "prog_004",
      programTitle: "Digital Marketing & SEO Specialist",
      imageUrl: "/api/placeholder/400/300",
      status: "completed",
      progressPercentage: 100,
      enrollmentDate: "2024-07-10T14:20:00Z",
      durationWeeks: 8,
      assessmentCompleted: true,
      assessmentScore: 89,
      projectSubmitted: true,
      certificateIssued: true,
      mentor: {
        firstName: "Neha",
        lastName: "Gupta",
      },
      feedback:
        "Fantastic understanding of SEO concepts and practical implementation.",
    },
    {
      id: "enr_005",
      programId: "prog_005",
      programTitle: "UI/UX Design Masterclass",
      imageUrl: "/api/placeholder/400/300",
      status: "enrolled",
      progressPercentage: 15,
      enrollmentDate: "2024-12-20T16:45:00Z",
      durationWeeks: 14,
      assessmentCompleted: false,
      assessmentScore: null,
      projectSubmitted: false,
      certificateIssued: false,
      mentor: {
        firstName: "Arjun",
        lastName: "Mehta",
      },
      feedback: null,
    },
    {
      id: "enr_006",
      programId: "prog_006",
      programTitle: "Cybersecurity Professional Course",
      imageUrl: "/api/placeholder/400/300",
      status: "in_progress",
      progressPercentage: 60,
      enrollmentDate: "2024-10-05T12:30:00Z",
      durationWeeks: 18,
      assessmentCompleted: true,
      assessmentScore: 94,
      projectSubmitted: false,
      certificateIssued: false,
      mentor: {
        firstName: "Col. Vikram",
        lastName: "Singh",
      },
      feedback:
        "Strong grasp of security fundamentals. Ready for advanced modules.",
    },
  ];

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setEnrollments(mockEnrollments);
        setLoading(false);
      }, 800);

      // Uncomment this for real API integration
      // const response = await api.get("/student/enrollments");
      // setEnrollments(response.data.data?.enrollments || []);
    } catch (error) {
      setError("Failed to fetch enrollments");
      console.error("Failed to fetch enrollments:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "enrolled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Enrollments
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Track your progress across all enrolled programs
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {enrollments.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Total
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {enrollments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Active
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {
                      enrollments.filter((e) => e.status === "in_progress")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Completed
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {enrollments.filter((e) => e.status === "completed").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Certificates
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {enrollments.filter((e) => e.certificateIssued).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <img
                      src={enrollment.imageUrl || "/placeholder-course.jpg"}
                      alt={enrollment.programTitle}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                        {enrollment.programTitle}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                          enrollment.status
                        )}`}
                      >
                        {enrollment.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {enrollment.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      Enrolled{" "}
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    Duration: {enrollment.durationWeeks} weeks
                  </div>

                  {enrollment.mentor && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {enrollment.mentor.firstName}{" "}
                        {enrollment.mentor.lastName}
                      </span>
                    </div>
                  )}

                  {enrollment.certificateIssued && (
                    <div className="flex items-center text-xs sm:text-sm text-green-600">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      Certificate earned!
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Assessment */}
                  {!enrollment.assessmentCompleted ? (
                    <Link
                      to={`/assessment/${enrollment.programId}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Take Assessment
                    </Link>
                  ) : (
                    <div className="w-full bg-green-50 text-green-800 font-medium py-2 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        Assessment: {enrollment.assessmentScore}%
                      </span>
                    </div>
                  )}

                  {/* Project Submission */}
                  {enrollment.assessmentCompleted &&
                  !enrollment.projectSubmitted ? (
                    <Link
                      to={`/project-submission/${enrollment.programId}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Project
                    </Link>
                  ) : enrollment.projectSubmitted ? (
                    <div className="w-full bg-yellow-50 text-yellow-800 font-medium py-2 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="truncate">Project Under Review</span>
                    </div>
                  ) : null}

                  {/* Other Actions */}
                  <div className="flex space-x-2 sm:space-x-3">
                    <Link
                      to={`/tasks/${enrollment.programId}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-xs sm:text-sm"
                    >
                      <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View </span>Tasks
                    </Link>
                    <Link
                      to={`/programs/${enrollment.programId}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-xs sm:text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View </span>Program
                    </Link>
                  </div>
                </div>

                {/* Feedback */}
                {enrollment.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Feedback:</strong> {enrollment.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // No Data State
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Enrollments Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                You haven't enrolled in any programs yet. Start your learning
                journey by exploring our comprehensive courses and internship
                programs.
              </p>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
                <Link
                  to="/programs"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Programs
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
