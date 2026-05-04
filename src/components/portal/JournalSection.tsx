'use client'

import { useState } from 'react'
import { Patient } from '@/data/types'

interface Props {
  patient: Patient
}

export default function JournalSection({ patient }: Props) {
  const [text,      setText]      = useState('')
  const [reflection, setReflection] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [reflected, setReflected] = useState(false)
  const [isCrisis,  setIsCrisis]  = useState(false)

  const touchstone = patient.memoryNetwork.find(m => m.type === 'touchstone')
  const sessionSummary = touchstone
    ? `Phase ${patient.currentPhase} EMDR. Active target: ${touchstone.label}. SUDS: ${touchstone.sudsCurrentt ?? 'unknown'}.`
    : `Phase ${patient.currentPhase} EMDR therapy, stabilization and resourcing.`

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  async function handleReflect() {
    if (!text.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalText:    text,
          patientName:    patient.name.split(' ')[0],
          modality:       patient.modality,
          phase:          patient.currentPhase,
          sessionSummary,
        }),
      })
      const data = await res.json()
      setReflection(
        data.reflection ?? 'Something went quiet here. Try again when you are ready.'
      )
      setIsCrisis(!!data.crisis)
      setReflected(true)
    } catch {
      setError('Could not reach Phasepoint right now. Your words are still here.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setText('')
    setReflection('')
    setReflected(false)
    setError(null)
    setIsCrisis(false)
  }

  return (
    <div className="space-y-4">

      {/* Prompt from clinician */}
      <div className="border-l-2 border-sage-300/50 pl-4 py-1">
        <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1">
          Prompt from Dr. Weedman
        </p>
        <p className="font-body text-[13px] text-cream-700 leading-[1.65] italic">
          {patient.journalPrompt}
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setReflected(false) }}
          placeholder="Write here. This space is just for you."
          rows={6}
          className="w-full px-4 py-4 rounded-2xl border border-cream-200 bg-white font-body text-[14px] text-cream-800 placeholder:text-cream-300 leading-[1.7] resize-none focus:outline-none focus:border-sage-300 transition-colors"
        />
        {wordCount > 0 && (
          <p className="absolute bottom-3 right-4 font-body text-[10px] text-cream-300 pointer-events-none">
            {wordCount} word{wordCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Reflect button */}
      {text.trim() && !reflected && (
        <button
          onClick={handleReflect}
          disabled={loading}
          className={[
            'w-full py-3 rounded-xl font-body text-sm font-medium transition-colors',
            loading
              ? 'bg-cream-100 text-cream-400 cursor-not-allowed'
              : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
          ].join(' ')}
        >
          {loading ? 'Reflecting\u2026' : 'Reflect with Phasepoint \u2192'}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="font-body text-sm text-cream-500 italic text-center">{error}</p>
      )}

      {/* Reflection — crisis mode */}
      {reflected && reflection && isCrisis && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-5 py-5 space-y-3">
          <p className="font-body text-[10px] uppercase tracking-[0.12em] text-red-600 font-semibold">
            Important
          </p>
          <p className="font-body text-[14px] text-red-800 leading-[1.7]">{reflection}</p>
          <div className="border-t border-red-200 pt-3 space-y-1.5">
            <p className="font-body text-[11px] font-semibold text-red-700">Crisis resources</p>
            <p className="font-body text-[13px] text-red-700">Call or text <strong>988</strong> — available 24 hours</p>
            <p className="font-body text-[13px] text-red-700">Text HOME to <strong>741741</strong></p>
            <p className="font-body text-[13px] text-red-700">Emergency: <strong>911</strong></p>
          </div>
          <button onClick={reset} className="font-body text-[11px] text-red-400 hover:text-red-600 transition-colors">
            Clear &amp; write again
          </button>
        </div>
      )}

      {/* Reflection — normal mode */}
      {reflected && reflection && !isCrisis && (
        <div className="bg-sage-50 border border-sage-200 rounded-2xl px-5 py-5 space-y-3">
          <p className="font-body text-[10px] uppercase tracking-[0.12em] text-forest-600">
            Phasepoint
          </p>
          <p className="font-display text-[16px] font-light text-forest-900 leading-[1.75] italic">
            &ldquo;{reflection}&rdquo;
          </p>
          <button
            onClick={reset}
            className="font-body text-[11px] text-cream-400 hover:text-cream-600 transition-colors"
          >
            Clear &amp; write again
          </button>
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center font-body text-[10px] text-cream-300 leading-relaxed">
        Your journal is private. Dr. Weedman sees a summary, not your exact words.
      </p>
    </div>
  )
}
