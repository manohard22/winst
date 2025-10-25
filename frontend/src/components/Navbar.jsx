import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  Search,
  GraduationCap,
  ChevronDown,
  Gift,
  Settings,
  CreditCard,
  Users,
  Award,
  Bell,
  HelpCircle,
  Shield,
  UserCircle,
} from "lucide-react";
import api from "../services/api";
import logo from "../assets/images/winst_logo.jpg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInternshipsOpen, setIsInternshipsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await api.get("/technologies");
      setTechnologies(response.data.data.technologies || []);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {});

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="Winst" className="h-10 w-auto object-contain" />
              <span className="sr-only">Winst</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="navbar-link">
              Home
            </Link>

            {/* Internships Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsInternshipsOpen(!isInternshipsOpen)}
                className="navbar-link flex items-center"
                onMouseEnter={() => setIsInternshipsOpen(true)}
              >
                Internships
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {isInternshipsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50"
                  onMouseLeave={() => setIsInternshipsOpen(false)}
                >
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Browse by Technology
                    </h3>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {Object.entries(groupedTechnologies).map(
                      ([category, techs]) => (
                        <div key={category} className="px-4 py-3">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {techs.map((tech) => (
                              <Link
                                key={tech.id}
                                to={`/programs?technology=${tech.name}`}
                                className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                                onClick={() => setIsInternshipsOpen(false)}
                              >
                                {tech.iconUrl && (
                                  <img
                                    src={tech.iconUrl}
                                    alt={tech.name}
                                    className="w-5 h-5 mr-2"
                                  />
                                )}
                                <span className="text-sm text-gray-700">
                                  {tech.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="px-4 pt-3 border-t border-gray-100">
                    <Link
                      to="/programs"
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      onClick={() => setIsInternshipsOpen(false)}
                    >
                      View All Internships
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="navbar-link">
              About
            </Link>
            <Link to="/contact" className="navbar-link">
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Quick Access Links */}
                <Link
                  to="/referrals"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Gift className="h-4 w-4" />
                  <span className="font-medium">Refer Friends</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    onMouseEnter={() => setIsProfileOpen(true)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.fullName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {user?.fullName || "Profile"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isProfileOpen && (
                    <div
                      className="absolute top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      onMouseLeave={() => setIsProfileOpen(false)}
                    >
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              {user?.fullName?.charAt(0) ||
                                user?.email?.charAt(0) ||
                                "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.fullName || "User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email}
                            </p>
                            <p className="text-xs text-blue-600 font-medium capitalize">
                              {user?.role || "Student"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Section */}
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/my-enrollments"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>My Enrollments</span>
                        </Link>

                        <Link
                          to="/my-certificates"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Award className="h-4 w-4" />
                          <span>Certificates</span>
                        </Link>

                        <Link
                          to="/project-submission"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Project Submission</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100"></div>

                      {/* Referral & Earnings Section */}
                      <div className="py-2">
                        <Link
                          to="/referrals"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Users className="h-4 w-4" />
                          <span>Refer Friends</span>
                          <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ₹499 Off
                          </span>
                        </Link>

                        {user?.role === "affiliate" && (
                          <Link
                            to="/affiliate-dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <CreditCard className="h-4 w-4" />
                            <span>Affiliate Earnings</span>
                            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              25%
                            </span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100"></div>

                      {/* Account Section */}
                      <div className="py-2">
                        <Link
                          to="/payments"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Payment History</span>
                        </Link>

                        <Link
                          to="/notifications"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </Link>

                        <Link
                          to="/profile-settings"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Account Settings</span>
                        </Link>

                        <Link
                          to="/privacy"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Shield className="h-4 w-4" />
                          <span>Privacy & Security</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100"></div>

                      {/* Support Section */}
                      <div className="py-2">
                        <Link
                          to="/help"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>Help & Support</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/programs"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Internships
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Contact
            </Link>

            {user ? (
              <div className="pt-2 border-t border-gray-100">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-enrollments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Enrollments
                </Link>
                <Link
                  to="/referrals"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Refer Friends
                </Link>
                <Link
                  to="/payments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Payments
                </Link>
                <Link
                  to="/profile-settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
