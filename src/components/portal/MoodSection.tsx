import { Patient } from '@/data/types'
import MoodSparkline from '@/components/ui/MoodSparkline'

interface Props {
  patient: Patient
}

export default function MoodSection({ patient }: Props) {
  const checkIns = patient.checkIns
  const latest   = checkIns[checkIns.length - 1]
  const avg      = checkIns.reduce((s, c) => s + c.suds, 0) / checkIns.length
  const avgRound = Math.round(avg * 10) / 10
  const currentSuds = latest?.suds ?? 0

  const inWindow  = checkIns.filter(c => c.windowZone === 'window').length
  const outside   = checkIns.length - inWindow

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">7-day check-ins</p>
          <p className="font-body text-[13px] text-cream-600 mt-0.5">
            {inWindow} of {checkIns.length} days in window
            {outside > 0 && <span className="text-amber-600"> · {outside} outside</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="font-body text-[11px] text-cream-400">weekly avg</p>
          <p className="font-display text-3xl font-light text-forest-900 leading-none">{avgRound}</p>
        </div>
      </div>

      {/* Sparkline — large */}
      <MoodSparkline checkIns={checkIns} maxHeight={120} />

      {/* Zone legend */}
      <div className="flex gap-5">
        {[
          { color: '#DDB05A', label: 'Above window' },
          { color: '#5FA882', label: 'In window'    },
          { color: '#1E4A6B', label: 'Below window' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="font-body text-[10px] text-cream-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Current SUDS scale */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Today&rsquo;s SUDS</p>
          <p className="font-body text-[11px] font-semibold text-forest-700">{currentSuds} / 10</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              className={[
                'flex-1 h-9 rounded-lg flex items-center justify-center transition-all',
                i === currentSuds ? 'bg-forest-900' : 'bg-cream-100',
              ].join(' ')}
            >
              <span className={[
                'font-body text-[10px] font-semibold',
                i === currentSuds ? 'text-cream-25' : 'text-cream-400',
              ].join(' ')}>
                {i}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-body text-[9px] text-cream-300">calm</span>
          <span className="font-body text-[9px] text-cream-300">worst distress</span>
        </div>
      </div>

      {/* Notable check-in note */}
      {latest?.note && (
        <div className="bg-cream-25 rounded-xl px-4 py-3 border-l-2 border-sage-300/50">
          <p className="font-body text-[11px] text-cream-400 mb-0.5">{latest.day} — note</p>
          <p className="font-body text-[13px] text-cream-700 leading-relaxed italic">{latest.note}</p>
        </div>
      )}
    </div>
  )
}
