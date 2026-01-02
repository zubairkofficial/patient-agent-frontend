import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      email: "",
      password: ""
    }
    
    let isValid = true
    
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (isValid) {
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Navigate to dashboard/home after successful login
        navigate("/")
      }, 1000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-sm p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  "w-full h-10 px-4 rounded-md border bg-background text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "transition-all duration-200",
                  errors.email 
                    ? "border-destructive focus:ring-destructive" 
                    : "border-input"
                )}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  "w-full h-10 px-4 rounded-md border bg-background text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "transition-all duration-200",
                  errors.password 
                    ? "border-destructive focus:ring-destructive" 
                    : "border-input"
                )}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-[100%] h-10 px-4 rounded-md font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-primary"
              )}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

