import { EMDRPhase } from '@/data/types'

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

type PhaseGroup = 'preparation' | 'processing' | 'integration'

function phaseGroup(phase: EMDRPhase): PhaseGroup {
  if (phase <= 2) return 'preparation'
  if (phase <= 6) return 'processing'
  return 'integration'
}

const groupStyles: Record<PhaseGroup, { wrap: string; dot: string }> = {
  preparation: {
    wrap: 'bg-sage-100 text-forest-800 border border-sage-300',
    dot:  'bg-forest-600',
  },
  processing: {
    wrap: 'bg-amber-100 text-amber-600 border border-amber-400/50',
    dot:  'bg-amber-600',
  },
  integration: {
    wrap: 'bg-forest-900/8 text-forest-800 border border-forest-600/30',
    dot:  'bg-forest-600',
  },
}

interface PhaseIndicatorProps {
  phase: EMDRPhase
  showName?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function PhaseIndicator({
  phase,
  showName = true,
  size = 'md',
}: PhaseIndicatorProps) {
  const group = phaseGroup(phase)
  const { wrap, dot } = groupStyles[group]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size]

  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  }[size]

  return (
    <div className={`inline-flex items-center rounded-full font-body font-medium ${wrap} ${sizeClasses}`}>
      <div className={`rounded-full shrink-0 ${dot} ${dotSize}`} />
      <span>Phase {phase}</span>
      {showName && (
        <span className="opacity-60">— {phaseNames[phase]}</span>
      )}
    </div>
  )
}
