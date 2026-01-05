import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Activity, ArrowLeft, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"

const VerifyOTP = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  
  const [formData, setFormData] = useState({
    otp: ""
  })
  const [errors, setErrors] = useState({
    otp: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if email is not provided
  useEffect(() => {
    if (!email) {
      navigate("/send-otp")
    }
  }, [email, navigate])

  const validateOTP = (otp: string): boolean => {
    // OTP should be numeric and typically 4-6 digits
    const otpRegex = /^\d{4,6}$/
    return otpRegex.test(otp)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "")
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
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
    
    if (name === "otp" && value && !validateOTP(value)) {
      setErrors(prev => ({
        ...prev,
        otp: "OTP must be 4-6 digits"
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      otp: ""
    }
    
    let isValid = true
    
    if (!formData.otp) {
      newErrors.otp = "OTP is required"
      isValid = false
    } else if (!validateOTP(formData.otp)) {
      newErrors.otp = "OTP must be 4-6 digits"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (isValid) {
      setIsSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // Navigate to login or reset password page after successful verification
        navigate("/login")
      }, 1000)
    }
  }

  if (!email) {
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
                Verify OTP
              </h1>
            </div>
            <p className="text-muted-foreground text-base text-center">
              Enter the verification code sent to
            </p>
            <p className="text-foreground text-base text-center font-semibold mt-1">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Field */}
            <div className="space-y-2">
              <label 
                htmlFor="otp" 
                className="block text-sm font-semibold text-foreground"
              >
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Shield className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    errors.otp ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={6}
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-lg border bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 placeholder:text-muted-foreground/60",
                    "text-center text-2xl font-mono tracking-widest",
                    errors.otp 
                      ? "border-destructive focus:ring-destructive/50 focus:border-destructive" 
                      : "border-input hover:border-primary/30"
                  )}
                  placeholder="000000"
                />
              </div>
              {errors.otp && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span className="text-xs">•</span>
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              text={isSubmitting ? "Verifying..." : "Verify OTP"}
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
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Link
                  to={`/send-otp?email=${encodeURIComponent(email)}`}
                  className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Resend OTP
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Back to Send OTP Link */}
            <div className="text-center">
              <Link
                to={`/send-otp?email=${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Send OTP
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP

