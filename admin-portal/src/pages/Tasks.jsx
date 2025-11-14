import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Search, Edit, Eye, CheckSquare, Clock } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");

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
      // For demo purposes
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
        <button className="btn-primary flex items-center gap-2">
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
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
