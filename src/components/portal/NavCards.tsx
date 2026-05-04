'use client'

import { Patient } from '@/data/types'

interface Props {
  patient: Patient
}

const PHASE_CARD: Record<number, { label: string; sub: string }> = {
  1: { label: 'Your Resources',   sub: 'Safe places, figures, tools'     },
  2: { label: 'Your Resources',   sub: 'Safe places, figures, tools'     },
  3: { label: 'Your Memory Map',  sub: 'What we are working with'        },
  4: { label: 'Processing Notes', sub: 'Between-session tracking'        },
  5: { label: 'Processing Notes', sub: 'Between-session tracking'        },
  6: { label: 'Processing Notes', sub: 'Between-session tracking'        },
  7: { label: 'Closure Tools',    sub: 'Ending sessions with intention'  },
  8: { label: 'Integration',      sub: 'Locking in lasting change'       },
}

const BASE_CARDS = [
  { id: 'ground',  icon: '◎', label: 'Ground & Regulate', sub: 'Tools for right now'       },
  { id: 'journal', icon: '✦', label: 'Open Journal',       sub: 'Write, reflect, process'  },
  { id: 'session', icon: '◈', label: 'Session Memory',     sub: 'Last session summary'     },
]

export default function NavCards({ patient }: Props) {
  const phaseCard = PHASE_CARD[patient.currentPhase] ?? { label: 'Session Memory', sub: 'Review progress' }

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cards = [
    ...BASE_CARDS,
    { id: 'session', icon: '◇', label: phaseCard.label, sub: phaseCard.sub },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => scrollTo(card.id)}
          className="flex flex-col items-start gap-2.5 px-4 py-4 rounded-2xl border border-cream-100 bg-white hover:border-sage-300 hover:bg-sage-50/60 transition-all text-left active:scale-[0.98]"
        >
          <span className="text-forest-600 text-[18px] leading-none">{card.icon}</span>
          <div>
            <p className="font-body text-[13px] font-medium text-forest-900 leading-snug">{card.label}</p>
            <p className="font-body text-[11px] text-cream-400 mt-0.5">{card.sub}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
