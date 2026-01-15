import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional CSS border color (e.g. '#ff0000' or 'red') */
  borderColor?: string
}

