import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Layout from '@/components/layout/Layout/Layout'
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'
import VerifyOTP from '@/pages/VerifyOTP/VerifyOTP'
import SendOTP from '@/pages/SendOTP/SendOTP'
import VerifyOTPPassword from '@/pages/VerifyOTPPassword/VerifyOTPPassword'
import ChangePassword from '@/pages/ChangePassword/ChangePassword'
import Dashboard from '@/pages/Dashboard/Dashboard'
import ClusterFocus from '@/pages/ClusterFocus/ClusterFocus'
import Chat from '@/pages/Chat/Chat'

function AppRoutes() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken")
    return !!token
  })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken")
      setIsAuthenticated(!!token)
    }

    checkAuth()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
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
  }, [location.pathname])

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/cluster/:clusterId" element={<ClusterFocus />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
