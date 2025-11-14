import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    programId: "",
    title: "",
    description: "",
    taskType: "assignment",
    difficultyLevel: "easy",
    maxPoints: 100,
    passingPoints: 70,
    dueDate: "",
    estimatedHours: "",
    instructions: "",
    requirements: "",
    evaluationCriteria: "",
    isMandatory: true,
    allowLateSubmission: true,
    orderIndex: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, programsRes] = await Promise.all([
        api.get("/admin/tasks"),
        api.get("/admin/programs"),
      ]);

      setTasks(tasksRes.data.data.tasks || []);
      setPrograms(programsRes.data.data.programs || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
      setTasks([]);
      setPrograms([]);
    } finally {
      setLoading(false);
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

  const getTypeColor = (type) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800";
      case "project":
        return "bg-purple-100 text-purple-800";
      case "quiz":
        return "bg-orange-100 text-orange-800";
      case "presentation":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({
      programId: "",
      title: "",
      description: "",
      taskType: "assignment",
      difficultyLevel: "easy",
      maxPoints: 100,
      passingPoints: 70,
      dueDate: "",
      estimatedHours: "",
      instructions: "",
      requirements: "",
      evaluationCriteria: "",
      isMandatory: true,
      allowLateSubmission: true,
      orderIndex: 0,
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      programId: task.programId,
      title: task.title,
      description: task.description,
      taskType: task.taskType,
      difficultyLevel: task.difficultyLevel,
      maxPoints: task.maxPoints,
      passingPoints: task.passingPoints,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      estimatedHours: task.estimatedHours || "",
      instructions: task.instructions || "",
      requirements: task.requirements || "",
      evaluationCriteria: task.evaluationCriteria || "",
      isMandatory: task.isMandatory !== false,
      allowLateSubmission: task.allowLateSubmission !== false,
      orderIndex: task.orderIndex || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/admin/tasks/${editingTask.id}`, formData);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/admin/tasks", formData);
        toast.success("Task created successfully!");
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/admin/tasks/${id}`);
        toast.success("Task deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = !programFilter || task.programId === programFilter;
    return matchesSearch && matchesProgram;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-gray-600">
            Create and manage program tasks and assignments
          </p>
        </div>
        <button onClick={handleAddTask} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="input-field"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
            >
              <option value="">All Programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || programFilter
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    {task.isMandatory && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        MANDATORY
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                        task.difficultyLevel
                      )}`}
                    >
                      {task.difficultyLevel?.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        task.taskType
                      )}`}
                    >
                      {task.taskType?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Max Points:</span>
                  <span className="font-medium">{task.maxPoints}</span>
                </div>

                {task.dueDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {task.estimatedHours && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Est. Time:
                    </div>
                    <span className="font-medium">{task.estimatedHours}h</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Submissions:</span>
                  <span className="font-medium">
                    {task.submissionCount || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Order: #{task.orderIndex}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Task"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program *
                  </label>
                  <select
                    required
                    value={formData.programId}
                    onChange={(e) =>
                      setFormData({ ...formData, programId: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select Program</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Type *
                  </label>
                  <select
                    value={formData.taskType}
                    onChange={(e) =>
                      setFormData({ ...formData, taskType: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                    <option value="presentation">Presentation</option>
                    <option value="code_review">Code Review</option>
                    <option value="research">Research</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, difficultyLevel: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPoints: parseInt(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.passingPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passingPoints: parseInt(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedHours: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="Hours to complete"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  className="input-field"
                  placeholder="Detailed instructions for the task"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  className="input-field"
                  placeholder="Task requirements and prerequisites"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluation Criteria
                </label>
                <textarea
                  rows={2}
                  value={formData.evaluationCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evaluationCriteria: e.target.value,
                    })
                  }
                  className="input-field"
                  placeholder="How the task will be evaluated"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMandatory"
                    checked={formData.isMandatory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isMandatory: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="isMandatory"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mandatory
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowLateSubmission"
                    checked={formData.allowLateSubmission}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowLateSubmission: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="allowLateSubmission"
                    className="text-sm font-medium text-gray-700"
                  >
                    Allow Late Submission
                  </label>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
