import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Users,
  DollarSign,
  Mail,
  Award,
} from "lucide-react";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationWeeks: "",
    difficultyLevel: "beginner",
    price: "",
    discountPercentage: 0,
    finalPrice: "",
    maxParticipants: "",
    requirements: "",
    learningOutcomes: "",
    imageUrl: "",
    certificateProvided: true,
    mentorshipIncluded: true,
    projectBased: true,
    remoteAllowed: true,
    isActive: true,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    // Calculate final price when price or discount changes
    if (formData.price && formData.discountPercentage >= 0) {
      const price = parseFloat(formData.price);
      const discount = parseFloat(formData.discountPercentage) || 0;
      const finalPrice = price - (price * discount) / 100;
      setFormData((prev) => ({ ...prev, finalPrice: finalPrice.toFixed(2) }));
    }
  }, [formData.price, formData.discountPercentage]);

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/admin/programs");
      setPrograms(response.data.data.programs);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await api.put(`/admin/programs/${editingProgram.id}`, formData);
      } else {
        await api.post("/admin/programs", formData);
      }
      fetchPrograms();
      resetForm();
      alert(
        editingProgram
          ? "Program updated successfully!"
          : "Program created successfully!"
      );
    } catch (error) {
      alert("Failed to save program");
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      durationWeeks: program.durationWeeks,
      difficultyLevel: program.difficultyLevel,
      price: program.price,
      discountPercentage: program.discountPercentage,
      finalPrice: program.finalPrice,
      maxParticipants: program.maxParticipants,
      requirements: program.requirements || "",
      learningOutcomes: program.learningOutcomes || "",
      imageUrl: program.imageUrl || "",
      certificateProvided: program.certificateProvided,
      mentorshipIncluded: program.mentorshipIncluded,
      projectBased: program.projectBased,
      remoteAllowed: program.remoteAllowed,
      isActive: program.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await api.delete(`/admin/programs/${id}`);
        fetchPrograms();
        alert("Program deleted successfully!");
      } catch (error) {
        alert("Failed to delete program");
      }
    }
  };

  const sendCertificate = async (programId) => {
    try {
      await api.post(`/admin/programs/${programId}/send-certificates`);
      alert("Certificates sent to all completed students!");
    } catch (error) {
      alert("Failed to send certificates");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      durationWeeks: "",
      difficultyLevel: "beginner",
      price: "",
      discountPercentage: 0,
      finalPrice: "",
      maxParticipants: "",
      requirements: "",
      learningOutcomes: "",
      imageUrl: "",
      certificateProvided: true,
      mentorshipIncluded: true,
      projectBased: true,
      remoteAllowed: true,
      isActive: true,
    });
    setEditingProgram(null);
    setShowModal(false);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Programs Management
          </h1>
          <p className="text-gray-600">
            Manage internship programs and send certificates
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search programs..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {program.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      program.difficultyLevel
                    )}`}
                  >
                    {program.difficultyLevel?.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      program.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {program.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {program.durationWeeks} weeks
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <div className="text-right">
                  {program.discountPercentage > 0 && (
                    <span className="text-gray-500 line-through text-xs">
                      ₹{program.price}
                    </span>
                  )}
                  <span className="font-bold text-primary-600 ml-1">
                    ₹{program.finalPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  Enrolled:
                </div>
                <span className="font-medium">{program.enrollmentCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Revenue:
                </div>
                <span className="font-medium">
                  ₹{program.revenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Created: {new Date(program.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => sendCertificate(program.id)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                  title="Send Certificates"
                >
                  <Award className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(program)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No programs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Add/Edit Program Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (weeks) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="input-field"
                      value={formData.durationWeeks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationWeeks: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="input-field"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      className="input-field"
                      value={formData.difficultyLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficultyLevel: e.target.value,
                        })
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="input-field"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="input-field"
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final Price (₹)
                    </label>
                    <input
                      type="number"
                      className="input-field bg-gray-50"
                      value={formData.finalPrice}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxParticipants: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      rows={3}
                      className="input-field"
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Outcomes
                    </label>
                    <textarea
                      rows={3}
                      className="input-field"
                      value={formData.learningOutcomes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          learningOutcomes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="certificateProvided"
                      checked={formData.certificateProvided}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificateProvided: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="certificateProvided"
                      className="text-sm text-gray-700"
                    >
                      Certificate
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mentorshipIncluded"
                      checked={formData.mentorshipIncluded}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mentorshipIncluded: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="mentorshipIncluded"
                      className="text-sm text-gray-700"
                    >
                      Mentorship
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="projectBased"
                      checked={formData.projectBased}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectBased: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="projectBased"
                      className="text-sm text-gray-700"
                    >
                      Projects
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remoteAllowed"
                      checked={formData.remoteAllowed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          remoteAllowed: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="remoteAllowed"
                      className="text-sm text-gray-700"
                    >
                      Remote
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProgram ? "Update Program" : "Create Program"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
