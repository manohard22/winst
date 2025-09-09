import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  CreditCard,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Receipt,
  Filter,
  FileText,
} from "lucide-react";
import api from "../services/api";
import jsPDF from "jspdf";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  // Mock payment data for demonstration
  const mockPayments = [
    {
      id: "pay_001",
      amount: 15999,
      status: "paid",
      created_at: "2024-12-15T10:30:00Z",
      payment_method: "Credit Card",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_001_ABC123",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-001",
        program: {
          title: "Full Stack Web Development Bootcamp",
          description: "Complete MERN Stack Development Course",
        },
      },
    },
    {
      id: "pay_002",
      amount: 12999,
      status: "paid",
      created_at: "2024-11-20T14:15:00Z",
      payment_method: "UPI",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_002_DEF456",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-002",
        program: {
          title: "React Native Mobile Development",
          description: "Build iOS and Android apps with React Native",
        },
      },
    },
    {
      id: "pay_003",
      amount: 8999,
      status: "pending",
      created_at: "2024-12-28T09:45:00Z",
      payment_method: "Net Banking",
      payment_gateway: "Payu",
      gateway_transaction_id: "payu_003_GHI789",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-003",
        program: {
          title: "Data Science with Python",
          description: "Complete Data Science and Machine Learning Course",
        },
      },
    },
    {
      id: "pay_004",
      amount: 18999,
      status: "failed",
      created_at: "2024-12-25T16:20:00Z",
      payment_method: "Credit Card",
      payment_gateway: "Stripe",
      gateway_transaction_id: "str_004_JKL012",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-004",
        program: {
          title: "DevOps and Cloud Computing Mastery",
          description: "AWS, Docker, Kubernetes and CI/CD Pipeline",
        },
      },
    },
    {
      id: "pay_005",
      amount: 25999,
      status: "refunded",
      created_at: "2024-10-10T11:30:00Z",
      payment_method: "Debit Card",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_005_MNO345",
      refund_amount: 25999,
      order: {
        order_number: "ORD-2024-005",
        program: {
          title: "Advanced AI & Machine Learning",
          description: "Deep Learning, Neural Networks, and AI Applications",
        },
      },
    },
    {
      id: "pay_006",
      amount: 9999,
      status: "paid",
      created_at: "2024-09-15T13:45:00Z",
      payment_method: "UPI",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_006_PQR678",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-006",
        program: {
          title: "Digital Marketing & SEO Specialist",
          description: "Complete Digital Marketing Course with Certifications",
        },
      },
    },
    {
      id: "pay_007",
      amount: 14999,
      status: "paid",
      created_at: "2024-08-22T15:10:00Z",
      payment_method: "Credit Card",
      payment_gateway: "Payu",
      gateway_transaction_id: "payu_007_STU901",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-007",
        program: {
          title: "Cybersecurity Professional Course",
          description: "Ethical Hacking, Network Security, and Compliance",
        },
      },
    },
    {
      id: "pay_008",
      amount: 11999,
      status: "cancelled",
      created_at: "2024-12-30T08:20:00Z",
      payment_method: "Net Banking",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_008_VWX234",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-008",
        program: {
          title: "UI/UX Design Masterclass",
          description: "Complete Design Course with Industry Projects",
        },
      },
    },
    {
      id: "pay_009",
      amount: 16999,
      status: "paid",
      created_at: "2024-07-18T12:35:00Z",
      payment_method: "UPI",
      payment_gateway: "Stripe",
      gateway_transaction_id: "str_009_YZA567",
      refund_amount: 0,
      order: {
        order_number: "ORD-2024-009",
        program: {
          title: "Blockchain Development Bootcamp",
          description: "Smart Contracts, DApps, and Cryptocurrency Development",
        },
      },
    },
    {
      id: "pay_010",
      amount: 13999,
      status: "pending",
      created_at: "2025-01-02T10:15:00Z",
      payment_method: "Credit Card",
      payment_gateway: "Razorpay",
      gateway_transaction_id: "rzp_010_BCD890",
      refund_amount: 0,
      order: {
        order_number: "ORD-2025-001",
        program: {
          title: "Game Development with Unity",
          description: "2D/3D Game Development and Mobile Game Publishing",
        },
      },
    },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setPayments(mockPayments);
        setLoading(false);
      }, 1000);

      // Uncomment this for real API integration
      // const response = await api.get("/student/payments");
      // setPayments(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch payment history");
      console.error("Error fetching payments:", err);
    } finally {
      // setLoading(false); // Moved to setTimeout for mock data
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "refunded":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const filteredPayments = payments
    .filter(
      (payment) => filterStatus === "all" || payment.status === filterStatus
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date_asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "amount_desc":
          return b.amount - a.amount;
        case "amount_asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const downloadInvoice = async (paymentId) => {
    try {
      // Find the payment data
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return;

      // Show loading notification
      const originalText = "Generating invoice PDF...";

      // Create PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Colors
      const primaryColor = [59, 130, 246]; // Blue
      const textColor = [31, 41, 55]; // Gray-800
      const lightGray = [156, 163, 175]; // Gray-400

      // Header with logo and company info
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 40, "F");

      // Company name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont(undefined, "bold");
      pdf.text("LUCRO", 20, 25);

      // Invoice title
      pdf.setFontSize(14);
      pdf.setFont(undefined, "normal");
      pdf.text("PAYMENT INVOICE", pageWidth - 20, 20, { align: "right" });
      pdf.text("Learning Platform", pageWidth - 20, 30, { align: "right" });

      // Invoice details section
      pdf.setTextColor(...textColor);
      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text("Invoice Details", 20, 60);

      // Draw line under heading
      pdf.setDrawColor(...lightGray);
      pdf.line(20, 65, pageWidth - 20, 65);

      // Invoice information
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");

      let yPosition = 80;
      const lineHeight = 6;

      // Left column
      pdf.setFont(undefined, "bold");
      pdf.text("Invoice Number:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.text(payment.order.order_number, 80, yPosition);

      yPosition += lineHeight;
      pdf.setFont(undefined, "bold");
      pdf.text("Transaction ID:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.text(payment.gateway_transaction_id, 80, yPosition);

      yPosition += lineHeight;
      pdf.setFont(undefined, "bold");
      pdf.text("Date:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.text(
        new Date(payment.created_at).toLocaleDateString("en-IN"),
        80,
        yPosition
      );

      yPosition += lineHeight;
      pdf.setFont(undefined, "bold");
      pdf.text("Payment Method:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.text(payment.payment_method, 80, yPosition);

      yPosition += lineHeight;
      pdf.setFont(undefined, "bold");
      pdf.text("Gateway:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.text(payment.payment_gateway, 80, yPosition);

      yPosition += lineHeight;
      pdf.setFont(undefined, "bold");
      pdf.text("Status:", 20, yPosition);
      pdf.setFont(undefined, "normal");
      pdf.setTextColor(34, 197, 94); // Green for paid status
      pdf.text(payment.status.toUpperCase(), 80, yPosition);
      pdf.setTextColor(...textColor);

      // Program details section
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text("Program Details", 20, yPosition);

      // Draw line
      pdf.setDrawColor(...lightGray);
      pdf.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);

      yPosition += 15;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "bold");
      pdf.text("Program Name:", 20, yPosition);
      pdf.setFont(undefined, "normal");

      // Handle long program titles with text wrapping
      const programTitle = payment.order.program.title;
      const maxWidth = pageWidth - 100;
      const lines = pdf.splitTextToSize(programTitle, maxWidth);
      pdf.text(lines, 80, yPosition);

      yPosition += lineHeight * lines.length;
      if (payment.order.program.description) {
        pdf.setFont(undefined, "bold");
        pdf.text("Description:", 20, yPosition);
        pdf.setFont(undefined, "normal");
        const descLines = pdf.splitTextToSize(
          payment.order.program.description,
          maxWidth
        );
        pdf.text(descLines, 80, yPosition);
        yPosition += lineHeight * descLines.length;
      }

      // Payment summary section
      yPosition += 20;
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(20, yPosition - 5, pageWidth - 40, 30, "F");

      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text("Payment Summary", 25, yPosition + 5);

      // Amount details
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Total Amount:", 25, yPosition);
      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.text(
        `₹${payment.amount.toLocaleString("en-IN")}`,
        pageWidth - 25,
        yPosition,
        { align: "right" }
      );
      pdf.setTextColor(...textColor);

      // Customer information (if available)
      if (user) {
        yPosition += 30;
        pdf.setFontSize(16);
        pdf.setFont(undefined, "bold");
        pdf.text("Customer Information", 20, yPosition);

        pdf.setDrawColor(...lightGray);
        pdf.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);

        yPosition += 15;
        pdf.setFontSize(10);
        pdf.setFont(undefined, "bold");
        pdf.text("Name:", 20, yPosition);
        pdf.setFont(undefined, "normal");
        pdf.text(
          `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
          80,
          yPosition
        );

        yPosition += lineHeight;
        pdf.setFont(undefined, "bold");
        pdf.text("Email:", 20, yPosition);
        pdf.setFont(undefined, "normal");
        pdf.text(user.email || "N/A", 80, yPosition);
      }

      // Footer
      const footerY = pageHeight - 30;
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, footerY, pageWidth, 30, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(
        "Thank you for choosing Winst Learning Platform!",
        pageWidth / 2,
        footerY + 10,
        { align: "center" }
      );
      pdf.text(
        "For support, contact: support@lucro.com | Visit: www.lucro.com",
        pageWidth / 2,
        footerY + 20,
        { align: "center" }
      );

      // Download PDF
      const fileName = `lucro-invoice-${payment.order.order_number}.pdf`;
      pdf.save(fileName);

      // Show success message
      alert(`Invoice PDF downloaded successfully: ${fileName}`);

      // Uncomment this for real API integration
      // const response = await api.get(`/student/payments/${paymentId}/receipt`, {
      //   responseType: "blob",
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", `invoice-${payment.order.order_number}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-20"></div>
              ))}
            </div>
            <div className="bg-white rounded-lg h-96"></div>
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
            Payment History
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            View and manage all your payment transactions
          </p>
        </div>

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

        {/* Filters and Sorting - only show if there are payments */}
        {payments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <label
                    htmlFor="status-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status:
                  </label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label
                  htmlFor="sort-by"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort by:
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date_desc">Date (Newest First)</option>
                  <option value="date_asc">Date (Oldest First)</option>
                  <option value="amount_desc">Amount (High to Low)</option>
                  <option value="amount_asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary Cards - only show if there are payments */}
        {payments.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {formatAmount(
                      payments
                        .filter(
                          (p) => p.status === "success" || p.status === "paid"
                        )
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Total Paid</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {payments.length}
                  </p>
                  <p className="text-xs text-gray-500">Transactions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {payments.filter((p) => p.status === "pending").length}
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-3 w-3 sm:h-5 sm:w-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {
                      payments.filter(
                        (p) => p.status === "failed" || p.status === "cancelled"
                      ).length
                    }
                  </p>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <CreditCard className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {payments.length === 0
                  ? "No Payment History"
                  : "No Payments Found"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                {payments.length === 0
                  ? "You haven't made any payments yet. Enroll in a program to get started with your learning journey!"
                  : `No payments found for the selected filter "${filterStatus}". Try adjusting your search criteria.`}
              </p>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
                {payments.length === 0 ? (
                  <>
                    <a
                      href="/programs"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Browse Programs
                    </a>
                    <a
                      href="/about"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      Learn More
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => setFilterStatus("all")}
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {payment.order?.program?.title || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.gateway_transaction_id || payment.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatAmount(payment.amount)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.created_at)}
                      </p>
                      <div className="flex items-center space-x-2">
                        {(payment.status === "success" ||
                          payment.status === "paid") && (
                          <button
                            onClick={() => downloadInvoice(payment.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Download Invoice PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.gateway_transaction_id || payment.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.payment_method} •{" "}
                              {payment.payment_gateway}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.order?.program?.title || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order #{payment.order?.order_number}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(payment.amount)}
                        </div>
                        {payment.refund_amount > 0 && (
                          <div className="text-sm text-blue-600">
                            Refund: {formatAmount(payment.refund_amount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {(payment.status === "success" ||
                            payment.status === "paid") && (
                            <button
                              onClick={() => downloadInvoice(payment.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Download Invoice PDF"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
