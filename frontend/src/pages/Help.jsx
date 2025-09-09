import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Users,
  Video,
  FileText,
  CheckCircle,
  ExternalLink,
  Lightbulb,
  AlertCircle,
  Settings,
  Award,
  CreditCard,
  Shield,
  Smartphone,
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: "getting-started", title: "Getting Started", icon: Lightbulb },
    { id: "courses", title: "Courses & Learning", icon: BookOpen },
    { id: "account", title: "Account & Settings", icon: Settings },
    { id: "certificates", title: "Certificates", icon: Award },
    { id: "payments", title: "Payments & Billing", icon: CreditCard },
    { id: "technical", title: "Technical Issues", icon: AlertCircle },
    { id: "privacy", title: "Privacy & Security", icon: Shield },
  ];

  const faqs = {
    "getting-started": [
      {
        question: "How do I get started with Winst?",
        answer:
          "Getting started is easy! First, create your account by clicking 'Sign Up' on our homepage. Once registered, browse our available programs, choose one that interests you, and enroll. You'll immediately get access to course materials and can start learning right away.",
      },
      {
        question: "What types of programs do you offer?",
        answer:
          "We offer comprehensive internship programs in technology fields including Full Stack Web Development, Mobile App Development, Data Science, UI/UX Design, Digital Marketing, and more. Each program includes hands-on projects, mentorship, and industry-relevant skills training.",
      },
      {
        question: "How long do programs typically take?",
        answer:
          "Program duration varies depending on the complexity and your pace of learning. Most programs range from 8-16 weeks. You can learn at your own pace, and we provide estimated timelines for each module to help you plan your learning journey.",
      },
      {
        question: "Do I need any prior experience?",
        answer:
          "We offer programs for all skill levels. Beginner programs assume no prior experience, while intermediate and advanced programs have specific prerequisites listed in the program description. Check the 'Prerequisites' section before enrolling.",
      },
    ],
    courses: [
      {
        question: "How do I access my enrolled courses?",
        answer:
          "Once enrolled, go to your Dashboard and click on 'My Enrollments'. You'll see all your active programs with progress tracking, upcoming tasks, and direct access to course materials.",
      },
      {
        question: "Can I download course materials?",
        answer:
          "Yes! Most course materials including PDFs, code samples, and project templates can be downloaded for offline access. Look for the download icon next to each resource.",
      },
      {
        question: "What happens if I fall behind schedule?",
        answer:
          "Don't worry! Our programs are designed to be flexible. While we provide recommended timelines, you can learn at your own pace. If you need help catching up, reach out to your mentor or our support team.",
      },
      {
        question: "How are assignments and projects graded?",
        answer:
          "Assignments are reviewed by industry professionals and instructors. You'll receive detailed feedback within 3-5 business days. Projects are graded on functionality, code quality, documentation, and creativity.",
      },
    ],
    account: [
      {
        question: "How do I update my profile information?",
        answer:
          "Go to Settings > Profile to update your personal information, contact details, and professional background. Make sure to keep your information current for the best learning experience.",
      },
      {
        question: "How do I change my password?",
        answer:
          "In your Settings, click on 'Security' and then 'Change Password'. You'll need to enter your current password and then set a new one. We recommend using a strong, unique password.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes, you can update your email address in Settings > Profile. You'll receive a verification email at your new address to confirm the change before it takes effect.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "If you need to delete your account, go to Settings > Privacy > Your Rights and click 'Delete Account'. Please note this action is permanent and cannot be undone.",
      },
    ],
    certificates: [
      {
        question: "How do I earn a certificate?",
        answer:
          "To earn a certificate, you must complete all required modules, submit all projects with passing grades, and complete the final assessment with a score of 70% or higher.",
      },
      {
        question: "Are certificates industry-recognized?",
        answer:
          "Yes! Our certificates are recognized by 100+ partner companies and are designed based on industry standards. They validate your practical skills and project experience.",
      },
      {
        question: "How do I download my certificate?",
        answer:
          "Once earned, go to 'My Certificates' in your dashboard. Click on any certificate to view, download as PDF, or share on LinkedIn and other professional networks.",
      },
      {
        question: "Can I get a physical copy of my certificate?",
        answer:
          "Currently, we only provide digital certificates in PDF format. These are widely accepted by employers and can be easily shared or printed as needed.",
      },
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets. All transactions are processed securely through our payment partners.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Yes! We offer a 7-day money-back guarantee. If you're not satisfied within the first 7 days of enrollment, contact our support team for a full refund.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "For premium programs, we offer flexible payment plans including monthly installments. Contact our support team to discuss payment options that work for your budget.",
      },
      {
        question: "How do I get an invoice or receipt?",
        answer:
          "After successful payment, you'll automatically receive an email receipt. You can also download invoices from Settings > Payments > Transaction History.",
      },
    ],
    technical: [
      {
        question: "I can't access my course materials",
        answer:
          "Try refreshing your browser and clearing your cache. If the issue persists, check your internet connection or try accessing from a different browser. Contact support if you continue experiencing problems.",
      },
      {
        question: "The videos are not playing properly",
        answer:
          "Ensure you have a stable internet connection and try refreshing the page. Our videos work best on updated browsers. If issues persist, try disabling browser extensions or switching to a different browser.",
      },
      {
        question: "I'm having trouble submitting my project",
        answer:
          "Check that all required files are attached and file sizes are within limits (50MB max). Ensure you're using supported file formats. If the issue continues, try submitting from a different browser or device.",
      },
      {
        question: "The platform is running slowly",
        answer:
          "Clear your browser cache and cookies, close unnecessary tabs, and ensure you have a stable internet connection. If performance issues persist, try accessing the platform during off-peak hours.",
      },
    ],
    privacy: [
      {
        question: "How is my personal data protected?",
        answer:
          "We use industry-standard security measures including 256-bit SSL encryption, secure data centers, and regular security audits. Your data is never sold to third parties.",
      },
      {
        question: "Can I control what information is shared?",
        answer:
          "Absolutely! Visit Settings > Privacy to control your profile visibility, contact information sharing, and data usage preferences. You have full control over your privacy settings.",
      },
      {
        question: "How long do you keep my data?",
        answer:
          "We retain your data as long as your account is active. If you delete your account, most data is removed within 30 days, though some information may be retained for legal compliance.",
      },
      {
        question: "Who can see my learning progress?",
        answer:
          "By default, your progress is private. You can choose to share achievements publicly or with potential employers through your privacy settings. You always control what's visible.",
      },
    ],
  };

  const quickLinks = [
    {
      title: "Getting Started Guide",
      icon: BookOpen,
      url: "/help/getting-started",
    },
    { title: "Video Tutorials", icon: Video, url: "/help/tutorials" },
    { title: "Contact Support", icon: MessageCircle, url: "/help/contact" },
    { title: "Feature Requests", icon: Lightbulb, url: "/help/feedback" },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageCircle,
      available: "Mon-Fri, 9 AM - 6 PM IST",
      action: "Start Chat",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      available: "Response within 24 hours",
      action: "Send Email",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: Phone,
      available: "Mon-Fri, 10 AM - 5 PM IST",
      action: "Call Now",
    },
  ];

  const filteredFAQs =
    faqs[activeCategory]?.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <HelpCircle className="h-8 w-8 mr-3 text-blue-600" />
                Help Center
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Find answers to your questions and get the support you need
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <link.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-3" />
                    {category.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {categories.find((c) => c.id === activeCategory)?.title}
                </p>
              </div>

              <div className="p-6">
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                          {expandedFAQ === index ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === index && (
                          <div className="px-4 pb-3">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or browse different categories
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Still Need Help?
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Our support team is here to help you succeed
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactOptions.map((option, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <option.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {option.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {option.available}
                      </p>
                      <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        {option.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <a
                    href="/help/user-guide"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Complete User Guide
                    </span>
                  </a>
                  <a
                    href="/help/video-tutorials"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Video Tutorials</span>
                  </a>
                  <a
                    href="/help/community"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Community Forum</span>
                  </a>
                </div>
                <div className="space-y-3">
                  <a
                    href="/help/mobile-app"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Mobile App Guide
                    </span>
                  </a>
                  <a
                    href="/help/keyboard-shortcuts"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Keyboard Shortcuts
                    </span>
                  </a>
                  <a
                    href="/help/release-notes"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">What's New</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
