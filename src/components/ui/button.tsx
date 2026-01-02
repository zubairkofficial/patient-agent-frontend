import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps {
  type?: "primary" | "secondary"
  size?: "full" | "large" | "medium"
  text: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  htmlType?: "button" | "submit" | "reset"
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  type = "primary",
  size = "medium",
  text,
  onClick,
  className,
  disabled = false,
  htmlType = "button",
  children
}) => {
  const baseClasses = "rounded-md font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const typeClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary"
  }
  
  const sizeClasses = {
    full: "w-[100%] h-10 px-4",
    large: "h-12 px-8 text-base",
    medium: "h-10 px-6 text-sm"
  }
  
  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        typeClasses[type],
        sizeClasses[size],
        className
      )}
    >
      {children || text}
    </button>
  )
}

Button.displayName = "Button"

export { Button }
