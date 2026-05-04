'use client'

import { useState, useEffect, useRef } from 'react'

type BPhase = { name: string; secs: number; scale: number; label: string; instruction: string }

const PHASES: BPhase[] = [
  { name: 'inhale',   secs: 4, scale: 1.0,  label: 'Inhale',  instruction: 'breathe in slowly through your nose'      },
  { name: 'hold-in',  secs: 4, scale: 1.0,  label: 'Hold',    instruction: 'hold gently'                              },
  { name: 'exhale',   secs: 6, scale: 0.56, label: 'Exhale',  instruction: 'breathe out slowly through your mouth'    },
  { name: 'hold-out', secs: 2, scale: 0.56, label: 'Rest',    instruction: 'pause softly'                             },
]

export default function BoxBreathing() {
  const [running, setRunning]     = useState(false)
  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [tick, setTick]           = useState(PHASES[0].secs)
  const [cycles, setCycles]       = useState(0)
  const phaseRef                  = useRef(0)
  const tickRef                   = useRef(PHASES[0].secs)

  const current = PHASES[phaseIdx]

  useEffect(() => {
    if (!running) return

    phaseRef.current = 0
    tickRef.current  = PHASES[0].secs
    setPhaseIdx(0)
    setTick(PHASES[0].secs)

    const interval = setInterval(() => {
      tickRef.current -= 1
      setTick(tickRef.current)

      if (tickRef.current <= 0) {
        const next = (phaseRef.current + 1) % PHASES.length
        if (next === 0) setCycles(c => c + 1)
        phaseRef.current = next
        tickRef.current  = PHASES[next].secs
        setPhaseIdx(next)
        setTick(PHASES[next].secs)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [running])

  function toggle() {
    if (running) { setRunning(false); setCycles(0) }
    else         { setRunning(true) }
  }

  const scale = running ? current.scale : 0.55

  return (
    <div className="space-y-5 py-2">

      {/* Animated circle */}
      <div className="flex justify-center">
        <div className="relative w-44 h-44">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-forest-900/12"
               style={{ transform: `scale(${running ? current.scale * 1.18 : 0.7})`,
                        transition: `transform ${current.secs}s ease-in-out` }} />
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border border-forest-900/18"
               style={{ transform: `scale(${running ? current.scale * 1.06 : 0.65})`,
                        transition: `transform ${current.secs}s ease-in-out` }} />
          {/* Core */}
          <div className="absolute inset-8 rounded-full bg-forest-900"
               style={{ transform: `scale(${scale})`,
                        opacity: running ? 0.82 : 0.22,
                        transition: `transform ${current.secs}s ease-in-out, opacity 0.4s ease` }} />
          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
            {running ? (
              <>
                <span className="font-display text-base font-light text-forest-900">{current.label}</span>
                <span className="font-display text-2xl text-forest-900 leading-none">{tick}</span>
              </>
            ) : (
              <span className="font-body text-[11px] text-cream-400 text-center px-4">tap below to begin</span>
            )}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-center font-body text-sm text-cream-600 italic min-h-[20px]">
        {running ? current.instruction : ''}
      </p>

      {/* Cycle count */}
      {cycles > 0 && (
        <p className="text-center font-body text-xs text-forest-600">
          {cycles} cycle{cycles > 1 ? 's' : ''} complete
        </p>
      )}

      {/* Button */}
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
          {running ? 'Stop' : 'Begin · 4-4-6-2 breath'}
        </button>
      </div>

      <p className="text-center font-body text-[10px] text-cream-300">
        Inhale 4s · Hold 4s · Exhale 6s · Rest 2s
      </p>
    </div>
  )
}
