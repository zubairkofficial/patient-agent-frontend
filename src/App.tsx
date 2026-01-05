import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout/Layout'
import Login from '@/pages/Login/Login'
import Register from '@/pages/signup/Register'
import SendOTP from '@/pages/send-otp/SendOTP'
import VerifyOTP from '@/pages/verify-otp/VerifyOTP'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/send-otp" element={<SendOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div className="m-[2vw]">
              <h1 className="text-2xl font-bold">Welcome</h1>
              <p className="text-muted-foreground mt-2">Your content goes here</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
