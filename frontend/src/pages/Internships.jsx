import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  Star,
  Bookmark,
  Users,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    stipend: "",
    duration: "",
  });

  useEffect(() => {
    fetchInternships();
  }, [filters]);

  const fetchInternships = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/internships?${params.toString()}`);
      setInternships(response.data);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatStipend = (stipend) => {
    if (stipend === 0) return "Unpaid";
    return `₹${stipend.toLocaleString()}/month`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Internship
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover opportunities that match your skills and interests from top
            companies worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search internships, companies, skills..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Stipend */}
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filters.stipend}
                onChange={(e) => handleFilterChange("stipend", e.target.value)}
              >
                <option value="">All Stipends</option>
                <option value="0">Unpaid</option>
                <option value="5000">₹5,000+</option>
                <option value="10000">₹10,000+</option>
                <option value="15000">₹15,000+</option>
                <option value="20000">₹20,000+</option>
                <option value="25000">₹25,000+</option>
              </select>
            </div>

            {/* Duration */}
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
              >
                <option value="">All Durations</option>
                <option value="1-3">1-3 months</option>
                <option value="3-6">3-6 months</option>
                <option value="6+">6+ months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{internships.length}</span>{" "}
            internship{internships.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Most Relevant</option>
              <option>Newest First</option>
              <option>Highest Stipend</option>
              <option>Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Internship Listings */}
        <div className="space-y-6">
          {internships.length > 0 ? (
            internships.map((internship) => (
              <div key={internship.id} className="internship-card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {internship.company.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {internship.title}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {internship.company}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bookmark className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {internship.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {internship.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {internship.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatStipend(internship.stipend)}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        12 applicants
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="badge badge-blue">Full-time</span>
                      <span className="badge badge-green">Immediate Start</span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          4.8 (24 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col items-end">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatStipend(internship.stipend)}
                      </div>
                      <div className="text-sm text-gray-500">
                        + Performance Bonus
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                      <Link
                        to={`/payment/${internship.id}`}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No internships found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search filters to find more opportunities
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    location: "",
                    stipend: "",
                    duration: "",
                  })
                }
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {internships.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn-secondary">Load More Internships</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;
