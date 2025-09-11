import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Database,
  Globe,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Download,
  Trash2,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showProgress: true,
    showCertificates: true,
    allowDataAnalytics: true,
    allowMarketingEmails: false,
    allowNotifications: true,
    shareDataWithPartners: false,
  });

  const sections = [
    { id: "overview", title: "Privacy Overview", icon: Shield },
    { id: "data-collection", title: "Data Collection", icon: Database },
    { id: "privacy-controls", title: "Privacy Controls", icon: Settings },
    { id: "data-rights", title: "Your Rights", icon: Key },
    { id: "security", title: "Security", icon: Lock },
  ];

  const handleSettingChange = (setting, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const exportData = () => {
    // Simulate data export
    alert(
      "Your data export request has been submitted. You will receive a download link via email within 48 hours."
    );
  };

  const deleteAccount = () => {
    // Simulate account deletion request
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert(
        "Account deletion request submitted. Our team will process your request within 30 days."
      );
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Privacy Statement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Your Privacy Matters
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              We are committed to protecting your privacy and being transparent
              about how we collect, use, and share your information. This page
              provides you with comprehensive control over your privacy settings
              and data.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Privacy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Protection</div>
              <div className="font-semibold text-gray-900">GDPR Compliant</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Encryption</div>
              <div className="font-semibold text-gray-900">256-bit SSL</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Retention</div>
              <div className="font-semibold text-gray-900">User Controlled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Our Privacy Principles
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Transparency",
              description:
                "We clearly explain what data we collect and how we use it",
              icon: Eye,
            },
            {
              title: "Control",
              description:
                "You have full control over your privacy settings and data",
              icon: Settings,
            },
            {
              title: "Security",
              description:
                "Your data is protected with industry-standard security measures",
              icon: Lock,
            },
            {
              title: "Minimal Collection",
              description:
                "We only collect data that's necessary for our services",
              icon: Database,
            },
          ].map((principle, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <principle.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{principle.title}</h4>
                <p className="text-sm text-gray-600">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataCollection = () => (
    <div className="space-y-6">
      {/* Information We Collect */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          Information We Collect
        </h3>

        <div className="space-y-6">
          {[
            {
              category: "Account Information",
              icon: Users,
              items: [
                "Name and email address",
                "Profile picture (optional)",
                "Educational background",
                "Professional experience",
                "Contact preferences",
              ],
            },
            {
              category: "Learning Data",
              icon: CheckCircle,
              items: [
                "Course enrollments and progress",
                "Task submissions and scores",
                "Assessment results",
                "Certificates earned",
                "Learning time and patterns",
              ],
            },
            {
              category: "Technical Information",
              icon: Globe,
              items: [
                "IP address and device information",
                "Browser type and version",
                "Operating system",
                "Usage analytics",
                "Performance metrics",
              ],
            },
            {
              category: "Communication Data",
              icon: Mail,
              items: [
                "Messages with instructors",
                "Support ticket history",
                "Feedback and surveys",
                "Notification preferences",
              ],
            },
          ].map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <category.icon className="h-4 w-4 mr-2 text-gray-600" />
                {category.category}
              </h4>
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How We Use Your Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How We Use Your Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Provide and improve our educational services",
            "Track your learning progress and achievements",
            "Personalize your learning experience",
            "Send important updates and notifications",
            "Provide customer support",
            "Analyze platform usage and performance",
            "Ensure platform security and prevent fraud",
            "Comply with legal requirements",
          ].map((use, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{use}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Data Sharing
        </h3>
        <div className="text-sm text-yellow-800 space-y-2">
          <p>
            <strong>We DO NOT sell your personal data.</strong>
          </p>
          <p>We may share limited data with:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Trusted partners who help us provide services (with strict
              agreements)
            </li>
            <li>
              Employers when you complete their sponsored programs (with your
              consent)
            </li>
            <li>Law enforcement when required by law</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPrivacyControls = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Privacy Settings
        </h3>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Profile Visibility
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Control who can see your profile information
            </p>
            <div className="space-y-2">
              {[
                { value: "public", label: "Public - Visible to everyone" },
                {
                  value: "students",
                  label: "Students Only - Visible to other students",
                },
                { value: "private", label: "Private - Only visible to you" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={privacySettings.profileVisibility === option.value}
                    onChange={(e) =>
                      handleSettingChange("profileVisibility", e.target.value)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Contact Information
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Choose what contact information to display
            </p>
            <div className="space-y-3">
              {[
                { key: "showEmail", label: "Show email address", icon: Mail },
                { key: "showPhone", label: "Show phone number", icon: Phone },
              ].map((setting) => (
                <label
                  key={setting.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <setting.icon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">
                      {setting.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings[setting.key]}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Learning Progress
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Control visibility of your learning achievements
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "showProgress",
                  label: "Show course progress",
                  icon: CheckCircle,
                },
                {
                  key: "showCertificates",
                  label: "Show earned certificates",
                  icon: CheckCircle,
                },
              ].map((setting) => (
                <label
                  key={setting.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <setting.icon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">
                      {setting.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings[setting.key]}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Data Usage */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Data Usage Preferences
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Control how we use your data
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "allowDataAnalytics",
                  label: "Allow anonymous analytics",
                  description:
                    "Help us improve the platform with anonymous usage data",
                  icon: Database,
                },
                {
                  key: "allowMarketingEmails",
                  label: "Receive marketing emails",
                  description: "Get updates about new courses and features",
                  icon: Mail,
                },
                {
                  key: "allowNotifications",
                  label: "Allow notifications",
                  description: "Receive important updates about your courses",
                  icon: CheckCircle,
                },
                {
                  key: "shareDataWithPartners",
                  label: "Share data with partners",
                  description:
                    "Allow sharing with hiring partners for job opportunities",
                  icon: Users,
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-start justify-between"
                >
                  <div className="flex items-start">
                    <setting.icon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-700 block">
                        {setting.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {setting.description}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings[setting.key]}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataRights = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="h-5 w-5 mr-2 text-blue-600" />
          Your Data Rights
        </h3>

        <div className="space-y-6">
          {[
            {
              title: "Access Your Data",
              description: "Request a copy of all the data we have about you",
              action: "Download My Data",
              onClick: exportData,
              icon: Download,
            },
            {
              title: "Correct Your Data",
              description: "Update or correct any inaccurate information",
              action: "Edit Profile",
              onClick: () => window.open("/settings", "_blank"),
              icon: Settings,
            },
            {
              title: "Delete Your Data",
              description:
                "Request deletion of your account and all associated data",
              action: "Delete Account",
              onClick: deleteAccount,
              icon: Trash2,
              danger: true,
            },
          ].map((right, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg mr-3 ${
                      right.danger ? "bg-red-100" : "bg-blue-100"
                    }`}
                  >
                    <right.icon
                      className={`h-4 w-4 ${
                        right.danger ? "text-red-600" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{right.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {right.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={right.onClick}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    right.danger
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {right.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact for Privacy Issues */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-2">
          Questions About Your Privacy?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          If you have any questions about your privacy rights or how we handle
          your data, please contact our privacy team.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="mailto:privacy@winst.com"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Privacy Team
          </a>
          <a
            href="/privacy-policy"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Read Full Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-blue-600" />
          Security Measures
        </h3>

        <div className="space-y-6">
          {[
            {
              title: "Data Encryption",
              description:
                "All data is encrypted in transit and at rest using industry-standard AES-256 encryption",
              icon: Lock,
              status: "Active",
            },
            {
              title: "Secure Authentication",
              description:
                "Multi-factor authentication available for enhanced account security",
              icon: Key,
              status: "Available",
            },
            {
              title: "Regular Security Audits",
              description:
                "Our systems undergo regular security assessments and penetration testing",
              icon: Shield,
              status: "Ongoing",
            },
            {
              title: "SOC 2 Compliance",
              description:
                "We maintain SOC 2 Type II certification for data security and availability",
              icon: CheckCircle,
              status: "Certified",
            },
          ].map((measure, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <measure.icon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{measure.title}</h4>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {measure.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {measure.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Security Tips for You
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            Use a strong, unique password for your account
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            Enable two-factor authentication if available
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            Keep your browser and devices updated
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            Log out when using shared or public computers
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            Report any suspicious activity immediately
          </li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "data-collection":
        return renderDataCollection();
      case "privacy-controls":
        return renderPrivacyControls();
      case "data-rights":
        return renderDataRights();
      case "security":
        return renderSecurity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-blue-600" />
                Privacy Center
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Manage your privacy settings and understand how we protect your
                data
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
