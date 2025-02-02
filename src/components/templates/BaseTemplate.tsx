import type { ReactNode } from "react"

interface BaseTemplateProps {
  children: ReactNode
  className?: string
}

export function BaseTemplate({ children, className = "" }: BaseTemplateProps) {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  )
}

