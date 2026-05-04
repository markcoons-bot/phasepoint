'use client'

import { Patient } from '@/data/types'

interface Props {
  patients: Patient[]
  selectedId: string
  onSelect: (id: string) => void
}

function phaseStyle(phase: number, active: boolean): { bg: string; text: string } {
  if (active) return { bg: 'rgba(255,255,255,0.14)', text: '#C8DDD5' }
  if (phase <= 2) return { bg: '#EBF3EF', text: '#3D7A5C' }
  if (phase <= 6) return { bg: '#F5E8CC', text: '#C8922E' }
  return { bg: '#1C3D2E', text: '#FAF7F2' }
}

export default function PatientSwitcher({ patients, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
      {patients.map((p) => {
        const isActive = p.id === selectedId
        const ps = phaseStyle(p.currentPhase, isActive)
        const firstName = p.name.split(' ')[0]

        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-full border shrink-0 transition-all',
              isActive
                ? 'border-forest-900 bg-forest-900'
                : 'border-cream-200 bg-white hover:border-sage-300',
            ].join(' ')}
          >
            {/* Initials */}
            <div className={[
              'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
              isActive ? 'bg-forest-800' : 'bg-sage-100',
            ].join(' ')}>
              <span className={[
                'font-body text-[10px] font-semibold',
                isActive ? 'text-sage-200' : 'text-forest-700',
              ].join(' ')}>
                {p.initials}
              </span>
            </div>

            {/* Name */}
            <span className={[
              'font-body text-[13px] font-medium',
              isActive ? 'text-cream-25' : 'text-cream-800',
            ].join(' ')}>
              {firstName}
            </span>

            {/* Phase badge */}
            <span
              className="font-body text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: ps.bg, color: ps.text }}
            >
              P{p.currentPhase}
            </span>
          </button>
        )
      })}
    </div>
  )
}
