import React from 'react'

type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps {
  children: React.ReactNode
  padding?: CardPadding
  className?: string
  elevated?: boolean
  onClick?: () => void
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  padding = 'md',
  className = '',
  elevated = false,
  onClick,
}: CardProps) {
  const base = [
    'bg-surface-card rounded-2xl border border-cream-100',
    elevated
      ? 'shadow-[0_2px_16px_rgba(26,26,24,0.07)] bg-surface-elevated'
      : 'shadow-[0_1px_4px_rgba(26,26,24,0.05)]',
    paddingClasses[padding],
    onClick ? 'cursor-pointer hover:shadow-[0_2px_12px_rgba(26,26,24,0.10)] transition-shadow duration-200' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <div role="button" tabIndex={0} className={base} onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
        {children}
      </div>
    )
  }

  return <div className={base}>{children}</div>
}
