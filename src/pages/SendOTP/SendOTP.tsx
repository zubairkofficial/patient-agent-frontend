import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Activity, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { authService } from "@/services/Auth/auth.service"

const SendOTP = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({
    email: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ""
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: "Please enter a valid email address"
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const newErrors = {
      email: ""
    }
    
    let isValid = true
    
    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (!isValid) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await authService.forgotPassword({
        email: email
      })
      
      if (response.success) {
        toast.success(response.message || "OTP has been sent to your email.")
        navigate("/verify-otp-password", { state: { email: email } })
      } else {
        toast.error(response.message || "Failed to send OTP. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to send OTP. Please try again."
      toast.error(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8 md:p-10 backdrop-blur-sm">
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Forgot Password
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">
              Enter your email address and we'll send you an OTP to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.email ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.email 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              type="primary"
              size="large"
              text={isSubmitting ? "Sending OTP..." : "Send OTP"}
              disabled={isSubmitting}
              htmlType="submit"
              className={cn(
                "w-full rounded-lg font-semibold",
                "shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30",
                "transform hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SendOTP

