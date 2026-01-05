import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, User, Eye, EyeOff, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

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
    
    if (name === "email" && value && !validateEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: "Please enter a valid email address"
      }))
    } else if (name === "password" && value && !validatePassword(value)) {
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
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: ""
    }
    
    let isValid = true
    
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }
    
    if (!formData.firstname) {
      newErrors.firstname = "First name is required"
      isValid = false
    }
    
    if (!formData.lastname) {
      newErrors.lastname = "Last name is required"
      isValid = false
    }
    
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
        // Navigate to login after successful registration
        navigate("/login")
      }, 1000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-5 md:p-5 backdrop-blur-sm">
          {/* Logo and Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Create Account
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">Sign up to get started with Patient Agent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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

            {/* First Name Field */}
            <div className="space-y-2">
              <label 
                htmlFor="firstname" 
                className="block text-sm font-semibold text-foreground"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.firstname ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.firstname 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="Enter your first name"
                />
              </div>
              {errors.firstname && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.firstname}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label 
                htmlFor="lastname" 
                className="block text-sm font-semibold text-foreground"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.lastname ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    errors.lastname 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="Enter your last name"
                />
              </div>
              {errors.lastname && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.lastname}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-foreground"
              >
                Password
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
                  placeholder="Enter your password"
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
                  placeholder="Confirm your password"
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
              text={isSubmitting ? "Creating account..." : "Create Account"}
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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

