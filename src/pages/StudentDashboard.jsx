import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { studentAPI, paymentAPI, certificateAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  User,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Download,
  Upload,
  Calendar,
  Target,
  TrendingUp,
  Bell,
} from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, paymentsRes] = await Promise.all([
        studentAPI.getTasks(),
        studentAPI.getPayments(),
      ]);

      setTasks(tasksRes.data);
      setPayments(paymentsRes.data);

      if (user?.id) {
        const certificatesRes = await studentAPI.getCertificates(user.id);
        setCertificates(certificatesRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmission = async (taskId) => {
    try {
      const data = submissionData[taskId];
      if (!data?.submissionText && !data?.file) {
        toast.error("Please provide submission text or upload a file");
        return;
      }

      const formData = new FormData();
      if (data.submissionText) {
        formData.append("submissionText", data.submissionText);
      }
      if (data.file) {
        formData.append("file", data.file);
      }

      await studentAPI.submitTask(taskId, formData);
      toast.success("Task submitted successfully!");
      fetchDashboardData(); // Refresh data

      // Clear submission data
      setSubmissionData((prev) => ({
        ...prev,
        [taskId]: { submissionText: "", file: null },
      }));
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error("Failed to submit task");
    }
  };

  const updateSubmissionData = (taskId, field, value) => {
    setSubmissionData((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Current Program",
      value: user?.technology || "Web Development",
      icon: <BookOpen className="h-6 w-6 text-lucro-blue" />,
      color: "bg-blue-50",
    },
    {
      title: "Progress",
      value: `${progressPercentage}%`,
      icon: <TrendingUp className="h-6 w-6 text-lucro-green" />,
      color: "bg-green-50",
    },
    {
      title: "Tasks Completed",
      value: `${completedTasks}/${totalTasks}`,
      icon: <CheckCircle className="h-6 w-6 text-lucro-green" />,
      color: "bg-green-50",
    },
    {
      title: "Certificates",
      value: certificates.length.toString(),
      icon: <Award className="h-6 w-6 text-lucro-orange" />,
      color: "bg-orange-50",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "New assignment uploaded: API Integration Project",
      time: "2 hours ago",
      type: "assignment",
    },
    {
      id: 2,
      message: "Mentor session scheduled for tomorrow at 3 PM",
      time: "1 day ago",
      type: "meeting",
    },
    {
      id: 3,
      message: "Payment confirmation received",
      time: "2 days ago",
      type: "payment",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "pending":
        return <Target className="h-5 w-5 text-gray-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Student"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress and manage your internship journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "tasks", label: "Tasks" },
              { id: "progress", label: "Progress" },
              { id: "profile", label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-lucro-blue text-lucro-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Recent Tasks */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Tasks
                  </h3>
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Due: {task.dueDate}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace("-", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Learning Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>React Fundamentals</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-lucro-green h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>JavaScript Advanced</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-lucro-blue h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Node.js Backend</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-lucro-orange h-2 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Tasks
                </h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lucro-blue mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading tasks...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium text-gray-900">
                                {task.title}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>
                                Due:{" "}
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                              <span>Points: {task.points}</span>
                              <span>Technology: {task.tech_name}</span>
                            </div>

                            {/* Submission Form */}
                            {(task.status === "pending" ||
                              task.status === "in_progress") && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-3">
                                  Submit Your Work
                                </h5>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Submission Text
                                    </label>
                                    <textarea
                                      rows={3}
                                      className="input-field"
                                      placeholder="Describe your solution or provide links..."
                                      value={
                                        submissionData[task.task_id]
                                          ?.submissionText || ""
                                      }
                                      onChange={(e) =>
                                        updateSubmissionData(
                                          task.task_id,
                                          "submissionText",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Upload File (Optional)
                                    </label>
                                    <input
                                      type="file"
                                      className="input-field"
                                      onChange={(e) =>
                                        updateSubmissionData(
                                          task.task_id,
                                          "file",
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleTaskSubmission(task.task_id)
                                    }
                                    className="btn-primary text-sm"
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Submit Task
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Submission Details */}
                            {task.submission_id && (
                              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">
                                  Submitted
                                </h5>
                                <p className="text-sm text-green-700">
                                  Submitted on:{" "}
                                  {new Date(
                                    task.submitted_at
                                  ).toLocaleDateString()}
                                </p>
                                {task.feedback && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-green-800">
                                      Feedback:
                                    </p>
                                    <p className="text-sm text-green-700">
                                      {task.feedback}
                                    </p>
                                  </div>
                                )}
                                {task.grade && (
                                  <p className="text-sm text-green-700 mt-1">
                                    Grade:{" "}
                                    <span className="font-medium">
                                      {task.grade}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No tasks assigned yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "progress" && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Overall Progress
                  </h3>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-lucro-light-blue mb-4">
                      <span className="text-3xl font-bold text-lucro-blue">
                        65%
                      </span>
                    </div>
                    <p className="text-gray-600">Program Completion</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">8</div>
                      <div className="text-sm text-gray-600">
                        Tasks Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        750
                      </div>
                      <div className="text-sm text-gray-600">Points Earned</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          First Task Completed
                        </h4>
                        <p className="text-sm text-gray-600">
                          Completed your first assignment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Quick Learner
                        </h4>
                        <p className="text-sm text-gray-600">
                          Completed 5 tasks ahead of schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-lucro-light-blue rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-lucro-blue" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h4>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user?.phone || ""}
                        className="input-field"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technology Track
                      </label>
                      <input
                        type="text"
                        value={user?.technology || ""}
                        className="input-field"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education Level
                      </label>
                      <input
                        type="text"
                        value={user?.education || ""}
                        className="input-field"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={user?.fieldOfStudy || ""}
                        className="input-field"
                        readOnly
                      />
                    </div>
                  </div>

                  <button className="btn-primary">Edit Profile</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm text-gray-900 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left">
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Submit Assignment
                </button>
                <button className="w-full btn-secondary text-left">
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Schedule Mentor Session
                </button>
                <button className="w-full btn-secondary text-left">
                  <Download className="h-4 w-4 mr-2 inline" />
                  Download Resources
                </button>
              </div>
            </div>

            {/* Mentor Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Mentor
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-lucro-light-blue rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-lucro-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Senior Developer</p>
                </div>
              </div>
              <button className="w-full btn-secondary text-sm">
                Contact Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
