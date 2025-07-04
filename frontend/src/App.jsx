import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import Dashboard from './pages/Dashboard'
import MyEnrollments from './pages/MyEnrollments'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          
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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
