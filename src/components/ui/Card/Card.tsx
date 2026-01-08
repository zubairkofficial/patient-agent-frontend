import * as React from "react"
import { cn } from "@/lib/utils"
import type { CardProps } from "@/types/Card.types"

const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  content,
  footer,
  headerRight,
  className,
  children,
}) => {
  const body = content ?? children

  return (
    <div
      className={cn(
        "w-full min-h-[180px] sm:min-h-[200px] rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col",
        "animate-fade-in-up hover:shadow-md transition-all duration-300 hover:scale-[1.02]",
        className
      )}
    >
      {(Icon || title || headerRight) && (
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />}
            {title && (
              <h3 className="text-lg sm:text-xl font-semibold leading-none tracking-tight truncate">
                {title}
              </h3>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}

      {description && (
        <p className="px-4 sm:px-6 text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {body && <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4">{body}</div>}

      {footer && (
        <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 mt-auto border-t">
          {footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = "Card"

export { Card }

