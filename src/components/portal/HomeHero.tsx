import { Patient, EMDRPhase } from '@/data/types'

interface Props {
  patient: Patient
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

const PHASE_MESSAGES: Record<number, string> = {
  1: "You are at the beginning of something important. This phase is about building understanding and trust — between you and Dr. Weedman, and between you and your own history. There is no rush.",
  2: "You are building your foundation. This phase is about safety, resources, and stability before we do deeper work. The time you spend here makes everything else possible. Take it fully.",
  3: "You and Dr. Weedman are identifying the specific memories and patterns to work with. This careful attention is what makes the treatment precise. Stay curious, not urgent.",
  4: "Active processing phase. After sessions, notice what comes up — but don't try to process it alone. Use your tools to stay grounded and contained. The movement you feel between sessions is the treatment working.",
  5: "Installation phase. The positive beliefs are being strengthened and woven into what you know about yourself. You may notice small but real shifts in how you see yourself.",
  6: "Body scan phase. The body holds what the mind has processed. You are completing the work through your physical experience. Pay attention to how you feel, not just what you think.",
  7: "Closure phase. The hardest work is behind you. This is about landing safely, having clear strategies for between sessions, and leaving each session feeling stable.",
  8: "Reevaluation phase. You and Dr. Weedman are consolidating and reviewing. This is where treatment transforms from sessions into lasting change.",
}

const MODALITY_CONTEXT: Record<Patient['modality'], string> = {
  emdr:             'EMDR',
  emdr_complex:     'Complex EMDR',
  emdr_adolescent:  'EMDR — Adolescent Protocol',
}

const PHASE_NAMES: Record<EMDRPhase, string> = {
  1: 'History Taking',
  2: 'Preparation',
  3: 'Assessment',
  4: 'Desensitization',
  5: 'Installation',
  6: 'Body Scan',
  7: 'Closure',
  8: 'Reevaluation',
}

export default function HomeHero({ patient }: Props) {
  const greeting   = getGreeting()
  const firstName  = patient.name.split(' ')[0]
  const phaseMsg   = PHASE_MESSAGES[patient.currentPhase] ?? ''
  const phaseName  = PHASE_NAMES[patient.currentPhase as EMDRPhase]
  const modLabel   = MODALITY_CONTEXT[patient.modality]

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1C3D2E 0%, #2D5E46 60%, #1C3D2E 100%)' }}
    >
      <div className="px-6 pt-7 pb-6 space-y-5">

        {/* Greeting */}
        <div>
          <p className="font-body text-[12px] uppercase tracking-[0.15em] text-sage-300/60 mb-1">
            Good {greeting}
          </p>
          <h1 className="font-display text-[44px] md:text-[52px] font-light text-cream-50 leading-[1.05]">
            {firstName}.
          </h1>
          <p className="font-body text-[12px] text-sage-300/70 mt-1.5">
            Last session with Dr. Weedman &middot; {patient.lastSessionDate}
          </p>
        </div>

        {/* Phase badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-300/12 border border-sage-300/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sage-300 shrink-0" />
          <span className="font-body text-[11px] text-sage-200 tracking-wide">
            {modLabel} &middot; Phase {patient.currentPhase} &middot; {phaseName}
          </span>
        </div>

        {/* Phase message */}
        <p className="font-body text-[14px] text-sage-100/70 leading-[1.65]">
          {phaseMsg}
        </p>

        {/* Therapist note */}
        <div className="border-l-2 border-sage-300/40 pl-4 space-y-1.5">
          <p className="font-display text-[15px] font-light italic text-cream-100/85 leading-[1.65]">
            &ldquo;{patient.therapistNote}&rdquo;
          </p>
          <p className="font-body text-[11px] text-sage-300/60">&mdash; Dr. Weedman</p>
        </div>
      </div>
    </div>
  )
}
