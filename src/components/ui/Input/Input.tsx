import * as React from "react"
import { cn } from "@/lib/utils"
import type { InputProps } from "@/types/Input.types"

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", borderColor, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-input bg-background px-4 py-2 text-sm",
          "text-foreground placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          ...(style || {}),
          ...(borderColor ? { borderColor } : {}),
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }


