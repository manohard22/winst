import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  Users,
  Gift,
  Copy,
  Mail,
  Calendar,
  CheckCircle,
  Share2,
  Trophy,
  DollarSign,
  UserPlus,
  Send,
  ExternalLink,
  Clock,
  Target,
} from "lucide-react";

const Referrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newReferralEmail, setNewReferralEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Earnings are 499 for each completed referral in this model
  const mapEarnings = (referrals) => referrals.map(r => ({
    ...r,
    earnedAmount: r.status === 'completed' ? (r.discountAmount || 499) : 0
  }));

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/referrals/my-referrals');
      setReferrals(mapEarnings(response.data.data.referrals));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
      setLoading(false);
    }
  };

  const generateReferral = async (e) => {
    e.preventDefault();
    if (!newReferralEmail) return;

    setGenerating(true);
    try {
      await api.post('/referrals/generate', { email: newReferralEmail });
      setNewReferralEmail('');
      fetchReferrals();
    } catch (error) {
      console.error("Failed to generate referral:", error);
      setGenerating(false);
    }
  };

  const copyReferralCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = (referral) => {
    const shareData = {
      title: "Join Winst and Save ₹499!",
      text: `I'm inviting you to join Winst with my referral code ${referral.referralCode} and get ₹499 off on any internship program!`,
      url: `${window.location.origin}/signup?ref=${referral.referralCode}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
  copyReferralCode(`${window.location.origin}/signup?ref=${referral.referralCode}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "expired":
        return <Target className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalEarned = referrals.reduce((sum, ref) => sum + ref.earnedAmount, 0);
  const completedReferrals = referrals.filter(
    (ref) => ref.status === "completed"
  ).length;
  const pendingReferrals = referrals.filter(
    (ref) => ref.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-32"></div>
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
            Refer Friends & Earn
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Invite friends and both get ₹499 discount on internship programs!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Earned
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  ₹{totalEarned}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Successful
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {completedReferrals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Pending
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {pendingReferrals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Referrals
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {referrals.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 border border-blue-200 mb-6 sm:mb-8">
          <div className="flex items-center mb-6">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
              How Referrals Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                1. Invite Friends
              </h3>
              <p className="text-sm text-blue-700">
                Share your unique referral code with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">
                2. They Save Money
              </h3>
              <p className="text-sm text-purple-700">
                Your friends get ₹499 discount on their first enrollment
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-2">
                3. You Earn Credits
              </h3>
              <p className="text-sm text-green-700">
                Earn ₹499 credit for each successful referral
              </p>
            </div>
          </div>
        </div>

        {/* Generate New Referral */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center mb-6">
            <Send className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-3" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Generate New Referral
            </h2>
          </div>
          <form onSubmit={generateReferral} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Friend's Email Address
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your friend's email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={newReferralEmail}
                  onChange={(e) => setNewReferralEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Generate Code
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Your Referrals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-3" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Your Referrals ({referrals.length})
              </h2>
            </div>
          </div>

          {referrals.length > 0 ? (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left Side - User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {referral.referredEmail.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {referral.referredEmail}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                referral.status
                              )}`}
                            >
                              {getStatusIcon(referral.status)}
                              <span className="ml-1">
                                {referral.status.toUpperCase()}
                              </span>
                            </span>
                            {referral.status === "completed" && (
                              <span className="text-xs text-green-600 font-medium">
                                +₹{referral.earnedAmount} earned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            Created:{" "}
                            {new Date(referral.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Discount: ₹{referral.discountAmount}</span>
                        </div>
                        {referral.usedAt && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>
                              Used:{" "}
                              {new Date(referral.usedAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {referral.referredUser && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">
                            🎉{" "}
                            <strong>
                              {referral.referredUser.firstName}{" "}
                              {referral.referredUser.lastName}
                            </strong>{" "}
                            has joined using your referral!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:ml-6">
                      <div className="bg-gray-100 px-3 py-2 rounded-md">
                        <code className="text-sm font-mono text-gray-800">
                          {referral.referralCode}
                        </code>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            copyReferralCode(referral.referralCode)
                          }
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          title="Copy referral code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => shareReferral(referral)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Share referral"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <a
                          href={`https://winst.com/signup?ref=${referral.referralCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                          title="View signup link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No referrals yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                Start inviting friends to earn rewards and help them save money!
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => document.getElementById("email")?.focus()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Generate First Referral
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copy Success Message */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
