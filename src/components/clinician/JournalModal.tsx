'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Patient } from '@/data/types'
import { X, Clock, FileText } from 'lucide-react'

interface Props {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Static demo content for Sarah Chen ──────────────────────────────────────

const SARAH_JOURNAL = {
  entryDate: 'Thursday, May 1 · 8:47 PM',
  text: `I was coming home from my sister's and took the 101. I didn't plan it — I went the wrong way at the merge and was on the on-ramp before I realized.

The moment I saw the cars merging I felt it in my chest first. Like a hand pressing against my sternum from inside. Then my hands got tight on the wheel. The cars behind me were close.

I noticed I was holding my breath.

I did what you showed me. I said "I notice tightness in my chest" — not "I am scared," just what was there. Then I breathed. I could feel the seat under me. The radio was on. I named things I could see through the windshield.

The SUDS was probably a 7 at the peak. But it came down. By the time I merged it was maybe a 4. I kept my hands steady.

I didn't get off the highway.

That felt important to write down.`,
  aiResponse: `This is significant, Sarah. You stayed on the highway. That's not nothing — that's the work showing up in real life.

What you described — the observation before the reaction, the breath, the grounding — is exactly what Phase 2 was building toward. You didn't need me in that car. You used what you have.

The chest tightness, the breath holding, the 7-to-4 — all of this is information we'll work with in Tuesday's session. Don't analyze it tonight. Just know that you handled it.`,
  aiResponseTime: 'AI draft · 9:12 PM',
  rtmNote: 'Between-session clinical activity documented: patient applied Phase 2 stabilization skills independently in response to anxiety trigger. SUDS 7→4 with grounding exercise. No safety concerns. This entry is eligible for RTM review documentation (CPT 98980).',
  reviewMinutes: 4,
}

// ─── Generic placeholder for other patients ──────────────────────────────────

function JournalPlaceholder({ patient }: { patient: Patient }) {
  return (
    <div className="text-center py-10 space-y-3">
      <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center mx-auto">
        <FileText size={18} className="text-forest-600" />
      </div>
      <p className="font-body text-sm text-cream-600">
        No journal entries this week for {patient.name.split(' ')[0]}.
      </p>
      <p className="font-body text-xs text-cream-400">
        Prompt sent: &ldquo;{patient.journalPrompt.slice(0, 80)}…&rdquo;
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function JournalModal({ patient, open, onOpenChange }: Props) {
  const isSarah = patient.id === 'pt-001'
  const journal = isSarah ? SARAH_JOURNAL : null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                     w-[90vw] max-w-[640px] max-h-[85dvh] overflow-hidden flex flex-col
                     bg-white rounded-2xl shadow-[0_24px_64px_rgba(26,26,24,0.18)] border border-cream-100"
          aria-describedby="journal-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-full bg-forest-900 flex items-center justify-center">
                  <span className="text-[9px] font-body font-semibold text-cream-25">
                    {patient.initials}
                  </span>
                </div>
                <Dialog.Title className="font-body text-sm font-semibold text-forest-900">
                  {patient.name} — Journal Entry
                </Dialog.Title>
              </div>
              <p className="font-body text-xs text-cream-400">
                Prompt: &ldquo;{patient.journalPrompt.slice(0, 70)}…&rdquo;
              </p>
            </div>
            <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-cream-400 hover:text-cream-600 hover:bg-cream-50 transition-colors">
              <X size={16} />
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div id="journal-description" className="flex-1 overflow-y-auto">
            {journal ? (
              <div className="p-6 space-y-5">

                {/* Patient entry */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">
                      Patient Entry
                    </span>
                    <span className="text-[10px] font-body text-cream-300 mx-1">·</span>
                    <Clock size={10} className="text-cream-400" />
                    <span className="text-[10px] font-body text-cream-400">{journal.entryDate}</span>
                  </div>
                  <div className="bg-cream-25 rounded-xl px-5 py-4">
                    <p className="font-body text-[13.5px] text-cream-800 leading-[1.75] whitespace-pre-line">
                      {journal.text}
                    </p>
                  </div>
                </div>

                {/* AI-drafted response */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">
                      AI Draft Response
                    </span>
                    <span className="text-[10px] font-body text-cream-300 mx-1">·</span>
                    <span className="text-[10px] font-body text-cream-400">{journal.aiResponseTime}</span>
                  </div>
                  <div className="bg-sage-50 border border-sage-200 rounded-xl px-5 py-4">
                    <p className="font-body text-[13.5px] text-forest-800 leading-[1.75] whitespace-pre-line">
                      {journal.aiResponse}
                    </p>
                  </div>
                  <p className="font-body text-[10px] text-cream-400 mt-2 italic">
                    AI-drafted. Requires clinician review before sending.
                  </p>
                </div>

                {/* RTM note */}
                <div className="bg-amber-100/60 border border-amber-400/25 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-body uppercase tracking-[0.1em] text-amber-600 mb-1.5">
                    RTM Documentation Note
                  </p>
                  <p className="font-body text-[12px] text-cream-700 leading-relaxed">
                    {journal.rtmNote}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={10} className="text-amber-600" />
                    <span className="font-body text-[10px] text-amber-600">
                      Estimated review time: {journal.reviewMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <JournalPlaceholder patient={patient} />
            )}
          </div>

          {/* Footer actions */}
          {journal && (
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-cream-100 shrink-0 bg-cream-25/50">
              <span className="font-body text-[11px] text-cream-400 italic">
                Session {patient.sessionCount} · {patient.lastSessionDate}
              </span>
              <div className="flex items-center gap-2">
                <button className="font-body text-[13px] font-medium px-4 py-2 rounded-lg border border-cream-200 text-cream-600 hover:border-cream-300 hover:text-cream-800 transition-colors">
                  Log as Reviewed
                </button>
                <button className="font-body text-[13px] font-medium px-4 py-2 rounded-lg bg-forest-900 text-cream-25 hover:bg-forest-800 transition-colors">
                  Send to {patient.name.split(' ')[0]} →
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
