import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Lock, Activity, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { authService } from "@/services/Auth/auth.service"

const ChangePassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email)
      setOtp(location.state.otp)
    } else {
      navigate("/forgot-password")
    }
  }, [location, navigate])

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "newPassword" && value && !validatePassword(value)) {
      setErrors(prev => ({
        ...prev,
        newPassword: "Password must be at least 6 characters"
      }))
    } else if (name === "confirmPassword" && value && formData.newPassword !== value) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const newErrors = {
      newPassword: "",
      confirmPassword: ""
    }
    
    let isValid = true
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required"
      isValid = false
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters"
      isValid = false
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (!isValid) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await authService.changePassword({
        email: email,
        otp: otp,
        newPassword: formData.newPassword
      })
      
      if (response.success) {
        toast.success(response.message || "Password changed successfully!")
        navigate("/login")
      } else {
        toast.error(response.message || "Failed to change password. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to change password. Please try again."
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
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Reset Password
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.newPassword ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-12 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.newPassword 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="Enter new password"
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
              {errors.newPassword && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                Confirm Password
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
                  placeholder="Confirm new password"
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

            <Button
              type="primary"
              size="large"
              text={isSubmitting ? "Resetting..." : "Reset Password"}
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
                  Resetting...
                </span>
              ) : (
                "Reset Password"
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

export default ChangePassword

