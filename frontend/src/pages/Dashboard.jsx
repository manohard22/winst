import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  BookOpen,
  GraduationCap,
  CheckSquare,
  Award,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Star,
  ArrowRight,
  Trophy,
  Users,
  FileText,
  Play,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrollments: 0,
    completedTasks: 0,
    certificates: 0,
    totalPrograms: 0,
    totalLearningHours: 0,
    completionRate: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockStats = {
    enrollments: 4,
    completedTasks: 12,
    certificates: 2,
    totalPrograms: 15,
    totalLearningHours: 156,
    completionRate: 78,
  };

  const mockRecentEnrollments = [
    {
      id: "enroll_001",
      programTitle: "Full Stack Web Development",
      imageUrl:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400",
      enrollmentDate: "2025-01-15T10:30:00Z",
      status: "in_progress",
      progressPercentage: 65,
      nextTask: "Build E-commerce Backend",
      difficulty: "Intermediate",
    },
    {
      id: "enroll_002",
      programTitle: "React Native Mobile Development",
      imageUrl:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
      enrollmentDate: "2025-01-10T14:20:00Z",
      status: "in_progress",
      progressPercentage: 45,
      nextTask: "Implement Navigation",
      difficulty: "Advanced",
    },
    {
      id: "enroll_003",
      programTitle: "UI/UX Design Fundamentals",
      imageUrl:
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400",
      enrollmentDate: "2025-01-05T09:15:00Z",
      status: "completed",
      progressPercentage: 100,
      nextTask: "Certificate Generated",
      difficulty: "Beginner",
    },
  ];

  const mockActivities = [
    {
      id: "act_001",
      type: "task_completed",
      title: "Completed: Database Design Task",
      description:
        "Successfully designed and implemented a relational database schema",
      timestamp: "2025-01-22T16:30:00Z",
      programTitle: "Full Stack Web Development",
      score: 95,
    },
    {
      id: "act_002",
      type: "assessment_passed",
      title: "Passed: React Fundamentals Assessment",
      description:
        "Scored 88% on React components and state management assessment",
      timestamp: "2025-01-21T11:45:00Z",
      programTitle: "Full Stack Web Development",
      score: 88,
    },
    {
      id: "act_003",
      type: "project_submitted",
      title: "Submitted: E-commerce Website Project",
      description:
        "Submitted final project with full functionality and documentation",
      timestamp: "2025-01-20T18:20:00Z",
      programTitle: "Full Stack Web Development",
      score: null,
    },
    {
      id: "act_004",
      type: "certificate_earned",
      title: "Certificate Earned: UI/UX Design Fundamentals",
      description:
        "Successfully completed all requirements and earned certification",
      timestamp: "2025-01-19T14:10:00Z",
      programTitle: "UI/UX Design Fundamentals",
      score: null,
    },
  ];

  const mockDeadlines = [
    {
      id: "deadline_001",
      title: "Submit Mobile App Project",
      programTitle: "React Native Mobile Development",
      dueDate: "2025-01-28T23:59:59Z",
      type: "project_submission",
      priority: "high",
    },
    {
      id: "deadline_002",
      title: "Complete Node.js Assessment",
      programTitle: "Full Stack Web Development",
      dueDate: "2025-01-30T23:59:59Z",
      type: "assessment",
      priority: "medium",
    },
    {
      id: "deadline_003",
      title: "Peer Review Assignment",
      programTitle: "Full Stack Web Development",
      dueDate: "2025-02-02T23:59:59Z",
      type: "peer_review",
      priority: "low",
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setStats(mockStats);
        setRecentEnrollments(mockRecentEnrollments);
        setRecentActivities(mockActivities);
        setUpcomingDeadlines(mockDeadlines);
        setLoading(false);
      }, 800);

      // Uncomment this for real API integration
      // const [enrollmentsRes, programsRes] = await Promise.all([
      //   api.get("/enrollments"),
      //   api.get("/programs"),
      // ]);
      // const enrollments = enrollmentsRes.data.data.enrollments;
      // const programs = programsRes.data.data.programs;
      // setStats({
      //   enrollments: enrollments.length,
      //   completedTasks: 0,
      //   certificates: enrollments.filter((e) => e.certificateIssued).length,
      //   totalPrograms: programs.length,
      // });
      // setRecentEnrollments(enrollments.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "assessment_passed":
        return <Award className="h-4 w-4" />;
      case "project_submitted":
        return <FileText className="h-4 w-4" />;
      case "certificate_earned":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "task_completed":
        return "text-green-600 bg-green-100";
      case "assessment_passed":
        return "text-blue-600 bg-blue-100";
      case "project_submitted":
        return "text-purple-600 bg-purple-100";
      case "certificate_earned":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statCards = [
    {
      title: "Active Enrollments",
      value: stats.enrollments,
      icon: GraduationCap,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      change: "+2 this month",
      changeType: "positive",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckSquare,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      change: "+4 this week",
      changeType: "positive",
    },
    {
      title: "Certificates Earned",
      value: stats.certificates,
      icon: Award,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      change: "+1 this month",
      changeType: "positive",
    },
    {
      title: "Learning Hours",
      value: stats.totalLearningHours,
      icon: Clock,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      change: "+24 this week",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
              ))}
            </div>
            <div className="bg-white rounded-lg h-64"></div>
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
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || "Student"}! 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Here's your learning progress and recent activities
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>Overall Progress: {stats.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Enrollments */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  My Learning Journey
                </h2>
                <Link
                  to="/my-enrollments"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {recentEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={enrollment.imageUrl}
                        alt={enrollment.programTitle}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {enrollment.programTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Next: {enrollment.nextTask}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{enrollment.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${enrollment.progressPercentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : enrollment.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {enrollment.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {enrollment.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Enroll in a program to begin your skill development
                  </p>
                  <Link
                    to="/programs"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Programs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Upcoming Deadlines
                </h3>
              </div>
              <div className="p-6">
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                            deadline.priority
                          )}`}
                        >
                          {getDaysUntilDue(deadline.dueDate)} days
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {deadline.title}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {deadline.programTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due {formatDate(deadline.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No upcoming deadlines
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    to="/programs"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3 group-hover:text-blue-700" />
                    <span className="font-medium text-gray-900">
                      Browse Programs
                    </span>
                  </Link>
                  <Link
                    to="/my-certificates"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Award className="h-5 w-5 text-purple-600 mr-3 group-hover:text-purple-700" />
                    <span className="font-medium text-gray-900">
                      My Certificates
                    </span>
                  </Link>
                  <Link
                    to="/referrals"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Users className="h-5 w-5 text-green-600 mr-3 group-hover:text-green-700" />
                    <span className="font-medium text-gray-900">
                      Refer Friends
                    </span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Target className="h-5 w-5 text-gray-600 mr-3 group-hover:text-gray-700" />
                    <span className="font-medium text-gray-900">
                      Profile Settings
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {activity.programTitle}
                        </p>
                        <div className="flex items-center space-x-2">
                          {activity.score && (
                            <span className="text-xs font-medium text-green-600">
                              Score: {activity.score}%
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Recent Activity
                </h3>
                <p className="text-gray-500">
                  Start learning to see your progress here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
