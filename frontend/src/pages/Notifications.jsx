import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Settings,
  Check,
  X,
  Filter,
  Clock,
  Award,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Trash2,
  MarkAsRead,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock data for demonstration
  const mockNotifications = [
    {
      id: "notif_001",
      type: "task_completed",
      title: "Task Completed Successfully",
      message:
        "You've completed the 'Database Design' task with a score of 95%",
      timestamp: "2025-01-22T16:30:00Z",
      read: false,
      priority: "high",
      programTitle: "Full Stack Web Development",
      actionUrl: "/my-enrollments",
    },
    {
      id: "notif_002",
      type: "assessment_reminder",
      title: "Assessment Due Tomorrow",
      message: "Your React Fundamentals assessment is due tomorrow at 11:59 PM",
      timestamp: "2025-01-21T09:00:00Z",
      read: false,
      priority: "high",
      programTitle: "Full Stack Web Development",
      actionUrl: "/assessment/prog_001",
    },
    {
      id: "notif_003",
      type: "certificate_earned",
      title: "Certificate Awarded!",
      message:
        "Congratulations! You've earned your UI/UX Design Fundamentals certificate",
      timestamp: "2025-01-20T14:15:00Z",
      read: true,
      priority: "medium",
      programTitle: "UI/UX Design Fundamentals",
      actionUrl: "/my-certificates",
    },
    {
      id: "notif_004",
      type: "project_feedback",
      title: "Project Feedback Available",
      message:
        "Your instructor has provided feedback on your e-commerce project",
      timestamp: "2025-01-19T11:20:00Z",
      read: true,
      priority: "medium",
      programTitle: "Full Stack Web Development",
      actionUrl: "/project-submission/prog_001",
    },
    {
      id: "notif_005",
      type: "enrollment_confirmation",
      title: "Enrollment Confirmed",
      message:
        "Welcome to React Native Mobile Development! Your journey begins now",
      timestamp: "2025-01-18T10:30:00Z",
      read: true,
      priority: "low",
      programTitle: "React Native Mobile Development",
      actionUrl: "/my-enrollments",
    },
    {
      id: "notif_006",
      type: "peer_review",
      title: "Peer Review Request",
      message: "You've been assigned to review a peer's project submission",
      timestamp: "2025-01-17T16:45:00Z",
      read: false,
      priority: "medium",
      programTitle: "Full Stack Web Development",
      actionUrl: "/peer-review/123",
    },
    {
      id: "notif_007",
      type: "system_announcement",
      title: "Platform Maintenance Notice",
      message:
        "Scheduled maintenance on Jan 25th from 2-4 AM IST. Services may be temporarily unavailable",
      timestamp: "2025-01-16T12:00:00Z",
      read: true,
      priority: "low",
      programTitle: null,
      actionUrl: null,
    },
    {
      id: "notif_008",
      type: "deadline_approaching",
      title: "Deadline Approaching",
      message: "Your mobile app project submission is due in 3 days",
      timestamp: "2025-01-15T08:00:00Z",
      read: false,
      priority: "high",
      programTitle: "React Native Mobile Development",
      actionUrl: "/project-submission/prog_002",
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 800);

      // Uncomment this for real API integration
      // const response = await api.get('/notifications');
      // setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="h-5 w-5" />;
      case "assessment_reminder":
        return <Clock className="h-5 w-5" />;
      case "certificate_earned":
        return <Award className="h-5 w-5" />;
      case "project_feedback":
        return <MessageSquare className="h-5 w-5" />;
      case "enrollment_confirmation":
        return <BookOpen className="h-5 w-5" />;
      case "peer_review":
        return <Users className="h-5 w-5" />;
      case "system_announcement":
        return <Info className="h-5 w-5" />;
      case "deadline_approaching":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === "high") {
      return "text-red-600 bg-red-100";
    }

    switch (type) {
      case "task_completed":
        return "text-green-600 bg-green-100";
      case "assessment_reminder":
        return "text-orange-600 bg-orange-100";
      case "certificate_earned":
        return "text-purple-600 bg-purple-100";
      case "project_feedback":
        return "text-blue-600 bg-blue-100";
      case "enrollment_confirmation":
        return "text-green-600 bg-green-100";
      case "peer_review":
        return "text-yellow-600 bg-yellow-100";
      case "system_announcement":
        return "text-gray-600 bg-gray-100";
      case "deadline_approaching":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const filterNotifications = () => {
    if (selectedFilter === "all") return notifications;
    if (selectedFilter === "unread")
      return notifications.filter((n) => !n.read);
    if (selectedFilter === "read") return notifications.filter((n) => n.read);
    return notifications.filter((n) => n.type === selectedFilter);
  };

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const deleteSelectedNotifications = () => {
    setNotifications(
      notifications.filter((n) => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filterNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-8 w-8 mr-3 text-blue-600" />
                Notifications
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Stay updated with your learning progress and activities
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <Link
              to="/notifications/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", count: notifications.length },
                { id: "unread", label: "Unread", count: unreadCount },
                {
                  id: "task_completed",
                  label: "Tasks",
                  count: notifications.filter(
                    (n) => n.type === "task_completed"
                  ).length,
                },
                {
                  id: "assessment_reminder",
                  label: "Assessments",
                  count: notifications.filter(
                    (n) => n.type === "assessment_reminder"
                  ).length,
                },
                {
                  id: "certificate_earned",
                  label: "Certificates",
                  count: notifications.filter(
                    (n) => n.type === "certificate_earned"
                  ).length,
                },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-1 text-xs">({filter.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {selectedNotifications.length > 0 && (
                <button
                  onClick={deleteSelectedNotifications}
                  className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedNotifications.length})
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    {/* Icon */}
                    <div
                      className={`p-2 rounded-full ${getNotificationColor(
                        notification.type,
                        notification.priority
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`text-sm font-medium ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          {notification.programTitle && (
                            <p className="mt-1 text-xs text-blue-600 font-medium">
                              {notification.programTitle}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(notification.timestamp)}
                            </span>
                            {notification.priority === "high" && (
                              <span className="flex items-center text-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Link
                            to={notification.actionUrl}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                          >
                            View Details
                            <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedFilter === "unread"
                  ? "No Unread Notifications"
                  : "No Notifications"}
              </h3>
              <p className="text-gray-500">
                {selectedFilter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "You'll see notifications about your learning progress here"}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    notifications.filter((n) => n.type === "task_completed")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    notifications.filter((n) => n.type === "certificate_earned")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
