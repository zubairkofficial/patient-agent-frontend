import * as React from "react"
import type { LucideIcon } from "lucide-react"

export type CardProps = React.PropsWithChildren<{
  icon?: LucideIcon
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  headerRight?: React.ReactNode
  className?: string
}>

