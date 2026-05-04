import { Patient, WindowZone } from '@/data/types'
import MoodSparkline from '@/components/ui/MoodSparkline'

interface Props {
  patient: Patient
  onViewJournal: () => void
}

const ZONE_LABELS: Record<WindowZone, string>  = {
  hyper:  'Above window',
  window: 'In window',
  hypo:   'Below window',
}

const ZONE_COLORS: Record<WindowZone, string> = {
  hyper:  '#DDB05A',
  window: '#5FA882',
  hypo:   '#1E4A6B',
}

const ZONE_BG: Record<WindowZone, string> = {
  hyper:  'bg-amber-100/50 border-amber-400/25',
  window: 'bg-sage-50 border-sage-200',
  hypo:   'bg-blue-50 border-blue-200',
}

// ─── Fictional journal entry for Sarah Chen ──────────────────────────────────

const SARAH_JOURNAL_PREVIEW = {
  date: 'Thursday, May 1 · 8:47 PM',
  preview: "I was coming home from my sister's and took the 101. I didn't plan it — I went the wrong way at the merge and was on the on-ramp before I realized. The moment I saw the cars merging I felt it in my chest first…",
  suds: 7,
  resolved: true,
}

export default function BetweenSessionTab({ patient, onViewJournal }: Props) {
  const hasSarahEntry = patient.id === 'pt-001'

  // Engagement summary
  const completedCheckIns = patient.checkIns.filter(c => c.suds > 0).length
  const avgSUDS = patient.checkIns.length > 0
    ? Math.round(patient.checkIns.reduce((s, c) => s + c.suds, 0) / patient.checkIns.length * 10) / 10
    : null
  const spikes  = patient.checkIns.filter(c => c.note).length
  const hyperDays = patient.checkIns.filter(c => c.windowZone === 'hyper').length
  const hypoDays  = patient.checkIns.filter(c => c.windowZone === 'hypo').length

  return (
    <div className="p-6 space-y-6">

      {/* Engagement header */}
      <div className="bg-forest-900/4 border border-forest-900/10 rounded-2xl p-4">
        <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Week Summary — {patient.checkIns[0]?.date} – {patient.checkIns[patient.checkIns.length - 1]?.date}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="font-display text-2xl font-light text-forest-900 leading-none">{completedCheckIns}</p>
            <p className="text-[10px] font-body text-cream-400 mt-0.5">check-ins</p>
          </div>
          {avgSUDS != null && (
            <div>
              <p className="font-display text-2xl font-light text-amber-600 leading-none">{avgSUDS}</p>
              <p className="text-[10px] font-body text-cream-400 mt-0.5">avg SUDS</p>
            </div>
          )}
          {spikes > 0 && (
            <div>
              <p className="font-display text-2xl font-light text-forest-900 leading-none">{spikes}</p>
              <p className="text-[10px] font-body text-cream-400 mt-0.5">notable events</p>
            </div>
          )}
          <div>
            <p className="font-display text-2xl font-light text-forest-900 leading-none">
              {hyperDays + hypoDays}
            </p>
            <p className="text-[10px] font-body text-cream-400 mt-0.5">out-of-window days</p>
          </div>
        </div>

        {/* Sparkline */}
        <MoodSparkline checkIns={patient.checkIns} maxHeight={40} />
      </div>

      {/* Daily check-in breakdown */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Daily Check-Ins
        </p>
        <div className="space-y-2">
          {patient.checkIns.map(ci => (
            <div
              key={ci.date}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${ZONE_BG[ci.windowZone]}`}
            >
              <div className="shrink-0 w-10 text-center">
                <p className="font-body text-[10px] text-cream-400">{ci.day}</p>
                <p
                  className="font-display text-xl font-light leading-none mt-0.5"
                  style={{ color: ZONE_COLORS[ci.windowZone] }}
                >
                  {ci.suds}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[9px] font-body uppercase tracking-wide"
                    style={{ color: ZONE_COLORS[ci.windowZone] }}
                  >
                    {ZONE_LABELS[ci.windowZone]}
                  </span>
                  <span className="text-cream-300">·</span>
                  <span className="text-[10px] font-body text-cream-400">{ci.date}</span>
                </div>
                {ci.note && (
                  <p className="font-body text-[12px] text-cream-600 italic leading-snug">{ci.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journal entries */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Journal Entries
        </p>

        {hasSarahEntry ? (
          <button
            onClick={onViewJournal}
            className="w-full text-left bg-white border border-cream-100 rounded-2xl p-4 hover:border-forest-900/20 hover:shadow-[0_2px_8px_rgba(26,26,24,0.08)] transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-body text-[12px] text-cream-400 mb-0.5">{SARAH_JOURNAL_PREVIEW.date}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-body text-amber-600">
                    SUDS peaked {SARAH_JOURNAL_PREVIEW.suds}
                  </span>
                  {SARAH_JOURNAL_PREVIEW.resolved && (
                    <>
                      <span className="text-cream-300">·</span>
                      <span className="text-[11px] font-body text-forest-600">Resolved with skill</span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-body font-medium text-forest-700 shrink-0 underline underline-offset-2">
                View entry →
              </span>
            </div>
            <p className="font-body text-[13px] text-cream-600 leading-relaxed line-clamp-3 italic">
              &ldquo;{SARAH_JOURNAL_PREVIEW.preview}&rdquo;
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[9px] font-body uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-600">
                AI response ready
              </span>
              <span className="text-[9px] font-body uppercase tracking-wide px-2 py-0.5 rounded bg-sage-100 text-forest-600">
                RTM eligible
              </span>
            </div>
          </button>
        ) : (
          <div className="bg-cream-25 border border-cream-100 rounded-xl px-5 py-8 text-center">
            <p className="font-body text-sm text-cream-500">No journal entries this week.</p>
            <p className="font-body text-xs text-cream-400 mt-1">
              Prompt sent: &ldquo;{patient.journalPrompt.slice(0, 80)}…&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Prescribed tools usage */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Prescribed Tools
        </p>
        <div className="flex flex-wrap gap-2">
          {patient.prescribedTools.map(tool => (
            <div
              key={tool}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sage-200 bg-sage-50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
              <span className="font-body text-[11px] text-forest-700 capitalize">
                {tool.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
