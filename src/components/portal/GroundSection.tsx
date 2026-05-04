'use client'

import { useState, ReactNode } from 'react'
import { Patient } from '@/data/types'
import PhysiologicalSigh      from './tools/PhysiologicalSigh'
import BoxBreathing            from './tools/BoxBreathing'
import Grounding54321          from './tools/Grounding54321'
import { ContainerVisualization, SafePlace, ButterflyHug } from './tools/EMDRTools'
import BilateralStimulation    from './tools/BilateralStimulation'
import { TIPPSkill, CourageLadder, DualProcess } from './tools/SpecialtyTools'

interface ToolDef {
  id:           string
  title:        string
  desc:         string
  render:       (p: Patient) => ReactNode
  alwaysShow?:  boolean
  requiredTool?: string
}

const TOOL_DEFS: ToolDef[] = [
  {
    id:          'sigh',
    title:       'Physiological Sigh',
    desc:        'Fastest nervous system reset — one double inhale, one long exhale.',
    alwaysShow:  true,
    render:      () => <PhysiologicalSigh />,
  },
  {
    id:          'box',
    title:       'Box Breathing',
    desc:        'Four-count rhythm: inhale, hold, exhale, hold.',
    alwaysShow:  true,
    render:      () => <BoxBreathing />,
  },
  {
    id:           'grounding',
    title:        '5-4-3-2-1 Grounding',
    desc:         'Bring your nervous system into the present using all five senses.',
    requiredTool: 'grounding_5senses',
    render:       () => <Grounding54321 />,
  },
  {
    id:           'container',
    title:        'Container',
    desc:         'Set aside what is too heavy. It will be there when the time is right.',
    requiredTool: 'container',
    render:       () => <ContainerVisualization />,
  },
  {
    id:           'safe_place',
    title:        'Safe Place',
    desc:         'A guided visit to your installed safe place resource.',
    requiredTool: 'safe_place',
    render:       (p) => <SafePlace patient={p} />,
  },
  {
    id:           'bls',
    title:        'Bilateral Stimulation',
    desc:         'Clinician-assigned BLS for resource reinforcement.',
    requiredTool: 'bls_resourcing',
    render:       (p) => <BilateralStimulation patient={p} />,
  },
  {
    id:           'butterfly',
    title:        'Butterfly Hug',
    desc:         'Self-administered bilateral tapping with your resource in mind.',
    requiredTool: 'bls_resourcing',
    render:       (p) => <ButterflyHug patient={p} />,
  },
  {
    id:           'tipp',
    title:        'TIPP Skill',
    desc:         'Four biological levers to change your emotional state rapidly.',
    requiredTool: 'tipp_skill',
    render:       () => <TIPPSkill />,
  },
  {
    id:           'courage_ladder',
    title:        'Courage Ladder',
    desc:         'Five graduated steps toward social ease. Check them off as you go.',
    requiredTool: 'courage_ladder',
    render:       (p) => <CourageLadder patient={p} />,
  },
  {
    id:           'dual_process',
    title:        'Dual Process',
    desc:         'Move between grief and living forward. Both are right.',
    requiredTool: 'dual_process',
    render:       (p) => <DualProcess patient={p} />,
  },
]

interface Props {
  patient: Patient
}

export default function GroundSection({ patient }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const visible = TOOL_DEFS.filter(t => {
    if (t.alwaysShow) return true
    if (t.requiredTool) return patient.prescribedTools.includes(t.requiredTool)
    return false
  })

  return (
    <div className="space-y-2.5">
      {visible.map((tool) => {
        const isOpen = expanded === tool.id

        return (
          <div
            key={tool.id}
            className="rounded-2xl border border-cream-200 overflow-hidden bg-white"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : tool.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-25 transition-colors"
            >
              <div className="min-w-0 pr-4">
                <p className="font-body text-[14px] font-medium text-forest-900">{tool.title}</p>
                <p className="font-body text-[12px] text-cream-500 mt-0.5 leading-snug">{tool.desc}</p>
              </div>
              <div className={[
                'w-7 h-7 rounded-full border border-cream-200 flex items-center justify-center shrink-0 transition-transform duration-200',
                isOpen ? 'rotate-45 border-forest-900/20 bg-forest-900/5' : '',
              ].join(' ')}>
                <span className={`text-sm leading-none ${isOpen ? 'text-forest-700' : 'text-cream-500'}`}>
                  +
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-cream-100">
                {tool.render(patient)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
