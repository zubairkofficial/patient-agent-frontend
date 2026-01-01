import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardProps {
  icon: LucideIcon
  title?: string
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  content,
  footer,
  className
}) => {
  return (
    <div
      className={cn(
        "w-[300px] h-[200px] rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col",
        className
      )}
    >
      <div className="flex flex-col m-6 flex-1">
        <div className="flex items-center mb-4">
          <Icon className="h-6 w-6 mr-3 text-primary" />
          {title && (
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}
        
        {content && (
          <div className="flex-1">
            {content}
          </div>
        )}
      </div>
      
      {footer && (
        <div className="flex items-center m-6 mt-0 pt-4 border-t">
          {footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = "Card"

export { Card }

