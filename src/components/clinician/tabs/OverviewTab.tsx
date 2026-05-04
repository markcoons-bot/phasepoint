import { Patient, EMDRPhase } from '@/data/types'
import PhaseIndicator from '@/components/ui/PhaseIndicator'

interface Props {
  patient: Patient
}

const phaseNames: Record<EMDRPhase, string> = {
  1: 'History Taking',
  2: 'Preparation',
  3: 'Assessment',
  4: 'Desensitization',
  5: 'Installation',
  6: 'Body Scan',
  7: 'Closure',
  8: 'Reevaluation',
}

function Score({ label, value, suffix = '', highlight = false }: {
  label: string
  value: number | undefined
  suffix?: string
  highlight?: boolean
}) {
  if (value == null) return null
  return (
    <div className="bg-white rounded-xl border border-cream-100 px-4 py-3 shadow-[0_1px_3px_rgba(26,26,24,0.04)]">
      <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400 mb-1">{label}</p>
      <p className={`font-display text-2xl font-light leading-none ${highlight ? 'text-amber-600' : 'text-forest-900'}`}>
        {value}<span className="text-base text-cream-400 ml-0.5">{suffix}</span>
      </p>
    </div>
  )
}

export default function OverviewTab({ patient }: Props) {
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')
  const currentSUDS = touchstone?.sudsCurrentt
  const baselineSUDS = touchstone?.sudsBaseline
  const sudsChange = (currentSUDS != null && baselineSUDS != null)
    ? baselineSUDS - currentSUDS
    : null

  const phaseName = phaseNames[patient.currentPhase as EMDRPhase]

  return (
    <div className="p-6 space-y-6">

      {/* Pre-session brief banner */}
      <div className="bg-forest-900 rounded-2xl p-5 text-cream-50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] font-body uppercase tracking-[0.12em] text-sage-300/60 mb-1">
              Pre-Session Brief
            </p>
            <h3 className="font-display text-2xl font-light leading-snug">
              Session {patient.sessionCount + 1}
            </h3>
            <p className="font-body text-sm text-sage-300/80 mt-0.5">
              {phaseName}
            </p>
          </div>
          <PhaseIndicator phase={patient.currentPhase as EMDRPhase} showName={false} size="md" />
        </div>

        {touchstone && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-body uppercase tracking-wide text-sage-300/50 mb-0.5">Baseline SUDS</p>
              <p className="font-display text-xl font-light text-cream-50">{baselineSUDS ?? '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-body uppercase tracking-wide text-sage-300/50 mb-0.5">Current SUDS</p>
              <p className="font-display text-xl font-light text-amber-400">{currentSUDS ?? '—'}</p>
            </div>
            {touchstone.voc != null && (
              <div>
                <p className="text-[10px] font-body uppercase tracking-wide text-sage-300/50 mb-0.5">VOC</p>
                <p className="font-display text-xl font-light text-sage-300">{touchstone.voc}</p>
              </div>
            )}
          </div>
        )}

        {sudsChange != null && sudsChange > 0 && (
          <div className="bg-sage-300/10 rounded-lg px-4 py-2.5 text-sm font-body text-sage-200">
            ↓ SUDS has moved {sudsChange} points from baseline across {touchstone?.sessionHistory.length ?? 0} processing sessions.
          </div>
        )}

        {touchstone?.clinicalNotes && (
          <p className="text-sm font-body text-sage-200/70 mt-3 leading-relaxed italic">
            {touchstone.clinicalNotes}
          </p>
        )}
      </div>

      {/* Clinical scores */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">Clinical Measures</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Score label="PCL-5" value={patient.pclScore} highlight={patient.pclScore != null && patient.pclScore >= 33} />
          <Score label="PHQ-9" value={patient.phq9Score} highlight={patient.phq9Score != null && patient.phq9Score >= 10} />
          <Score label="GAD-7" value={patient.gad7Score} highlight={patient.gad7Score != null && patient.gad7Score >= 10} />
          <Score label="DES-II" value={patient.desScore} highlight={patient.desScore != null && patient.desScore >= 20} />
        </div>
      </div>

      {/* Therapist note */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">Therapist Note to Patient</p>
        <div className="bg-cream-25 border border-cream-100 rounded-xl px-5 py-4">
          <p className="font-body text-[14px] text-forest-800 leading-[1.75] italic">
            &ldquo;{patient.therapistNote}&rdquo;
          </p>
        </div>
      </div>

      {/* Journal prompt */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Journal Prompt — Active
        </p>
        <div className="border border-forest-900/12 rounded-xl px-5 py-4 bg-white">
          <p className="font-body text-[13.5px] text-forest-900 leading-relaxed">
            {patient.journalPrompt}
          </p>
        </div>
      </div>

      {/* Prescribed tools */}
      {patient.prescribedTools.length > 0 && (
        <div>
          <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
            Prescribed Between-Session Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {patient.prescribedTools.map(tool => (
              <span
                key={tool}
                className="px-3 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-[11px] font-body text-forest-700 capitalize"
              >
                {tool.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
