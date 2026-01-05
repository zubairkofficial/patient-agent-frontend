import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Lock, Activity, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"

const ChangePassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const otp = searchParams.get("otp") || ""
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect if email or otp is not provided
  useEffect(() => {
    if (!email || !otp) {
      navigate("/send-otp")
    }
  }, [email, otp, navigate])

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
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
    
    if (name === "password" && value && !validatePassword(value)) {
      setErrors(prev => ({
        ...prev,
        password: "Password must be at least 6 characters"
      }))
    } else if (name === "confirmPassword" && value) {
      if (formData.password !== value) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      password: "",
      confirmPassword: ""
    }
    
    let isValid = true
    
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (isValid) {
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Navigate to login after successful password change
        navigate("/login")
      }, 1000)
    }
  }

  if (!email || !otp) {
    return null // Will redirect in useEffect
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
                Change Password
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-foreground"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.password ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-12 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.password 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-semibold text-foreground"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.confirmPassword ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-12 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.confirmPassword 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              text={isSubmitting ? "Changing password..." : "Change Password"}
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
                  Changing password...
                </span>
              ) : (
                "Change Password"
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

            {/* Back to Verify OTP Link */}
            <div className="text-center">
              <Link
                to={`/verify-otp?email=${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Verify OTP
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

