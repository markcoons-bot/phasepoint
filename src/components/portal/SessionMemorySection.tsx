import { Patient } from '@/data/types'

interface Props {
  patient: Patient
}

const RESOURCE_ICONS: Record<string, string> = {
  safe_place:         '⬡',
  calm_place:         '○',
  nurturing_figure:   '♡',
  protective_figure:  '◈',
  animal:             '◇',
  adult_self:         '◎',
  wisdom_figure:      '✦',
  spiritual:          '✧',
  community:          '◉',
}

export default function SessionMemorySection({ patient }: Props) {
  const touchstone = patient.memoryNetwork.find(m => m.type === 'touchstone')
  const resources  = patient.resources

  let nextDate: string | null = null
  if (patient.nextSessionDate) {
    const d = new Date(patient.nextSessionDate)
    nextDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="space-y-6">

      {/* Session header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Last session</p>
          <p className="font-body text-[14px] font-medium text-forest-900 mt-0.5">
            {patient.lastSessionDate}
          </p>
          <p className="font-body text-[12px] text-cream-500">Session {patient.sessionCount}</p>
        </div>
        {nextDate && (
          <div className="text-right">
            <p className="font-body text-[11px] text-cream-400">Next session</p>
            <p className="font-body text-[13px] text-forest-700 mt-0.5">{nextDate}</p>
          </div>
        )}
      </div>

      {/* Touchstone NC / PC + progress */}
      {touchstone && (touchstone.negativeCognition || touchstone.positiveCognition) && (
        <div className="bg-cream-25 rounded-2xl px-5 py-4 space-y-4 border border-cream-100">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1">Memory work</p>
            <p className="font-body text-[12px] text-cream-500">{touchstone.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {touchstone.negativeCognition && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-3">
                <p className="font-body text-[9px] uppercase tracking-wide text-amber-600 mb-1.5">Old belief</p>
                <p className="font-body text-[12px] text-cream-700 italic leading-snug">
                  &ldquo;{touchstone.negativeCognition}&rdquo;
                </p>
              </div>
            )}
            {touchstone.positiveCognition && (
              <div className="bg-sage-50 border border-sage-200 rounded-xl px-3 py-3">
                <p className="font-body text-[9px] uppercase tracking-wide text-forest-600 mb-1.5">New belief</p>
                <p className="font-body text-[12px] text-cream-700 italic leading-snug">
                  &ldquo;{touchstone.positiveCognition}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* VOC meter */}
          {touchstone.voc !== undefined && (
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="font-body text-[11px] text-cream-500">
                  How true the new belief feels (VOC)
                </p>
                <p className="font-body text-[13px] font-semibold text-forest-700">
                  {touchstone.voc} <span className="text-cream-400 font-normal">/ 7</span>
                </p>
              </div>
              <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-forest-600 transition-all"
                  style={{ width: `${(touchstone.voc / 7) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-body text-[9px] text-cream-300">feels false</span>
                <span className="font-body text-[9px] text-cream-300">completely true</span>
              </div>
            </div>
          )}

          {/* SUDS trajectory */}
          {touchstone.sudsBaseline !== undefined && touchstone.sudsCurrentt !== undefined && (
            <div className="flex items-center gap-2 pt-1 border-t border-cream-100">
              <span className="font-body text-[11px] text-cream-400">SUDS trajectory</span>
              <span className="font-body text-sm font-semibold text-amber-600">{touchstone.sudsBaseline}</span>
              <span className="font-body text-cream-300">→</span>
              <span className="font-body text-sm font-semibold text-forest-600">{touchstone.sudsCurrentt}</span>
              {touchstone.sudsCurrentt < touchstone.sudsBaseline && (
                <span className="font-body text-[11px] text-forest-500 ml-1">
                  ↓ {touchstone.sudsBaseline - touchstone.sudsCurrentt} points
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-3">Your resource team</p>
          <div className="space-y-2">
            {resources.map((res) => (
              <div
                key={res.id}
                className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl bg-white border border-cream-100"
              >
                <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                  <span className="text-forest-600 text-base leading-none">
                    {RESOURCE_ICONS[res.type] ?? '◎'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[13px] font-medium text-forest-900">{res.name}</p>
                  <p className="font-body text-[11px] text-cream-500 leading-snug mt-0.5">{res.description}</p>

                  {res.strengthRating !== undefined && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex gap-[3px]">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: i < res.strengthRating! ? '#4A8B6C' : '#E8E4D8',
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-body text-[9px] text-cream-400">
                        {res.strengthRating}/10
                      </span>
                      {res.blsAssigned && (
                        <span className="font-body text-[9px] text-forest-500 ml-1 border border-forest-500/30 px-1.5 py-0.5 rounded-full">
                          BLS assigned
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
