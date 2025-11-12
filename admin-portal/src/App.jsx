import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Programs from './pages/Programs'
import Enrollments from './pages/Enrollments'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import LoadingSpinner from './components/LoadingSpinner'
import Referrals from './pages/Referrals'
import QuizManagement from './pages/QuizManagement'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <Routes>
        {!user || user.role !== 'admin' ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="programs" element={<Programs />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="quizzes" element={<QuizManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </>
  )
}

export default App
