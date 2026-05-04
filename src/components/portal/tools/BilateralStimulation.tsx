'use client'

import { useState, useEffect, useRef } from 'react'
import { Patient, Resource } from '@/data/types'

interface Props {
  patient: Patient
}

const SPEEDS = { gentle: 1.5, standard: 0.85, active: 0.5 } as const
type Speed = keyof typeof SPEEDS

function isGated(patient: Patient): boolean {
  // Elena (pt-003) has BLS gated
  return patient.dissociationRisk === 'moderate' || patient.dissociationRisk === 'high'
}

function getBLSResource(patient: Patient): Resource | undefined {
  return patient.resources.find(r => r.blsAssigned && r.blsParameters)
}

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function BilateralStimulation({ patient }: Props) {
  const gated = isGated(patient)
  const resource = getBLSResource(patient)

  const [phase, setPhase]       = useState<'before' | 'running' | 'after'>('before')
  const [speed, setSpeed]       = useState<Speed>('standard')
  const [mode, setMode]         = useState<'resourcing' | 'processing'>('resourcing')
  const [sudsBefore, setSudsBefore] = useState<number | null>(null)
  const [sudsAfter, setSubsAfter]   = useState<number | null>(null)
  const [elapsed, setElapsed]   = useState(0)
  const intervalRef             = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'running') {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase])

  function start() { setElapsed(0); setPhase('running') }
  function stop()  { setPhase('after') }
  function reset() { setPhase('before'); setSudsBefore(null); setSubsAfter(null); setElapsed(0) }

  const duration = SPEEDS[speed]

  // ─── Gated state ─────────────────────────────────────────────────────────────
  if (gated) {
    return (
      <div className="py-4 space-y-3">
        <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-4 space-y-2">
          <p className="font-body text-sm font-medium text-forest-900">BLS not yet prescribed</p>
          <p className="font-body text-[13px] text-cream-600 leading-relaxed">
            Bilateral stimulation is not yet prescribed for your current phase.
            Dr. Weedman will unlock this when you&rsquo;re ready. There&rsquo;s no rush —
            the preparation work you&rsquo;re doing now is exactly right for where you are.
          </p>
        </div>
        <p className="font-body text-[11px] text-cream-400 text-center italic">
          Your assigned stabilization tools are available below.
        </p>
      </div>
    )
  }

  // ─── Before phase ─────────────────────────────────────────────────────────────
  if (phase === 'before') {
    return (
      <div className="py-3 space-y-5">
        {resource && (
          <div className="bg-cream-25 rounded-xl px-3 py-2.5 text-[12px] font-body text-forest-700">
            <span className="text-cream-400">Active resource: </span>{resource.name}
          </div>
        )}

        {/* Mode */}
        <div className="space-y-2">
          <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">Mode</p>
          <div className="flex gap-2">
            {(['resourcing', 'processing'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={[
                  'flex-1 py-2 rounded-lg border text-[12px] font-body font-medium capitalize transition-colors',
                  mode === m
                    ? 'border-forest-900 bg-forest-900 text-cream-25'
                    : 'border-cream-200 text-cream-600 hover:border-cream-300',
                ].join(' ')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">Speed</p>
          <div className="flex gap-2">
            {(Object.keys(SPEEDS) as Speed[]).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={[
                  'flex-1 py-2 rounded-lg border text-[12px] font-body font-medium capitalize transition-colors',
                  speed === s
                    ? 'border-forest-900 bg-forest-900/8 text-forest-900'
                    : 'border-cream-200 text-cream-400 hover:border-cream-300',
                ].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* SUDS before */}
        <div className="space-y-2">
          <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">
            Current SUDS (0–10)
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setSudsBefore(i)}
                className={[
                  'w-9 h-9 rounded-full border text-[13px] font-body font-medium transition-colors',
                  sudsBefore === i
                    ? i <= 3 ? 'bg-forest-600 border-forest-600 text-white'
                      : i <= 6 ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-red-600 border-red-600 text-white'
                    : 'border-cream-200 text-cream-600 hover:border-cream-300',
                ].join(' ')}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={start}
          disabled={sudsBefore === null}
          className="w-full bg-forest-900 text-cream-25 font-body font-medium py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-800 transition-colors"
        >
          Begin BLS
        </button>
      </div>
    )
  }

  // ─── Running phase ─────────────────────────────────────────────────────────────
  if (phase === 'running') {
    return (
      <div className="py-3 space-y-5">
        {/* Timer */}
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-cream-400 capitalize">{mode}</span>
          <span className="font-display text-xl text-forest-900">{formatTime(elapsed)}</span>
          <span className="font-body text-xs text-cream-400 capitalize">{speed}</span>
        </div>

        {/* BLS track */}
        <div className="relative h-16 rounded-2xl border border-forest-900/15 bg-forest-900/4 overflow-hidden">
          <style>{`
            @keyframes blsMove {
              0%   { left: 12px; }
              50%  { left: calc(100% - 44px); }
              100% { left: 12px; }
            }
          `}</style>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-forest-900 shadow-md"
            style={{ animation: `blsMove ${duration * 2}s ease-in-out infinite` }}
          />
        </div>

        {/* Focus text */}
        <p className="text-center font-body text-sm text-cream-600 italic">
          {mode === 'resourcing'
            ? `Hold ${resource?.name ?? 'your safe place'} in mind…`
            : 'Notice what comes up. Stay with it.'}
        </p>

        <button
          onClick={stop}
          className="w-full border border-forest-900/30 text-forest-900 font-body font-medium py-3 rounded-xl hover:bg-forest-900/5 transition-colors"
        >
          Stop &amp; Record
        </button>
      </div>
    )
  }

  // ─── After phase ──────────────────────────────────────────────────────────────
  return (
    <div className="py-3 space-y-5">
      <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-3 text-center">
        <p className="font-body text-sm text-forest-700 font-medium mb-0.5">Session complete</p>
        <p className="font-display text-2xl text-forest-900">{formatTime(elapsed)}</p>
      </div>

      {/* SUDS comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cream-50 rounded-xl px-3 py-2.5 text-center">
          <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-1">Before</p>
          <p className="font-display text-3xl font-light text-amber-600">{sudsBefore}</p>
        </div>
        <div className="bg-cream-50 rounded-xl px-3 py-2.5 text-center">
          <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-1">After</p>
          {sudsAfter !== null ? (
            <p className="font-display text-3xl font-light text-forest-600">{sudsAfter}</p>
          ) : (
            <div className="flex gap-1 flex-wrap justify-center">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSubsAfter(i)}
                  className="w-7 h-7 rounded-full border border-cream-200 text-[11px] font-body text-cream-600 hover:border-forest-600 hover:text-forest-700 transition-colors"
                >
                  {i}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {sudsAfter !== null && sudsBefore !== null && (
        <p className="text-center font-body text-sm text-forest-700">
          {sudsAfter < sudsBefore
            ? `↓ SUDS moved from ${sudsBefore} to ${sudsAfter}. Note this for your next session.`
            : sudsAfter === sudsBefore
            ? 'SUDS unchanged. Mention this to Dr. Weedman.'
            : 'SUDS increased slightly — this can be normal after processing. Use your container.'}
        </p>
      )}

      <button
        onClick={reset}
        className="w-full border border-cream-200 text-cream-600 font-body text-sm py-2.5 rounded-xl hover:border-cream-300 transition-colors"
      >
        Start another session
      </button>
    </div>
  )
}
