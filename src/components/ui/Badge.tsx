type BadgeColor = 'green' | 'amber' | 'red' | 'blue' | 'sage' | 'forest'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  color?: BadgeColor
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

const colorClasses: Record<BadgeColor, string> = {
  green:  'bg-signal-green/10 text-signal-green border border-signal-green/20',
  amber:  'bg-amber-100 text-amber-600 border border-amber-400/30',
  red:    'bg-signal-red/10 text-signal-red border border-signal-red/20',
  blue:   'bg-signal-blue/10 text-signal-blue border border-signal-blue/20',
  sage:   'bg-sage-100 text-forest-700 border border-sage-300',
  forest: 'bg-forest-900 text-cream-25 border border-transparent',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 tracking-wide',
  md: 'text-xs px-2.5 py-1',
}

export default function Badge({
  color = 'sage',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-body font-medium rounded-full uppercase tracking-[0.06em]',
        colorClasses[color],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
