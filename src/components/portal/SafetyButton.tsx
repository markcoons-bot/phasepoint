'use client'

import { useState } from 'react'
import { Patient } from '@/data/types'

interface Props {
  patient: Patient
}

export default function SafetyButton({ patient }: Props) {
  const [open, setOpen] = useState(false)
  const sp = patient.safetyPlan

  return (
    <>
      {/* Pulse ring animation */}
      <style>{`
        @keyframes safetyPulse {
          0%, 90%, 100% { box-shadow: 0 0 0 0 rgba(28,61,46,0); }
          92%           { box-shadow: 0 0 0 6px rgba(28,61,46,0.15); }
          96%           { box-shadow: 0 0 0 12px rgba(28,61,46,0.04); }
        }
        .safety-btn { animation: safetyPulse 8s ease-in-out infinite; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="safety-btn fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest-900 text-cream-25 font-body text-sm font-medium shadow-lg hover:bg-forest-800 transition-colors"
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: '#2D7A4F' }}
        />
        Safety
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-forest-950/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[88dvh] overflow-y-auto">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-cream-200" />
          </div>

          <div className="px-5 pb-10 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Safety Plan</p>
                <p className="font-display text-2xl font-light text-forest-900">You are not alone.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full border border-cream-200 flex items-center justify-center text-cream-500 hover:border-cream-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Crisis resources — always first */}
            <div className="bg-cream-25 rounded-2xl px-4 py-4 space-y-3 border border-cream-100">
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">
                If you are in crisis right now
              </p>
              {sp.crisisResources.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <p className="font-body text-sm text-forest-900">{r.name}</p>
                  <p className="font-body text-[13px] font-semibold text-forest-600">{r.number}</p>
                </div>
              ))}
            </div>

            {/* Clinician */}
            <div className="rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1.5">
                Dr. Weedman
              </p>
              <p className="font-body text-[13px] text-forest-800 leading-relaxed">
                {sp.clinicianEmergencyContact}
              </p>
            </div>

            {/* What to do right now */}
            {sp.copingStrategies.length > 0 && (
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-3">
                  What to do right now
                </p>
                <ol className="space-y-2">
                  {sp.copingStrategies.map((s, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-forest-900 text-cream-25 font-body text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-body text-[13px] text-cream-700 leading-snug pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Warning signals */}
            {sp.warningSignals.length > 0 && (
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-2.5">
                  Warning signals to notice
                </p>
                <ul className="space-y-2">
                  {sp.warningSignals.map((s) => (
                    <li key={s} className="flex gap-2.5 items-start">
                      <span className="text-amber-400 text-[10px] shrink-0 mt-1">◆</span>
                      <span className="font-body text-[13px] text-cream-700 leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Support contacts */}
            {sp.supportContacts.length > 0 && (
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-2.5">
                  People who care about you
                </p>
                <div className="space-y-2">
                  {sp.supportContacts.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-cream-25 border border-cream-100"
                    >
                      <div>
                        <p className="font-body text-[13px] font-medium text-forest-900">{c.name}</p>
                        <p className="font-body text-[11px] text-cream-400">{c.relationship}</p>
                      </div>
                      <a
                        href={`tel:${c.phone.replace(/\D/g, '')}`}
                        className="font-body text-[13px] text-forest-600 font-medium"
                      >
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
