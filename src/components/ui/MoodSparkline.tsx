import { CheckIn, WindowZone } from '@/data/types'

const zoneColor: Record<WindowZone, string> = {
  hyper: '#DDB05A',    // amber-400
  window: '#5FA882',   // forest-500
  hypo: '#1E4A6B',     // signal-blue
}

const zoneLabel: Record<WindowZone, string> = {
  hyper: 'Above window',
  window: 'In window',
  hypo: 'Below window',
}

interface MoodSparklineProps {
  checkIns: CheckIn[]
  maxHeight?: number
  className?: string
}

export default function MoodSparkline({
  checkIns,
  maxHeight = 32,
  className = '',
}: MoodSparklineProps) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {checkIns.map((ci) => {
        const barHeight = Math.max(3, Math.round((ci.suds / 10) * maxHeight))
        const color = zoneColor[ci.windowZone]
        return (
          <div key={ci.date} className="flex flex-col items-center gap-[3px]">
            <div
              className="w-[14px] rounded-t-sm transition-all"
              style={{ height: `${barHeight}px`, backgroundColor: color, opacity: 0.85 }}
              title={`${ci.day}: SUDS ${ci.suds} — ${zoneLabel[ci.windowZone]}`}
            />
            <span
              className="text-[9px] leading-none font-body"
              style={{ color: 'var(--color-cream-400)' }}
            >
              {ci.day.charAt(0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
