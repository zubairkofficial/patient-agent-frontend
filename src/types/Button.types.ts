import * as React from "react"

export interface ButtonProps {
  type?: "primary" | "secondary"
  size?: "full" | "large" | "medium"
  text: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  htmlType?: "button" | "submit" | "reset"
  children?: React.ReactNode
}

