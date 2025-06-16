import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  Award,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  UserCheck,
  GraduationCap,
  MapPin,
  Activity,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { adminAPI, certificateAPI } from "../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    technology: "",
    assignedToEmail: "",
    dueDate: "",
    points: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, paymentsRes, tasksRes, statsRes] = await Promise.all([
        adminAPI.getStudents(),
        adminAPI.getPayments(),
        adminAPI.getTasks(),
        adminAPI.getDashboardStats(),
      ]);

      setStudents(studentsRes.data);
      setPayments(paymentsRes.data);
      setTasks(tasksRes.data);
      setDashboardStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createTask(newTask);
      toast.success("Task created successfully!");
      setNewTask({
        title: "",
        description: "",
        technology: "",
        assignedToEmail: "",
        dueDate: "",
        points: 0,
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleGenerateCertificate = async (studentId, techId) => {
    try {
      await certificateAPI.generate(studentId, techId);
      toast.success("Certificate generated successfully!");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate");
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: dashboardStats.totalStudents?.toString() || "0",
      change: "+12%",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Active Students",
      value: dashboardStats.activeStudents?.toString() || "0",
      change: "+8%",
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `₹${(dashboardStats.totalRevenue / 1000).toFixed(0)}K` || "₹0",
      change: "+18%",
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Certificates Issued",
      value: dashboardStats.certificatesIssued?.toString() || "0",
      change: "+25%",
      icon: <Award className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-50",
    },
  ];

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
    try {
      // In real app, make API call
      setPayments((prev) =>
        prev.map((p) =>
          p.payment_id === paymentId ? { ...p, payment_status: newStatus } : p
        )
      );
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage students, programs, and track performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
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
              { id: "students", label: "Students" },
              { id: "payments", label: "Payments" },
              { id: "tasks", label: "Tasks" },
              { id: "programs", label: "Programs" },
              { id: "certificates", label: "Certificates" },
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
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Enrollments
              </h3>
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div
                    key={student.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {student.full_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {student.tech_name || "Not Assigned"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        student.status || "pending"
                      )}`}
                    >
                      {student.status || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Program Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Web Development</span>
                    <span>85% completion rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-lucro-blue h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Data Science</span>
                    <span>78% completion rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-lucro-green h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Mobile Development</span>
                    <span>72% completion rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-lucro-orange h-2 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Student Management
              </h3>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button className="btn-secondary flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="btn-secondary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lucro-blue mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading students...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students
                      .filter(
                        (student) =>
                          student.full_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          student.email
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          (student.tech_name &&
                            student.tech_name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()))
                      )
                      .map((student) => (
                        <tr key={student.user_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.tech_name || "Not Assigned"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-lucro-blue h-2 rounded-full"
                                  style={{
                                    width: `${
                                      student.progress_percentage || 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">
                                {student.progress_percentage || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                student.status || "pending"
                              )}`}
                            >
                              {student.status || "pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(student.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewStudent(student)}
                                className="text-lucro-blue hover:text-lucro-dark-blue"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {student.status === "completed" && (
                                <button
                                  onClick={() =>
                                    handleGenerateCertificate(
                                      student.user_id,
                                      student.tech_id
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Generate Certificate"
                                >
                                  <Award className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No students found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Management
              </h3>
              <button className="btn-secondary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lucro-blue mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading payments...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.student_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.student_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              payment.payment_status
                            )}`}
                          >
                            {payment.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-lucro-blue hover:text-lucro-dark-blue"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {payment.payment_status === "pending" && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Approve Payment"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No payments found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-6">
            {/* Create Task Form */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Task
              </h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology *
                    </label>
                    <select
                      required
                      className="input-field"
                      value={newTask.technology}
                      onChange={(e) =>
                        setNewTask({ ...newTask, technology: e.target.value })
                      }
                    >
                      <option value="">Select Technology</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">
                        Mobile Development
                      </option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To (Email) *
                    </label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={newTask.assignedToEmail}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assignedToEmail: e.target.value,
                        })
                      }
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newTask.points}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          points: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="input-field"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Describe the task requirements..."
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </button>
              </form>
            </div>

            {/* Tasks List */}
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                            <span>Assigned to: {task.assigned_to_name}</span>
                            <span>Technology: {task.tech_name}</span>
                            <span>
                              Due:{" "}
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                            <span>Points: {task.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tasks created yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "programs" && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Program Management
              </h3>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </button>
            </div>
            <p className="text-gray-600">
              Program management interface coming soon...
            </p>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Certificate Management
              </h3>
              <button className="btn-primary flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Generate Certificate
              </button>
            </div>
            <p className="text-gray-600">
              Certificate management interface coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
