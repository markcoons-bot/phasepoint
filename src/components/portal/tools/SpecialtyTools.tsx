'use client'

import { useState } from 'react'
import { Patient } from '@/data/types'

// ─── TIPP Skill (Elena — Complex PTSD) ───────────────────────────────────────

const TIPP_STEPS = [
  {
    letter: 'T',
    name: 'Temperature',
    desc: 'Change your body temperature immediately.',
    options: [
      'Hold ice cubes in your hands for 30 seconds.',
      'Splash cold water on your face.',
      'Hold a cold glass or can.',
      'Step outside into cool air.',
    ],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    letter: 'I',
    name: 'Intense Exercise',
    desc: 'Fast-forward through the stress with movement.',
    options: [
      '20 jumping jacks — right now.',
      'Run in place for 1 minute.',
      '10 push-ups.',
      'Walk fast up stairs or around the block.',
    ],
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    letter: 'P',
    name: 'Paced Breathing',
    desc: 'Slow your exhale longer than your inhale.',
    options: [
      'Inhale 5 counts · exhale 7 counts. Repeat 5 times.',
      'Feel your belly rise on the inhale, fall on the exhale.',
    ],
    color: 'bg-sage-50 border-sage-200 text-forest-700',
  },
  {
    letter: 'P',
    name: 'Paired Muscle Relaxation',
    desc: 'Tense each muscle group, then release.',
    options: [
      'Clench your fists tight for 5 seconds. Release. Notice the difference.',
      'Shrug your shoulders to your ears. Hold. Drop.',
      'Press your feet into the floor. Hold. Release.',
    ],
    color: 'bg-cream-50 border-cream-200 text-cream-700',
  },
]

export function TIPPSkill() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="py-4 text-center space-y-3">
        <p className="font-display text-xl font-light text-forest-900">TIPP complete.</p>
        <p className="font-body text-sm text-cream-600">
          Notice if your emotional intensity has shifted. You used four biological levers to change your nervous system state. That is real skill.
        </p>
        <button onClick={() => { setStep(0); setDone(false) }}
                className="border border-cream-200 text-cream-600 font-body text-sm px-5 py-2 rounded-full hover:border-cream-300 transition-colors">
          Begin again
        </button>
      </div>
    )
  }

  const current = TIPP_STEPS[step]

  return (
    <div className="py-3 space-y-4">
      <div className="flex gap-2">
        {TIPP_STEPS.map((t, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={[
              'flex-1 py-1.5 rounded-lg border text-[12px] font-body font-semibold transition-colors',
              i === step ? 'border-forest-900 bg-forest-900 text-cream-25' : 'border-cream-200 text-cream-400',
            ].join(' ')}
          >
            {t.letter}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border px-5 py-4 space-y-3 ${current.color}`}>
        <div>
          <span className="font-display text-3xl font-light">{current.letter}</span>
          <span className="font-body text-base font-semibold ml-2">{current.name}</span>
        </div>
        <p className="font-body text-[13px] leading-relaxed">{current.desc}</p>
        <ul className="space-y-1.5">
          {current.options.map((opt, i) => (
            <li key={i} className="flex gap-2 font-body text-[12.5px]">
              <span className="shrink-0 opacity-60">&rsaquo;</span>
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => step < TIPP_STEPS.length - 1 ? setStep(s => s + 1) : setDone(true)}
        className="w-full bg-forest-900 text-cream-25 font-body text-sm font-medium py-3 rounded-xl hover:bg-forest-800 transition-colors"
      >
        {step < TIPP_STEPS.length - 1 ? `Next: ${TIPP_STEPS[step + 1].name} →` : 'Complete'}
      </button>
    </div>
  )
}

// ─── Courage Ladder (Tyler — Adolescent) ─────────────────────────────────────

const TYLER_LADDER = [
  { level: 1, action: 'Make brief eye contact with someone in class.', done: false },
  { level: 2, action: 'Say one sentence to someone you don\'t know well.', done: false },
  { level: 3, action: 'Sit with a group at lunch for 5 minutes.', done: false },
  { level: 4, action: 'Ask a question in class or during group work.', done: false },
  { level: 5, action: 'Introduce yourself to someone new.', done: false },
]

export function CourageLadder({ patient }: { patient: Patient }) {
  const [steps, setSteps] = useState(TYLER_LADDER.map(s => ({ ...s })))

  function toggle(i: number) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s))
  }

  const completed = steps.filter(s => s.done).length

  return (
    <div className="py-3 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Courage Ladder</p>
        <p className="font-body text-xs text-forest-600">{completed} / {steps.length} done</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={[
              'w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all',
              step.done
                ? 'border-forest-600/30 bg-forest-900/5'
                : 'border-cream-200 hover:border-cream-300',
            ].join(' ')}
          >
            <div className={[
              'w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors',
              step.done ? 'border-forest-600 bg-forest-600' : 'border-cream-300',
            ].join(' ')}>
              {step.done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <div>
              <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-0.5">Level {step.level}</p>
              <p className={`font-body text-[13px] leading-snug ${step.done ? 'text-forest-700 line-through opacity-70' : 'text-cream-700'}`}>
                {step.action}
              </p>
            </div>
          </button>
        ))}
      </div>

      {completed > 0 && (
        <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-3">
          <p className="font-body text-[13px] text-forest-700">
            {completed === steps.length
              ? "You've completed all ladder steps. That took real courage. Tell Dr. Weedman."
              : `${completed} step${completed > 1 ? 's' : ''} complete. Every one counts. Keep going.`}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Dual Process (Michael — Grief) ──────────────────────────────────────────

export function DualProcess({ patient }: { patient: Patient }) {
  const [side, setSide] = useState<'grief' | 'living' | null>(null)

  return (
    <div className="py-3 space-y-4">
      <p className="font-body text-[13px] text-cream-600 leading-relaxed">
        The dual process model says grief has two sides — and moving between them is healthy, not disloyal.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Grief side */}
        <button
          onClick={() => setSide(side === 'grief' ? null : 'grief')}
          className={[
            'rounded-2xl border px-4 py-4 text-left transition-all space-y-2',
            side === 'grief'
              ? 'border-amber-400/40 bg-amber-50'
              : 'border-cream-200 hover:border-cream-300',
          ].join(' ')}
        >
          <p className="font-body text-[11px] uppercase tracking-wide text-amber-600">Loss-oriented</p>
          <p className="font-body text-sm text-cream-700">Grief, memory, longing. The love that was.</p>
        </button>

        {/* Living side */}
        <button
          onClick={() => setSide(side === 'living' ? null : 'living')}
          className={[
            'rounded-2xl border px-4 py-4 text-left transition-all space-y-2',
            side === 'living'
              ? 'border-forest-600/30 bg-sage-50'
              : 'border-cream-200 hover:border-cream-300',
          ].join(' ')}
        >
          <p className="font-body text-[11px] uppercase tracking-wide text-forest-600">Restoration-oriented</p>
          <p className="font-body text-sm text-cream-700">New roles, new rhythms. Life continuing forward.</p>
        </button>
      </div>

      {side === 'grief' && (
        <div className="bg-amber-50 border border-amber-200/50 rounded-xl px-4 py-4 space-y-2">
          <p className="font-body text-sm text-amber-800 font-medium">Today, in the grief side —</p>
          <p className="font-body text-[13px] text-cream-700 leading-relaxed">
            What do you want to remember right now? What were they like at their very best?
            You don&rsquo;t have to do anything with this. Just let yourself feel it.
          </p>
        </div>
      )}

      {side === 'living' && (
        <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-4 space-y-2">
          <p className="font-body text-sm text-forest-800 font-medium">Today, in the living side —</p>
          <p className="font-body text-[13px] text-cream-700 leading-relaxed">
            Name one small thing from today — however small — that was part of life continuing.
            A meal, a conversation, a moment of sun. It counts.
          </p>
        </div>
      )}
    </div>
  )
}
