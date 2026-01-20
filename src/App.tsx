import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Layout from '@/components/layout/Layout/Layout'
import AdminLayout from '@/components/layout/AdminLayout/AdminLayout'
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'
import VerifyOTP from '@/pages/VerifyOTP/VerifyOTP'
import SendOTP from '@/pages/SendOTP/SendOTP'
import VerifyOTPPassword from '@/pages/VerifyOTPPassword/VerifyOTPPassword'
import ChangePassword from '@/pages/ChangePassword/ChangePassword'
import Dashboard from '@/pages/Users/Dashboard/Dashboard'
import ClusterFocus from '@/pages/Users/Cluster/Cluster'
import Chat from '@/pages/Users/Chats/Chat'
import Symptoms from '@/pages/Admin/Symptoms/Symptoms'
import DiagnosisPage from '@/pages/Admin/Diagnosis/Diagnosis'
import SeverityScaleAdmin from '@/pages/Admin/SeverityScale/SeverityScale'
import Treatments from '@/pages/Admin/Treatments/Treatments'
import { authService } from '@/services/Auth/auth.service'

function AppRoutes() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken")
    return !!token
  })
  const [isAdmin, setIsAdmin] = useState(() => {
    return authService.isAdmin()
  })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken")
      setIsAuthenticated(!!token)
      setIsAdmin(authService.isAdmin())
    }

    checkAuth()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "userRole") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsAuthenticated(!!token)
    setIsAdmin(authService.isAdmin())
  }, [location.pathname])

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          {isAdmin ? (
            // Admin routes
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/symptoms" replace />} />
              <Route path="symptoms" element={<Symptoms />} />
              <Route path="diagnosis" element={<DiagnosisPage />} />
              <Route path="severity-scale" element={<SeverityScaleAdmin />} />
              <Route path="treatments" element={<Treatments />} />
              <Route path="*" element={<Navigate to="/admin/symptoms" replace />} />
            </Route>
          ) : (
            // Regular user routes
            <>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/cluster/:clusterId" element={<ClusterFocus />} />
              <Route path="/chat" element={<Chat />} />
            </>
          )}
          <Route path="*" element={<Navigate to={isAdmin ? "/admin" : "/"} replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<SendOTP />} />
          <Route path="/verify-otp-password" element={<VerifyOTPPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
