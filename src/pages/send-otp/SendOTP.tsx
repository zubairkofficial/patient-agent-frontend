import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Activity, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"

const SendOTP = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ""
  })
  const [errors, setErrors] = useState({
    email: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "email" && value && !validateEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: "Please enter a valid email address"
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      email: ""
    }
    
    let isValid = true
    
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (isValid) {
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Navigate to verify OTP page or login after successful OTP send
        // navigate("/verify-otp")
        navigate("/login")
      }, 1000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8 md:p-10 backdrop-blur-sm">
          {/* Logo and Header */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Send OTP
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">
              Enter your email address to receive a verification code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-foreground"
              >
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
                  value={formData.email}
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

            {/* Submit Button */}
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SendOTP

