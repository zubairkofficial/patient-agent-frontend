import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type CardProps = React.PropsWithChildren<{
  icon?: LucideIcon
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  headerRight?: React.ReactNode
  className?: string
}>

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
        "w-full max-w-[320px] min-h-[200px] rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col",
        className
      )}
    >
      {(Icon || title || headerRight) && (
        <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
            {title && (
              <h3 className="text-xl font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
          </div>
          {headerRight}
        </div>
      )}

      {description && (
        <p className="px-6 text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {body && <div className="flex-1 px-6 py-4">{body}</div>}

      {footer && (
        <div className="flex items-center px-6 py-4 mt-auto border-t">
          {footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = "Card"

export { Card }

