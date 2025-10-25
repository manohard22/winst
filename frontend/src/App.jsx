import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Programs from "./pages/Programs";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import HelpCenter from "./pages/support/HelpCenter";
import StudentSupport from "./pages/support/StudentSupport";
import EmployerSupport from "./pages/support/EmployerSupport";
import Community from "./pages/Community";
import FAQ from "./pages/FAQ";
import ProgramDetail from "./pages/ProgramDetail";
import Dashboard from "./pages/Dashboard";
import MyEnrollments from "./pages/MyEnrollments";
import MyCertificates from "./pages/MyCertificates";
import CertificateVerification from "./pages/CertificateVerification";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import PaymentHistory from "./pages/PaymentHistory";
import Assessment from "./pages/Assessment";
import ProjectSubmissionEnhanced from './pages/ProjectSubmissionEnhanced';
import Referrals from "./pages/Referrals";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/verify/:verificationCode" element={<CertificateVerification />} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Support Pages */}
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/student-support" element={<StudentSupport />} />
          <Route path="/employer-support" element={<EmployerSupport />} />

          {/* Other Pages */}
          <Route path="/community" element={<Community />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrollments"
            element={
              <ProtectedRoute role="student">
                <MyEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute role="student">
                <MyEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-certificates"
            element={
              <ProtectedRoute role="student">
                <MyCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:programId"
            element={
              <ProtectedRoute role="student">
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/:programId"
            element={
              <ProtectedRoute role="student">
                <Assessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/:programId/project"
            element={
              <ProtectedRoute role="student">
                <ProjectSubmissionEnhanced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute role="student">
                <Referrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute role="student">
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute role="student">
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
