import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Lock,
  Shield,
  Bell,
  Globe,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  UserCircle,
  School,
  Link as LinkIcon,
  Building,
} from "lucide-react";
import api from "../services/api";

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    college_name: "",
    degree: "",
    branch: "",
    year_of_study: "",
    cgpa: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    assignment_reminders: true,
    payment_updates: true,
  });

  useEffect(() => {
    // Initialize with mock data if user is available
    const mockUserData = {
      first_name: "Rahul",
      last_name: "Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 9876543210",
      date_of_birth: "1998-05-15",
      gender: "male",
      address: "123, MG Road, Near City Center",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560001",
      college_name: "Indian Institute of Technology, Bangalore",
      degree: "B.Tech",
      branch: "Computer Science Engineering",
      year_of_study: "4",
      cgpa: "8.7",
      linkedin_url: "https://linkedin.com/in/rahulsharma",
      github_url: "https://github.com/rahulsharma",
      portfolio_url: "https://rahulsharma.dev",
    };

    if (user) {
      setProfileData({
        first_name: user.first_name || mockUserData.first_name,
        last_name: user.last_name || mockUserData.last_name,
        email: user.email || mockUserData.email,
        phone: user.phone || mockUserData.phone,
        date_of_birth: user.date_of_birth || mockUserData.date_of_birth,
        gender: user.gender || mockUserData.gender,
        address: user.address || mockUserData.address,
        city: user.city || mockUserData.city,
        state: user.state || mockUserData.state,
        country: user.country || mockUserData.country,
        pincode: user.pincode || mockUserData.pincode,
        college_name: user.college_name || mockUserData.college_name,
        degree: user.degree || mockUserData.degree,
        branch: user.branch || mockUserData.branch,
        year_of_study: user.year_of_study || mockUserData.year_of_study,
        cgpa: user.cgpa || mockUserData.cgpa,
        linkedin_url: user.linkedin_url || mockUserData.linkedin_url,
        github_url: user.github_url || mockUserData.github_url,
        portfolio_url: user.portfolio_url || mockUserData.portfolio_url,
      });
    } else {
      // Use mock data when no user is available
      setProfileData(mockUserData);
    }
    fetchNotificationSettings();
  }, [user]);

  const fetchNotificationSettings = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockNotificationSettings = {
          email_notifications: true,
          sms_notifications: false,
          marketing_emails: true,
          assignment_reminders: true,
          payment_updates: true,
        };
        setNotificationSettings(mockNotificationSettings);
      }, 500);

      // Uncomment this for real API integration
      // const response = await api.get("/user/notification-settings");
      // setNotificationSettings(response.data.data || notificationSettings);
    } catch (error) {
      console.error("Failed to fetch notification settings:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call with mock success
      setTimeout(() => {
        // Mock successful update
        if (updateUser) {
          updateUser({ ...user, ...profileData });
        }
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        setLoading(false);
      }, 1000);

      // Uncomment this for real API integration
      // const response = await api.put("/user/profile", profileData);
      // updateUser(response.data.data.user);
      // setMessage("Profile updated successfully!");
      // setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
      console.error("Profile update error:", error);
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage("New passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await api.put("/user/change-password", passwordData);
      setMessage("Password updated successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update password");
      console.error("Password update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await api.put("/user/notification-settings", notificationSettings);
      setMessage("Notification settings updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update notification settings");
      console.error("Notification update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: UserCircle },
    { id: "academic", label: "Academic Details", icon: School },
    { id: "links", label: "Social Links", icon: LinkIcon },
    { id: "security", label: "Security", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-blue-600" />
                Profile Settings
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("successfully") || message.includes("updated")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {message.includes("successfully") ||
                message.includes("updated") ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav
              className="flex flex-wrap sm:flex-nowrap overflow-x-auto -mb-px"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-3 px-4 sm:px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {profileData.first_name?.charAt(0) ||
                            user?.email?.charAt(0) ||
                            "U"}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            first_name: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        value={profileData.last_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            last_name: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_of_birth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="date_of_birth"
                        value={profileData.date_of_birth}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            date_of_birth: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={profileData.gender}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            gender: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            city: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={profileData.state}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            state: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        PIN Code
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        value={profileData.pincode}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            pincode: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={profileData.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            country: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="college_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        College/University Name
                      </label>
                      <input
                        type="text"
                        id="college_name"
                        value={profileData.college_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            college_name: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="degree"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Degree
                      </label>
                      <input
                        type="text"
                        id="degree"
                        value={profileData.degree}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            degree: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="e.g., B.Tech, B.E., M.Tech"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="branch"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Branch/Specialization
                      </label>
                      <input
                        type="text"
                        id="branch"
                        value={profileData.branch}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            branch: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="e.g., Computer Science, IT"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="year_of_study"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Year of Study
                      </label>
                      <select
                        id="year_of_study"
                        value={profileData.year_of_study}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            year_of_study: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="cgpa"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CGPA/Percentage
                      </label>
                      <input
                        type="number"
                        id="cgpa"
                        step="0.01"
                        min="0"
                        max="10"
                        value={profileData.cgpa}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            cgpa: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="e.g., 8.5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        htmlFor="linkedin_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        id="linkedin_url"
                        value={profileData.linkedin_url}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            linkedin_url: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="github_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        id="github_url"
                        value={profileData.github_url}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            github_url: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="portfolio_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Portfolio Website
                      </label>
                      <input
                        type="url"
                        id="portfolio_url"
                        value={profileData.portfolio_url}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            portfolio_url: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Academic Details Tab */}
            {activeTab === "academic" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <School className="h-5 w-5 mr-2 text-blue-600" />
                    Academic Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Provide your educational background and current academic
                    status.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="college_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        College/University Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          id="college_name"
                          value={profileData.college_name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              college_name: e.target.value,
                            })
                          }
                          className="input-field pl-10"
                          placeholder="Enter your college name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="degree"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Degree
                      </label>
                      <select
                        id="degree"
                        value={profileData.degree}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            degree: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Degree</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.E">B.E</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="BCA">BCA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="M.E">M.E</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="branch"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Branch/Specialization
                      </label>
                      <input
                        type="text"
                        id="branch"
                        value={profileData.branch}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            branch: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="e.g., Computer Science, Information Technology"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="year_of_study"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Year of Study
                      </label>
                      <select
                        id="year_of_study"
                        value={profileData.year_of_study}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            year_of_study: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label
                        htmlFor="cgpa"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CGPA/Percentage
                      </label>
                      <input
                        type="text"
                        id="cgpa"
                        value={profileData.cgpa}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            cgpa: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="e.g., 8.5 CGPA or 85%"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {loading ? "Saving..." : "Save Academic Details"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Social Links Tab */}
            {activeTab === "links" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Social & Professional Links
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your professional profiles to showcase your work and
                    experience.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="linkedin_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          id="linkedin_url"
                          value={profileData.linkedin_url}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              linkedin_url: e.target.value,
                            })
                          }
                          className="input-field pl-10"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Share your professional network and experience
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="github_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        GitHub Profile
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          id="github_url"
                          value={profileData.github_url}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              github_url: e.target.value,
                            })
                          }
                          className="input-field pl-10"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Showcase your coding projects and contributions
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="portfolio_url"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Portfolio Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          id="portfolio_url"
                          value={profileData.portfolio_url}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              portfolio_url: e.target.value,
                            })
                          }
                          className="input-field pl-10"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Display your work, projects, and achievements
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Why add social links?
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>
                        • Helps employers and mentors understand your background
                      </li>
                      <li>
                        • Increases visibility for internship and job
                        opportunities
                      </li>
                      <li>
                        • Enables networking with other students and
                        professionals
                      </li>
                      <li>• Showcases your projects and technical skills</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Links"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <label
                        htmlFor="current_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="current_password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              current_password: e.target.value,
                            })
                          }
                          className="input-field pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="new_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirm_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm_password: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                        minLength={8}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Enable 2FA
                        </h4>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="btn-secondary text-sm">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getNotificationDescription(key)}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  [key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">
                            Data Usage
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            We use your data to provide personalized learning
                            experiences and track your progress.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <Trash2 className="h-5 w-5 text-red-400" />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-red-800">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 mt-1">
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                          </p>
                          <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getNotificationDescription = (key) => {
  const descriptions = {
    email_notifications: "Receive important updates via email",
    sms_notifications: "Get text messages for urgent notifications",
    marketing_emails: "Receive promotional emails about new courses",
    assignment_reminders: "Get reminders about upcoming assignment deadlines",
    payment_updates: "Receive notifications about payment status",
  };
  return descriptions[key] || "";
};

export default ProfileSettings;
