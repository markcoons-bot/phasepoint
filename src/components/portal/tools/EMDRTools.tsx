'use client'

import { useState } from 'react'
import { Patient } from '@/data/types'

// ─── Container Visualization ──────────────────────────────────────────────────

const CONTAINER_STEPS = [
  {
    step: 1,
    title: 'See your container',
    body: "Picture your container clearly. It could be a chest, a safe, a vault — whatever feels right. Notice its size, material, color. It is solid. It is real. Nothing inside it can leak out.",
  },
  {
    step: 2,
    title: 'Gather what needs to be held',
    body: "Without analyzing, gather anything that feels unfinished or heavy from today — images, sensations, feelings, thoughts. You don't need to understand them. Just notice they exist.",
  },
  {
    step: 3,
    title: 'Place it inside',
    body: "One by one or all at once — let everything you gathered move into the container. Watch it settle inside. You are not getting rid of it. You are setting it aside with care, until the right time.",
  },
  {
    step: 4,
    title: 'Seal it',
    body: "Close your container. Whatever mechanism feels right — a latch, a lock, a key. Feel the click of it closing. What's inside stays inside. It will be there when you need to work with it.",
  },
  {
    step: 5,
    title: 'Set it aside',
    body: "Now place the container somewhere safe — on a shelf, in a room, wherever feels right. You can check on it any time. For now, it is held. You are free to go about your day.",
  },
]

export function ContainerVisualization() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="py-4 text-center space-y-3">
        <p className="font-display text-xl font-light text-forest-900">Container closed.</p>
        <p className="font-body text-sm text-cream-600">
          What was heavy has been set aside with intention. You can return to it with Dr. Weedman.
        </p>
        <button onClick={() => { setStep(0); setDone(false) }}
                className="border border-cream-200 text-cream-600 font-body text-sm px-5 py-2 rounded-full hover:border-cream-300 transition-colors">
          Begin again
        </button>
      </div>
    )
  }

  const current = CONTAINER_STEPS[step]

  return (
    <div className="py-3 space-y-4">
      <div className="flex gap-1">
        {CONTAINER_STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-forest-900' : 'bg-cream-200'}`} />
        ))}
      </div>
      <div className="bg-cream-25 rounded-2xl px-5 py-5 space-y-2">
        <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">Step {current.step}</p>
        <p className="font-display text-lg font-light text-forest-900">{current.title}</p>
        <p className="font-body text-[14px] text-cream-700 leading-[1.7]">{current.body}</p>
      </div>
      <button
        onClick={() => step < CONTAINER_STEPS.length - 1 ? setStep(s => s + 1) : setDone(true)}
        className="w-full bg-forest-900 text-cream-25 font-body text-sm font-medium py-3 rounded-xl hover:bg-forest-800 transition-colors"
      >
        {step < CONTAINER_STEPS.length - 1 ? 'Continue →' : 'Container sealed'}
      </button>
    </div>
  )
}

// ─── Safe Place ───────────────────────────────────────────────────────────────

export function SafePlace({ patient }: { patient: Patient }) {
  const resource = patient.resources.find(r => r.type === 'safe_place' || r.type === 'calm_place')
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)

  if (!resource) {
    return (
      <div className="py-4 text-center">
        <p className="font-body text-sm text-cream-500">Safe place resource not yet installed. Speak with Dr. Weedman.</p>
      </div>
    )
  }

  const steps = [
    { label: 'Arrive', text: `Close your eyes gently. Take a breath. Let yourself arrive at: ${resource.name}.` },
    { label: 'Look around', text: resource.sensoryCues },
    { label: 'Feel your body', text: resource.bodyAnchor },
    { label: 'Rest here', text: "Stay as long as you need. There is nowhere else to be right now. You are safe." },
  ]

  if (!active) {
    return (
      <div className="py-3 space-y-3">
        <div className="bg-sage-50 rounded-xl px-4 py-3">
          <p className="font-body text-[11px] uppercase tracking-wide text-cream-400 mb-1">Your safe place</p>
          <p className="font-body text-sm font-medium text-forest-900">{resource.name}</p>
          <p className="font-body text-[12px] text-cream-600 mt-1">{resource.description}</p>
        </div>
        <button onClick={() => setActive(true)} className="w-full bg-forest-900 text-cream-25 font-body text-sm font-medium py-3 rounded-xl hover:bg-forest-800 transition-colors">
          Visit now
        </button>
      </div>
    )
  }

  const current = steps[step]
  return (
    <div className="py-3 space-y-4">
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-forest-600' : 'bg-cream-200'}`} />
        ))}
      </div>
      <div className="bg-sage-50 border border-sage-200 rounded-2xl px-5 py-5 space-y-2">
        <p className="text-[10px] font-body uppercase tracking-wide text-cream-400">{current.label}</p>
        <p className="font-body text-[15px] text-forest-800 leading-[1.7] italic">&ldquo;{current.text}&rdquo;</p>
      </div>
      <button
        onClick={() => {
          if (step < steps.length - 1) setStep(s => s + 1)
          else { setStep(0); setActive(false) }
        }}
        className="w-full border border-forest-900/25 text-forest-900 font-body text-sm py-2.5 rounded-xl hover:bg-forest-900/4 transition-colors"
      >
        {step < steps.length - 1 ? 'Next →' : 'Return gently'}
      </button>
    </div>
  )
}

// ─── Butterfly Hug ────────────────────────────────────────────────────────────

export function ButterflyHug({ patient }: { patient: Patient }) {
  const resource = patient.resources.find(r => r.blsAssigned)
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro')
  const [sets, setSets] = useState(0)
  const [tick, setTick] = useState(0)
  const [tapping, setTapping] = useState<'left' | 'right'>('left')

  function start() {
    setSets(0)
    setTick(0)
    setTapping('left')
    setPhase('running')
  }

  if (phase === 'intro') {
    return (
      <div className="py-3 space-y-4">
        <div className="bg-cream-25 rounded-xl px-4 py-3 space-y-2">
          <p className="font-body text-sm font-medium text-forest-900">Position yourself</p>
          <ol className="space-y-1.5">
            {[
              'Cross your arms over your chest, hands resting on your shoulders.',
              'Your fingertips are lightly touching each shoulder.',
              'Close your eyes or soften your gaze.',
              resource ? `Bring ${resource.name} to mind.` : 'Hold something calming and safe in mind.',
            ].map((s, i) => (
              <li key={i} className="flex gap-2 font-body text-[13px] text-cream-600">
                <span className="text-forest-600 shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <button onClick={start} className="w-full bg-forest-900 text-cream-25 font-body text-sm font-medium py-3 rounded-xl hover:bg-forest-800 transition-colors">
          Begin tapping
        </button>
      </div>
    )
  }

  if (phase === 'running') {
    return (
      <div className="py-4 space-y-5 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Tap alternately</p>
        <div className="flex gap-4 justify-center">
          {(['left', 'right'] as const).map(side => (
            <button
              key={side}
              onClick={() => {
                setTapping(side === 'left' ? 'right' : 'left')
                setTick(t => {
                  const next = t + 1
                  if (next % 12 === 0) setSets(s => s + 1)
                  return next
                })
              }}
              className={[
                'w-20 h-20 rounded-full border-2 capitalize font-body text-sm font-medium transition-all',
                tapping === side
                  ? 'border-forest-900 bg-forest-900 text-cream-25 scale-105'
                  : 'border-cream-200 text-cream-400',
              ].join(' ')}
            >
              {side}
            </button>
          ))}
        </div>
        <p className="font-body text-xs text-cream-400">{tick} taps · {sets} set{sets !== 1 ? 's' : ''}</p>
        <button onClick={() => setPhase('done')} className="border border-cream-200 text-cream-600 font-body text-sm px-6 py-2 rounded-full hover:border-cream-300 transition-colors">
          Finish
        </button>
      </div>
    )
  }

  return (
    <div className="py-4 text-center space-y-3">
      <p className="font-display text-xl font-light text-forest-900">Well done.</p>
      <p className="font-body text-sm text-cream-600">{sets} sets completed. Notice how you feel.</p>
      <button onClick={() => setPhase('intro')} className="border border-cream-200 text-cream-600 font-body text-sm px-5 py-2 rounded-full hover:border-cream-300 transition-colors">
        Again
      </button>
    </div>
  )
}
