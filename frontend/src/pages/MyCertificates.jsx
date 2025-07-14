import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Award,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  CheckCircle,
  Share2,
  Search,
  Filter,
  BookOpen,
} from "lucide-react";
import api from "../services/api";

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock certificate data for demonstration
  const mockCertificates = [
    {
      id: "cert_001",
      enrollmentId: "enr_002",
      programTitle: "React Native Mobile Development",
      programCode: "RN-2024",
      certificateNumber: "LUCRO-RN-2024-001523",
      issueDate: "2024-11-20T10:00:00Z",
      expiryDate: null, // Never expires
      status: "issued",
      grade: "A+",
      finalScore: 96,
      credentialUrl: "https://verify.lucro.com/cert_001",
      imageUrl: "/api/placeholder/600/400",
      mentor: {
        firstName: "Dr. Priya",
        lastName: "Nair",
      },
      skills: [
        "React Native",
        "Mobile App Development",
        "JavaScript",
        "API Integration",
        "Publishing Apps",
      ],
      verificationHash: "0x1a2b3c4d5e6f7g8h9i0j",
    },
    {
      id: "cert_002",
      enrollmentId: "enr_003",
      programTitle: "Data Science Fundamentals",
      programCode: "DS-2024",
      certificateNumber: "LUCRO-DS-2024-002156",
      issueDate: "2024-10-15T14:30:00Z",
      expiryDate: null,
      status: "issued",
      grade: "A",
      finalScore: 89,
      credentialUrl: "https://verify.lucro.com/cert_002",
      imageUrl: "/api/placeholder/600/400",
      mentor: {
        firstName: "Dr. Rajesh",
        lastName: "Kumar",
      },
      skills: [
        "Python",
        "Data Analysis",
        "Machine Learning",
        "Statistics",
        "Data Visualization",
      ],
      verificationHash: "0x2b3c4d5e6f7g8h9i0j1k",
    },
    {
      id: "cert_003",
      enrollmentId: "enr_004",
      programTitle: "Digital Marketing & SEO Mastery",
      programCode: "DM-2024",
      certificateNumber: "LUCRO-DM-2024-001887",
      issueDate: "2024-09-28T11:15:00Z",
      expiryDate: "2027-09-28T11:15:00Z", // 3 years validity
      status: "issued",
      grade: "A+",
      finalScore: 94,
      credentialUrl: "https://verify.lucro.com/cert_003",
      imageUrl: "/api/placeholder/600/400",
      mentor: {
        firstName: "Sneha",
        lastName: "Patel",
      },
      skills: [
        "SEO Optimization",
        "Google Analytics",
        "Content Marketing",
        "Social Media Marketing",
        "PPC Campaigns",
      ],
      verificationHash: "0x3c4d5e6f7g8h9i0j1k2l",
    },
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setCertificates(mockCertificates);
        setLoading(false);
      }, 800);

      // Uncomment this for real API integration
      // const response = await api.get("/student/certificates");
      // setCertificates(response.data.data?.certificates || []);
    } catch (error) {
      setError("Failed to fetch certificates");
      console.error("Failed to fetch certificates:", error);
    } finally {
      // setLoading(false); // Moved to setTimeout for mock data
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      // Simulate certificate download
      console.log(`Downloading certificate: ${certificateId}`);
      // In real implementation:
      // const response = await api.get(`/certificates/${certificateId}/download`, { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `certificate_${certificateId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      alert("Certificate download started!");
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("Failed to download certificate");
    }
  };

  const handleShare = (certificate) => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.programTitle} Certificate`,
        text: `I've completed ${certificate.programTitle} and earned a certificate!`,
        url: certificate.credentialUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(certificate.credentialUrl);
      alert("Certificate link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-blue-100 text-blue-800";
      case "B+":
        return "bg-yellow-100 text-yellow-800";
      case "B":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0; // Expiring within 90 days
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.programTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active")
      return matchesSearch && !isExpired(cert.expiryDate);
    if (filterStatus === "expiring")
      return matchesSearch && isExpiringSoon(cert.expiryDate);
    if (filterStatus === "expired")
      return matchesSearch && isExpired(cert.expiryDate);

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Certificates
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            View and manage your earned certificates and credentials
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter - only show if there are certificates */}
        {certificates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Certificates</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - only show if there are certificates */}
        {certificates.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Total
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {certificates.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Active
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {
                      certificates.filter((cert) => !isExpired(cert.expiryDate))
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Expiring
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {
                      certificates.filter((cert) =>
                        isExpiringSoon(cert.expiryDate)
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-blue-600">
                      A+
                    </span>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Avg Grade
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {certificates.length > 0
                      ? (
                          certificates.reduce((sum, cert) => {
                            const gradePoints = {
                              "A+": 4.0,
                              A: 3.7,
                              "B+": 3.3,
                              B: 3.0,
                            };
                            return sum + (gradePoints[cert.grade] || 0);
                          }, 0) / certificates.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <Award className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {certificates.length === 0
                  ? "No Certificates Yet"
                  : "No Certificates Found"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                {certificates.length === 0
                  ? "Complete your enrolled programs to earn certificates and showcase your achievements."
                  : `No certificates found matching your search criteria. Try adjusting your filters.`}
              </p>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
                {certificates.length === 0 ? (
                  <>
                    <Link
                      to="/my-enrollments"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Enrollments
                    </Link>
                    <Link
                      to="/programs"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      Browse Programs
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Certificate Image */}
                <div className="relative">
                  <img
                    src={certificate.imageUrl || "/placeholder-certificate.jpg"}
                    alt={`${certificate.programTitle} Certificate`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(
                        certificate.grade
                      )}`}
                    >
                      {certificate.grade}
                    </span>
                  </div>
                  {isExpiringSoon(certificate.expiryDate) && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Expiring Soon
                      </span>
                    </div>
                  )}
                  {isExpired(certificate.expiryDate) && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    </div>
                  )}
                </div>

                {/* Certificate Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {certificate.programTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Certificate #{certificate.certificateNumber}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(certificate.issueDate)}
                      </span>
                    </div>
                    {certificate.expiryDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span
                          className={`font-medium ${
                            isExpired(certificate.expiryDate)
                              ? "text-red-600"
                              : isExpiringSoon(certificate.expiryDate)
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {formatDate(certificate.expiryDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium text-gray-900">
                        {certificate.finalScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mentor:</span>
                      <span className="font-medium text-gray-900">
                        {certificate.mentor.firstName}{" "}
                        {certificate.mentor.lastName}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Skills Verified:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {certificate.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {certificate.skills.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">
                          +{certificate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(certificate.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
