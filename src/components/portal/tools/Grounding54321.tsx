'use client'

import { useState } from 'react'

const STEPS = [
  { count: 5, sense: 'SEE',   verb: 'see',   color: 'text-forest-700',  bg: 'bg-sage-50 border-sage-200'      },
  { count: 4, sense: 'TOUCH', verb: 'touch', color: 'text-forest-700',  bg: 'bg-sage-50 border-sage-200'      },
  { count: 3, sense: 'HEAR',  verb: 'hear',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200/50' },
  { count: 2, sense: 'SMELL', verb: 'smell', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200/50' },
  { count: 1, sense: 'TASTE', verb: 'taste', color: 'text-forest-600',  bg: 'bg-cream-50 border-cream-200'    },
]

export default function Grounding54321() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  function advance() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  function restart() { setStep(0); setDone(false) }

  if (done) {
    return (
      <div className="py-4 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-forest-900 flex items-center justify-center mx-auto">
          <span className="text-cream-25 text-xl">✓</span>
        </div>
        <p className="font-display text-xl font-light text-forest-900">Grounded.</p>
        <p className="font-body text-sm text-cream-600">
          You just brought your nervous system into the present moment using all five senses.
        </p>
        <button
          onClick={restart}
          className="border border-cream-200 text-cream-600 font-body text-sm px-6 py-2 rounded-full hover:border-cream-300 transition-colors"
        >
          Go again
        </button>
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div className="py-3 space-y-5">
      {/* Progress */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < step ? 'bg-forest-600' : i === step ? 'bg-forest-900' : 'bg-cream-200'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className={`rounded-2xl border px-5 py-6 ${current.bg}`}>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-5xl font-light text-forest-900">{current.count}</span>
          <span className={`font-body text-sm font-semibold uppercase tracking-widest ${current.color}`}>
            {current.sense}
          </span>
        </div>
        <p className="font-body text-base text-cream-700">
          Name {current.count} thing{current.count > 1 ? 's' : ''} you can <strong className="text-forest-900">{current.verb}</strong> right now.
        </p>
        <p className="font-body text-sm text-cream-500 mt-2 italic">
          Take your time. Look around. Be specific.
        </p>
      </div>

      <button
        onClick={advance}
        className="w-full bg-forest-900 text-cream-25 font-body font-medium py-3 rounded-xl hover:bg-forest-800 transition-colors"
      >
        {step < STEPS.length - 1 ? `Done — next sense →` : 'Complete'}
      </button>

      <p className="text-center font-body text-[10px] text-cream-300">
        Step {step + 1} of {STEPS.length}
      </p>
    </div>
  )
}
