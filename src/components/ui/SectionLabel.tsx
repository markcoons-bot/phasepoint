interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={[
        'block text-[11px] font-body font-medium uppercase tracking-[0.14em] text-cream-600',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
