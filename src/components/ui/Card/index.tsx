import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  dark?: boolean
}

export function Card({ children, className = '', dark = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'
      } ${className}`}
    >
      {children}
    </div>
  )
}