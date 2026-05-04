'use client'

import { useState, useEffect, useRef } from 'react'

type SighPhase = { label: string; secs: number; scale: number; instruction: string }

const SIGH_PHASES: SighPhase[] = [
  { label: 'First inhale',  secs: 1,   scale: 0.72, instruction: 'inhale deeply through your nose'      },
  { label: 'Top off',       secs: 0.7, scale: 1.0,  instruction: 'sniff once more to fully expand'      },
  { label: 'Long exhale',   secs: 5,   scale: 0.35, instruction: 'exhale slowly through your mouth'     },
  { label: 'Rest',          secs: 2,   scale: 0.35, instruction: 'rest. one round complete.'            },
]

const TOTAL_DURATION = SIGH_PHASES.reduce((s, p) => s + p.secs, 0)

export default function PhysiologicalSigh() {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [rounds, setRounds] = useState(0)
  const phaseRef = useRef(0)
  const elapsedRef = useRef(0)

  const current = SIGH_PHASES[phaseIdx]

  useEffect(() => {
    if (!running) return

    phaseRef.current = 0
    elapsedRef.current = 0
    setPhaseIdx(0)
    setElapsed(0)

    const interval = setInterval(() => {
      elapsedRef.current += 0.1
      setElapsed(e => e + 0.1)

      // Compute which phase we're in
      let cumulative = 0
      for (let i = 0; i < SIGH_PHASES.length; i++) {
        cumulative += SIGH_PHASES[i].secs
        if (elapsedRef.current < cumulative) {
          if (phaseRef.current !== i) {
            phaseRef.current = i
            setPhaseIdx(i)
          }
          break
        }
      }

      // Completed one round
      if (elapsedRef.current >= TOTAL_DURATION) {
        setRounds(r => r + 1)
        elapsedRef.current = 0
        phaseRef.current = 0
        setPhaseIdx(0)
        setElapsed(0)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [running])

  function toggle() {
    if (running) { setRunning(false); setRounds(0) }
    else         { setRunning(true) }
  }

  return (
    <div className="space-y-5 py-2">
      <p className="text-center font-body text-[11px] text-cream-400 italic">
        Dr. Huberman&rsquo;s fastest nervous system reset — one breath resets CO₂ buildup
      </p>

      {/* Circle */}
      <div className="flex justify-center">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full border-2 border-forest-900/12"
               style={{ transform: `scale(${running ? current.scale * 1.2 : 0.6})`,
                        transition: `transform ${current.secs}s ease-in-out` }} />
          <div className="absolute inset-6 rounded-full bg-forest-900"
               style={{ transform: `scale(${running ? current.scale : 0.4})`,
                        opacity: running ? 0.8 : 0.2,
                        transition: `transform ${current.secs}s ease-in-out, opacity 0.4s` }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {running && (
              <p className="font-display text-sm text-forest-900 leading-tight text-center px-4">
                {current.label}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-center font-body text-sm text-cream-600 italic min-h-[20px]">
        {running ? current.instruction : ''}
      </p>

      {rounds > 0 && (
        <p className="text-center font-body text-xs text-forest-600">
          {rounds} round{rounds > 1 ? 's' : ''} complete
        </p>
      )}

      <div className="flex justify-center">
        <button
          onClick={toggle}
          className={[
            'font-body text-sm font-medium px-8 py-2.5 rounded-full transition-colors',
            running
              ? 'border border-forest-900/30 text-forest-900 hover:bg-forest-900/5'
              : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
          ].join(' ')}
        >
          {running ? 'Stop' : 'Begin physiological sigh'}
        </button>
      </div>
    </div>
  )
}
