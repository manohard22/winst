import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

const Tasks = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionModal, setSubmissionModal] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submissionText: "",
    submissionUrl: "",
    githubUrl: "",
    liveDemoUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [programId]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/program/${programId}`);
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskId) => {
    setSubmitting(true);
    try {
      await api.post(`/tasks/${taskId}/submit`, submissionData);
      setSubmissionModal(null);
      setSubmissionData({
        submissionText: "",
        submissionUrl: "",
        githubUrl: "",
        liveDemoUrl: "",
      });
      fetchTasks(); // Refresh tasks
      alert("Task submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "needs_revision":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/enrollments")}
        className="flex items-center text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Enrollments
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Program Tasks</h1>
        <p className="text-gray-600">
          Complete these tasks to progress through your internship
        </p>
      </div>

      <div className="space-y-6">
        {tasks.map((task) => (
          <div key={task.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      task.difficultyLevel
                    )}`}
                  >
                    {task.difficultyLevel?.toUpperCase()}
                  </span>
                  {task.isMandatory && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      MANDATORY
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>

                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Max Points: {task.maxPoints}</span>
                  <span>Type: {task.taskType}</span>
                  {task.estimatedHours && (
                    <span>Est. Time: {task.estimatedHours}h</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                {task.submission ? (
                  <div className="space-y-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        task.submission.status
                      )}`}
                    >
                      {task.submission.status.replace("_", " ").toUpperCase()}
                    </span>
                    {task.submission.pointsEarned && (
                      <div className="text-sm text-gray-600">
                        Score: {task.submission.pointsEarned}/{task.maxPoints}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmissionModal(task)}
                    className="btn-primary"
                  >
                    Submit Task
                  </button>
                )}
              </div>
            </div>

            {task.instructions && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Instructions:
                </h4>
                <p className="text-blue-800 text-sm">{task.instructions}</p>
              </div>
            )}

            {task.resources && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Resources:</h4>
                <p className="text-green-800 text-sm">{task.resources}</p>
              </div>
            )}

            {task.submission?.feedback && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Feedback:</h4>
                <p className="text-yellow-800 text-sm">
                  {task.submission.feedback}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No tasks available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tasks will appear here once they are assigned
          </p>
        </div>
      )}

      {/* Submission Modal */}
      {submissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Submit Task: {submissionModal.title}
                </h2>
                <button
                  onClick={() => setSubmissionModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Text *
                  </label>
                  <textarea
                    rows={4}
                    className="input-field"
                    placeholder="Describe your solution and approach..."
                    value={submissionData.submissionText}
                    onChange={(e) =>
                      setSubmissionData({
                        ...submissionData,
                        submissionText: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/your-submission"
                    value={submissionData.submissionUrl}
                    onChange={(e) =>
                      setSubmissionData({
                        ...submissionData,
                        submissionUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://github.com/username/repository"
                    value={submissionData.githubUrl}
                    onChange={(e) =>
                      setSubmissionData({
                        ...submissionData,
                        githubUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://your-demo.netlify.app"
                    value={submissionData.liveDemoUrl}
                    onChange={(e) =>
                      setSubmissionData({
                        ...submissionData,
                        liveDemoUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSubmissionModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(submissionModal.id)}
                  disabled={submitting || !submissionData.submissionText}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {submitting ? "Submitting..." : "Submit Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
