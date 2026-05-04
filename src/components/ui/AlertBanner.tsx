import { AlertLevel } from '@/data/types'
import { Info, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react'

interface LevelConfig {
  wrap: string
  icon: typeof Info
  iconClass: string
  textClass: string
  label: string
}

const levelConfig: Record<AlertLevel, LevelConfig> = {
  info: {
    wrap: 'bg-sage-50 border-sage-300',
    icon: Info,
    iconClass: 'text-forest-600',
    textClass: 'text-forest-800',
    label: 'Info',
  },
  clinical: {
    wrap: 'bg-amber-100 border-amber-400/50',
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
    textClass: 'text-cream-950',
    label: 'Clinical',
  },
  urgent: {
    wrap: 'bg-amber-100/70 border-signal-amber/60',
    icon: AlertCircle,
    iconClass: 'text-signal-amber',
    textClass: 'text-cream-950',
    label: 'Urgent',
  },
  crisis: {
    wrap: 'bg-signal-red/8 border-signal-red/40',
    icon: AlertOctagon,
    iconClass: 'text-signal-red',
    textClass: 'text-cream-950',
    label: 'Crisis',
  },
}

interface AlertBannerProps {
  level: AlertLevel
  message: string
  timestamp?: string
  onAcknowledge?: () => void
  className?: string
}

export default function AlertBanner({
  level,
  message,
  timestamp,
  onAcknowledge,
  className = '',
}: AlertBannerProps) {
  const { wrap, icon: Icon, iconClass, textClass, label } = levelConfig[level]

  return (
    <div className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${wrap} ${className}`}>
      <Icon size={15} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-medium uppercase tracking-wider opacity-60 ${textClass}`}>
            {label}
          </span>
          {timestamp && (
            <span className="text-[10px] text-cream-400">{timestamp}</span>
          )}
        </div>
        <p className={`text-sm leading-relaxed ${textClass}`}>{message}</p>
      </div>
      {onAcknowledge && (
        <button
          onClick={onAcknowledge}
          className="text-xs text-cream-400 hover:text-cream-600 transition-colors shrink-0 mt-0.5"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}
