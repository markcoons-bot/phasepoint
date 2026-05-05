'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { drWeedman } from '@/data/patients'
import { Patient, EMDRPhase } from '@/data/types'
import PhaseIndicator from '@/components/ui/PhaseIndicator'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SudsEntry { time: string; value: number }
interface VocEntry  { time: string; value: number }
interface BlsSet {
  id: string; modality: string; speed: string
  sets: number; sudsB4: number; sudsAfter: number; time: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const phaseNames: Record<EMDRPhase, string> = {
  1: 'History Taking', 2: 'Preparation', 3: 'Assessment',
  4: 'Desensitization', 5: 'Installation', 6: 'Body Scan',
  7: 'Closure', 8: 'Reevaluation',
}

const ALL_RX_TOOLS = [
  { id: 'window_checkin',    label: 'Window of Tolerance Check-in' },
  { id: 'physio_sigh',       label: 'Physiological Sigh' },
  { id: 'box_breathing',     label: 'Box Breathing' },
  { id: 'grounding_5senses', label: '5-4-3-2-1 Grounding' },
  { id: 'closure_ritual',    label: 'Closure Ritual' },
  { id: 'journal',           label: 'Journal' },
  { id: 'session_memory',    label: 'Session Memory (read-only)' },
  { id: 'bls_resourcing',    label: 'Bilateral Stimulation' },
  { id: 'safe_place',        label: 'Safe Place' },
  { id: 'container',         label: 'Container' },
  { id: 'butterfly_hug',     label: 'Butterfly Hug' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[10px] uppercase tracking-[0.12em] text-cream-400 mb-2">
      {children}
    </p>
  )
}

function SudsButton({ value, active, onClick }: { value: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-10 h-10 rounded-xl font-body text-sm font-semibold transition-all',
        active
          ? value <= 3 ? 'bg-sage-600 text-white scale-110 shadow-sm'
            : value <= 6 ? 'bg-amber-500 text-white scale-110 shadow-sm'
            : 'bg-red-500 text-white scale-110 shadow-sm'
          : 'bg-cream-100 text-cream-600 hover:bg-cream-200',
      ].join(' ')}
    >
      {value}
    </button>
  )
}

// Right-column tab content

function PatientRecordPanel({ patient }: { patient: Patient }) {
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')
  return (
    <div className="p-5 space-y-5">
      <div>
        <SectionTitle>Current phase</SectionTitle>
        <PhaseIndicator phase={patient.currentPhase as EMDRPhase} size="md" />
        <p className="font-body text-[12px] text-cream-500 mt-1.5 leading-relaxed">{patient.therapistNote}</p>
      </div>
      {touchstone && (
        <div>
          <SectionTitle>Active target</SectionTitle>
          <div className="bg-cream-25 rounded-xl border border-cream-200 px-4 py-3 space-y-1.5">
            <p className="font-body text-[13px] font-medium text-forest-900">{touchstone.label}</p>
            <div className="flex gap-4 font-body text-[11px] text-cream-400">
              <span>SUDS {touchstone.sudsCurrentt} / {touchstone.sudsBaseline}</span>
              {touchstone.voc != null && <span>VOC {touchstone.voc}/7</span>}
            </div>
            {touchstone.negativeCognition && (
              <p className="font-body text-[11px] text-amber-600 italic">NC: "{touchstone.negativeCognition}"</p>
            )}
            {touchstone.positiveCognition && (
              <p className="font-body text-[11px] text-forest-600 italic">PC: "{touchstone.positiveCognition}"</p>
            )}
          </div>
        </div>
      )}
      <div>
        <SectionTitle>Resource team</SectionTitle>
        {patient.resources.length === 0 ? (
          <p className="font-body text-[12px] text-cream-400">No resources installed yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {patient.resources.map(r => (
              <span key={r.id} className="px-2.5 py-1 rounded-full bg-sage-100 border border-sage-200 font-body text-[11px] text-forest-700">
                {r.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <SectionTitle>Safety plan</SectionTitle>
        <div className="bg-cream-25 rounded-xl border border-cream-100 px-4 py-3 space-y-1">
          {patient.safetyPlan.crisisResources.map(r => (
            <div key={r.name} className="flex justify-between">
              <span className="font-body text-[12px] text-forest-900">{r.name}</span>
              <span className="font-body text-[12px] font-semibold text-forest-600">{r.number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MemoryNetworkPanel({ patient }: { patient: Patient }) {
  const [selected, setSelected] = useState<string | null>(null)
  const nodes = patient.memoryNetwork

  const typeColor: Record<string, string> = {
    touchstone: 'bg-amber-100 border-amber-300 text-amber-800',
    associated: 'bg-cream-100 border-cream-200 text-cream-700',
    trigger: 'bg-red-50 border-red-200 text-red-700',
    future_template: 'bg-sage-100 border-sage-200 text-forest-700',
  }

  const selectedNode = nodes.find(n => n.id === selected)

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-wrap gap-2">
        {nodes.map(n => (
          <button
            key={n.id}
            onClick={() => setSelected(s => s === n.id ? null : n.id)}
            className={[
              'px-3 py-1.5 rounded-lg border font-body text-[11px] font-medium transition-colors text-left',
              selected === n.id ? 'ring-2 ring-forest-900 ring-offset-1' : '',
              typeColor[n.type] ?? 'bg-cream-100 border-cream-200 text-cream-700',
            ].join(' ')}
          >
            {n.label}
            {n.sudsCurrentt != null && (
              <span className="ml-1.5 opacity-60">SUDS {n.sudsCurrentt}</span>
            )}
          </button>
        ))}
      </div>
      {selectedNode && (
        <div className="rounded-xl border border-cream-200 bg-cream-25 px-4 py-4 space-y-2">
          <p className="font-body text-[13px] font-semibold text-forest-900">{selectedNode.label}</p>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-body">
            {selectedNode.sudsBaseline != null && <div><span className="text-cream-400">Baseline SUDS</span><p className="font-semibold text-forest-900">{selectedNode.sudsBaseline}</p></div>}
            {selectedNode.sudsCurrentt != null && <div><span className="text-cream-400">Current SUDS</span><p className="font-semibold text-forest-900">{selectedNode.sudsCurrentt}</p></div>}
            {selectedNode.voc != null && <div><span className="text-cream-400">VOC</span><p className="font-semibold text-forest-900">{selectedNode.voc}/7</p></div>}
          </div>
          {selectedNode.negativeCognition && <p className="font-body text-[11px] text-amber-600 italic">"{selectedNode.negativeCognition}"</p>}
          {selectedNode.positiveCognition && <p className="font-body text-[11px] text-forest-600 italic">"{selectedNode.positiveCognition}"</p>}
          {selectedNode.clinicalNotes && <p className="font-body text-[11px] text-cream-500">{selectedNode.clinicalNotes}</p>}
        </div>
      )}
    </div>
  )
}

function ResourcesPanel({ patient }: { patient: Patient }) {
  const [reinforced, setReinforced] = useState<Set<string>>(new Set())
  return (
    <div className="p-5 space-y-3">
      {patient.resources.length === 0 ? (
        <p className="font-body text-[13px] text-cream-400">No resources installed yet.</p>
      ) : (
        patient.resources.map(r => (
          <div key={r.id} className="rounded-xl border border-cream-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-body text-[13px] font-medium text-forest-900">{r.name}</p>
              <p className="font-body text-[11px] text-cream-400 capitalize mt-0.5">
                {r.type.replace(/_/g, ' ')}
                {r.strengthRating != null && ` · Strength ${r.strengthRating}/10`}
              </p>
            </div>
            <button
              onClick={() => setReinforced(s => new Set([...s, r.id]))}
              className={[
                'px-3 py-1.5 rounded-lg font-body text-[11px] font-medium transition-colors shrink-0',
                reinforced.has(r.id)
                  ? 'bg-sage-100 text-forest-700 border border-sage-200'
                  : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
              ].join(' ')}
            >
              {reinforced.has(r.id) ? 'Reinforced ✓' : 'Reinforce'}
            </button>
          </div>
        ))
      )}
    </div>
  )
}

function RxPanel({
  patient, sessionRx, onToggle,
}: {
  patient: Patient; sessionRx: string[]; onToggle: (id: string) => void
}) {
  return (
    <div className="p-5 space-y-3">
      <p className="font-body text-[13px] text-cream-600 leading-relaxed">
        What's prescribed for this week? Changes take effect on patient portal when session closes.
      </p>
      <div className="space-y-2">
        {ALL_RX_TOOLS.map(tool => (
          <label key={tool.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sessionRx.includes(tool.id)}
              onChange={() => onToggle(tool.id)}
              className="w-4 h-4 accent-forest-900"
            />
            <span className="font-body text-[13px] text-cream-700">{tool.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Post-session close modal ─────────────────────────────────────────────────

function CloseModal({
  patient, sessionNum, sudsLog, blsSets,
  sessionNotes, therapistNote, onNoteChange,
  sessionRx, onRxToggle, nextNotes, onNextNotesChange,
  onComplete,
}: {
  patient: Patient; sessionNum: number
  sudsLog: SudsEntry[]; blsSets: BlsSet[]
  sessionNotes: string; therapistNote: string; onNoteChange: (v: string) => void
  sessionRx: string[]; onRxToggle: (id: string) => void
  nextNotes: string; onNextNotesChange: (v: string) => void
  onComplete: () => void
}) {
  const startSuds = sudsLog[0]?.value ?? '—'
  const endSuds   = sudsLog[sudsLog.length - 1]?.value ?? '—'
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest-950/60 backdrop-blur-sm p-4 md:items-center">
      <div className="w-full max-w-[600px] bg-white rounded-3xl overflow-hidden max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-5 border-b border-cream-100 bg-cream-25 sticky top-0">
          <h2 className="font-display text-2xl font-light text-forest-900">Close Session {sessionNum}</h2>
          <p className="font-body text-[13px] text-cream-500 mt-0.5">5 minutes to capture what matters. Then you're done.</p>
        </div>

        <div className="px-6 py-5 space-y-7">

          {/* 1. Session Summary */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-3">1 — Session Summary</p>
            <div className="bg-cream-25 rounded-2xl border border-cream-100 px-4 py-4 space-y-2">
              <div className="grid grid-cols-2 gap-3 font-body text-[13px]">
                <div>
                  <p className="text-cream-400 text-[10px] uppercase tracking-[0.1em]">SUDS trajectory</p>
                  <p className="font-semibold text-forest-900 mt-0.5">{startSuds} → {endSuds}</p>
                </div>
                {touchstone && (
                  <div>
                    <p className="text-cream-400 text-[10px] uppercase tracking-[0.1em]">Target worked</p>
                    <p className="font-medium text-forest-900 mt-0.5 leading-snug text-[12px]">{touchstone.label}</p>
                  </div>
                )}
                <div>
                  <p className="text-cream-400 text-[10px] uppercase tracking-[0.1em]">BLS sets logged</p>
                  <p className="font-semibold text-forest-900 mt-0.5">{blsSets.length}</p>
                </div>
                <div>
                  <p className="text-cream-400 text-[10px] uppercase tracking-[0.1em]">Phase {patient.currentPhase}</p>
                  <p className="font-medium text-forest-900 mt-0.5 capitalize">{phaseNames[patient.currentPhase as EMDRPhase]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Write to patient */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1">2 — Write to {patient.name.split(' ')[0]}</p>
            <p className="font-body text-[12px] text-cream-400 mb-2 leading-relaxed">
              Write what you'd say if you were walking them to the door. This appears on their home screen tonight.
            </p>
            <textarea
              value={therapistNote}
              onChange={e => onNoteChange(e.target.value)}
              rows={5}
              placeholder="Write here. This is the most important field."
              className="w-full px-4 py-3.5 rounded-2xl border border-cream-200 bg-white font-display text-[15px] font-light text-forest-900 placeholder:text-cream-300 placeholder:font-body placeholder:text-[13px] leading-[1.7] italic resize-none focus:outline-none focus:border-sage-400 transition-colors"
            />
          </div>

          {/* 3. This week's prescription */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-3">3 — This Week's Prescription</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_RX_TOOLS.map(tool => (
                <label key={tool.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sessionRx.includes(tool.id)}
                    onChange={() => onRxToggle(tool.id)}
                    className="w-3.5 h-3.5 accent-forest-900"
                  />
                  <span className="font-body text-[12px] text-cream-700">{tool.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Next session notes */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1">4 — Anything for next session</p>
            <p className="font-body text-[12px] text-cream-400 mb-2">Clinical reminders for yourself — not shared with patient.</p>
            <textarea
              value={nextNotes}
              onChange={e => onNextNotesChange(e.target.value)}
              rows={3}
              placeholder="e.g. Start of Phase 8 reevaluation, check in on sleep..."
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white font-body text-[13px] text-forest-900 placeholder:text-cream-300 resize-none focus:outline-none focus:border-sage-400 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-100 bg-cream-25 sticky bottom-0">
          <button
            onClick={onComplete}
            className="w-full py-3.5 rounded-xl bg-forest-900 text-cream-25 font-body text-sm font-medium hover:bg-forest-800 transition-colors"
          >
            Complete Session →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  patient, therapistNote, sessionNum,
}: {
  patient: Patient; therapistNote: string; sessionNum: number
}) {
  const router = useRouter()
  const firstName = patient.name.split(' ')[0]
  const noteToShow = therapistNote || patient.therapistNote

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12" style={{ background: 'var(--surface-base)' }}>
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D7A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-display text-[32px] font-light text-forest-900">Session {sessionNum} closed.</h1>
          <div className="space-y-1">
            <p className="font-body text-[14px] text-forest-600">{patient.name}'s portal has been updated.</p>
            <p className="font-body text-[13px] text-cream-400">Their prescription is active. Your note will appear on their home screen.</p>
          </div>
        </div>

        {/* Portal preview — the BOOM moment */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 mb-3 text-center">
            What {firstName} sees when they open the app
          </p>
          <div className="bg-forest-900 rounded-3xl px-6 py-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cream-25/15 flex items-center justify-center">
                <span className="font-body text-[9px] font-semibold text-sage-200">BW</span>
              </div>
              <p className="font-body text-[11px] text-sage-300/70 uppercase tracking-[0.1em]">Dr. Weedman</p>
            </div>
            <p className="font-display text-[17px] font-light text-cream-50 italic leading-[1.7]">
              &ldquo;{noteToShow || 'Your note will appear here.'}&rdquo;
            </p>
            <p className="font-body text-[10px] text-sage-300/40 uppercase tracking-[0.08em]">Just now</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/clinician')}
            className="w-full py-3.5 rounded-xl bg-forest-900 text-cream-25 font-body text-sm font-medium hover:bg-forest-800 transition-colors"
          >
            Return to Dashboard →
          </button>
          <Link
            href="/demo"
            className="block w-full py-3.5 rounded-xl border border-forest-200 text-forest-800 font-body text-sm font-medium hover:bg-sage-50 transition-colors text-center"
          >
            View Patient Portal →
          </Link>
        </div>

        <p className="text-center font-body text-[11px] text-cream-400">
          In the full product, {firstName}'s portal updates in real-time as you complete the session.
        </p>
      </div>
    </div>
  )
}

// ─── Main Session page ────────────────────────────────────────────────────────

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = typeof params.patientId === 'string' ? params.patientId : ''
  const patient: Patient = drWeedman.patients.find(p => p.id === patientId) ?? drWeedman.patients[0]
  const sessionNum = patient.sessionCount + 1

  // Timer
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const timerDisplay = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  // SUDS / VOC
  const [sudsLog, setSudsLog] = useState<SudsEntry[]>([])
  const [vocLog, setVocLog] = useState<VocEntry[]>([])
  const currentSUDS = sudsLog.length > 0 ? sudsLog[sudsLog.length - 1].value : null
  const currentVOC  = vocLog.length > 0  ? vocLog[vocLog.length - 1].value  : null

  function logSuds(v: number) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setSudsLog(prev => [...prev, { time, value: v }])
  }
  function logVoc(v: number) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setVocLog(prev => [...prev, { time, value: v }])
  }

  // Notes
  const [sessionNotes, setSessionNotes] = useState('')
  const wordCount = sessionNotes.trim() ? sessionNotes.trim().split(/\s+/).length : 0

  // Structured capture
  const [activeTargetId, setActiveTargetId] = useState<string>(
    patient.memoryNetwork.find(n => n.type === 'touchstone')?.id ?? ''
  )
  const [blsSets, setBlsSets] = useState<BlsSet[]>([])
  const [addingBls, setAddingBls] = useState(false)
  const [blsDraft, setBlsDraft] = useState({ modality: 'visual', speed: 'standard', sets: 4, sudsB4: 5, sudsAfter: 3 })
  const [resourceWork, setResourceWork] = useState(false)
  const [phaseDecision, setPhaseDecision] = useState<'continue' | 'advance' | 'return' | 'defer'>('continue')
  const [confirmPhase, setConfirmPhase] = useState(false)

  // Right column tabs
  const [activeTab, setActiveTab] = useState<'record' | 'network' | 'resources' | 'rx'>('record')

  // Session Rx
  const [sessionRx, setSessionRx] = useState<string[]>(patient.prescribedTools)
  function toggleRx(id: string) {
    setSessionRx(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  // Close flow
  const [closing, setClosing] = useState(false)
  const [done, setDone] = useState(false)
  const [therapistNote, setTherapistNote] = useState('')
  const [nextNotes, setNextNotes] = useState('')

  function addBlsSet() {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setBlsSets(prev => [...prev, { id: Date.now().toString(), ...blsDraft, time }])
    setAddingBls(false)
    setBlsDraft({ modality: 'visual', speed: 'standard', sets: 4, sudsB4: 5, sudsAfter: 3 })
  }

  const targetNode = patient.memoryNetwork.find(n => n.id === activeTargetId)
  const nextPhase = Math.min(8, patient.currentPhase + 1) as EMDRPhase
  const prevPhase = Math.max(1, patient.currentPhase - 1) as EMDRPhase

  if (done) {
    return <SuccessScreen patient={patient} therapistNote={therapistNote} sessionNum={sessionNum} />
  }

  return (
    <>
      {/* Pulse animation for pill */}
      <style>{`
        @keyframes sessionPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .session-pulse { animation: sessionPulse 2s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 56px)' }}>

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-cream-100 px-4 md:px-6 py-3 flex items-center gap-4 flex-wrap">
          <span className="session-pulse inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Session in Progress
          </span>

          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-light text-forest-900">{patient.name}</span>
            <PhaseIndicator phase={patient.currentPhase as EMDRPhase} showName={false} size="sm" />
            <span className="font-body text-[11px] text-cream-400">Session {sessionNum}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[13px] text-cream-500 tabular-nums">{timerDisplay}</span>
            <button
              onClick={() => setClosing(true)}
              className="px-4 py-2 rounded-lg bg-forest-900 text-cream-25 font-body text-[12px] font-medium hover:bg-forest-800 transition-colors"
            >
              End Session →
            </button>
          </div>
        </div>

        {/* ── Two-column body ──────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

          {/* LEFT — Notes & Capture (55%) */}
          <div className="flex-1 md:w-[55%] overflow-y-auto px-4 md:px-6 py-5 space-y-6 border-b md:border-b-0 md:border-r border-cream-100">

            {/* SUDS Tracker */}
            <div>
              <SectionTitle>Current SUDS</SectionTitle>
              <div className="flex items-end gap-4 flex-wrap mb-3">
                <span className={[
                  'font-display text-[56px] font-light leading-none transition-colors',
                  currentSUDS == null ? 'text-cream-200'
                    : currentSUDS <= 3 ? 'text-forest-600'
                    : currentSUDS <= 6 ? 'text-amber-500'
                    : 'text-red-500',
                ].join(' ')}>
                  {currentSUDS ?? '—'}
                </span>
                {sudsLog.length > 1 && (
                  <span className="font-body text-[12px] text-cream-400 mb-2">
                    was {sudsLog[0].value} at {sudsLog[0].time}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                  <SudsButton key={v} value={v} active={currentSUDS === v} onClick={() => logSuds(v)} />
                ))}
              </div>

              {/* VOC row */}
              <div className="mt-4">
                <p className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 mb-2">VOC (validity of cognition) 1–7</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7].map(v => (
                    <button
                      key={v}
                      onClick={() => logVoc(v)}
                      className={[
                        'w-9 h-9 rounded-lg font-body text-sm font-semibold transition-all',
                        currentVOC === v
                          ? 'bg-sage-700 text-white scale-110 shadow-sm'
                          : 'bg-cream-100 text-cream-600 hover:bg-cream-200',
                      ].join(' ')}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical notes */}
            <div>
              <SectionTitle>Session Notes</SectionTitle>
              <div className="relative">
                <textarea
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  rows={8}
                  placeholder="Type your session notes here. Free-form — write as you normally would. Structured data captured below."
                  className="w-full px-4 py-4 rounded-2xl border border-cream-200 bg-white font-body text-[14px] text-forest-900 placeholder:text-cream-300 placeholder:italic placeholder:font-display placeholder:font-light leading-[1.7] resize-none focus:outline-none focus:border-sage-400 transition-colors"
                />
                {wordCount > 0 && (
                  <p className="absolute bottom-3 right-4 font-body text-[10px] text-cream-300 pointer-events-none">
                    {wordCount}w
                  </p>
                )}
              </div>
            </div>

            {/* Active target */}
            <div>
              <SectionTitle>Active Target</SectionTitle>
              <select
                value={activeTargetId}
                onChange={e => setActiveTargetId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-white font-body text-[13px] text-forest-900 focus:outline-none focus:border-sage-400 transition-colors"
              >
                <option value="">— Select target —</option>
                {patient.memoryNetwork.filter(n => n.type !== 'future_template').map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
              {targetNode && (
                <div className="mt-2 flex gap-4 font-body text-[11px] text-cream-400">
                  {targetNode.sudsCurrentt != null && <span>SUDS {targetNode.sudsCurrentt}</span>}
                  {targetNode.voc != null && <span>VOC {targetNode.voc}/7</span>}
                  {targetNode.negativeCognition && <span className="italic text-amber-500">"{targetNode.negativeCognition}"</span>}
                </div>
              )}
            </div>

            {/* BLS sets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <SectionTitle>BLS Sets Logged</SectionTitle>
                {!addingBls && (
                  <button onClick={() => setAddingBls(true)} className="font-body text-[11px] text-forest-600 hover:text-forest-900 transition-colors">
                    + Log BLS Set
                  </button>
                )}
              </div>

              {addingBls && (
                <div className="bg-cream-25 rounded-xl border border-cream-100 px-4 py-4 space-y-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-body text-[10px] text-cream-400 mb-1">Modality</p>
                      <select value={blsDraft.modality} onChange={e => setBlsDraft(d => ({ ...d, modality: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[12px] focus:outline-none">
                        {['visual', 'auditory', 'tactile', 'butterfly_hug'].map(m => <option key={m} value={m}>{m === 'butterfly_hug' ? 'Butterfly Hug' : m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-cream-400 mb-1">Speed</p>
                      <select value={blsDraft.speed} onChange={e => setBlsDraft(d => ({ ...d, speed: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[12px] focus:outline-none">
                        {['gentle', 'standard', 'active'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-cream-400 mb-1">Sets</p>
                      <input type="number" min={1} max={20} value={blsDraft.sets} onChange={e => setBlsDraft(d => ({ ...d, sets: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[12px] text-center focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-body text-[10px] text-cream-400 mb-1">SUDS before</p>
                        <input type="number" min={0} max={10} value={blsDraft.sudsB4} onChange={e => setBlsDraft(d => ({ ...d, sudsB4: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[12px] text-center focus:outline-none" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] text-cream-400 mb-1">SUDS after</p>
                        <input type="number" min={0} max={10} value={blsDraft.sudsAfter} onChange={e => setBlsDraft(d => ({ ...d, sudsAfter: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[12px] text-center focus:outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addBlsSet} className="flex-1 py-2 rounded-lg bg-forest-900 text-cream-25 font-body text-[12px] font-medium hover:bg-forest-800 transition-colors">Add Set</button>
                    <button onClick={() => setAddingBls(false)} className="px-4 py-2 rounded-lg border border-cream-200 font-body text-[12px] text-cream-500 hover:bg-cream-50 transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {blsSets.length === 0 && !addingBls && (
                <p className="font-body text-[12px] text-cream-400">No sets logged yet.</p>
              )}
              {blsSets.map((set, i) => (
                <div key={set.id} className="flex items-center gap-3 py-2 border-b border-cream-50 last:border-0 font-body text-[11px]">
                  <span className="text-cream-400 tabular-nums">{set.time}</span>
                  <span className="text-forest-800 font-medium capitalize">{set.modality.replace('_', ' ')}</span>
                  <span className="text-cream-400">{set.speed}</span>
                  <span className="text-cream-400">{set.sets} sets</span>
                  <span className="ml-auto text-forest-600 font-medium">{set.sudsB4} → {set.sudsAfter}</span>
                </div>
              ))}
            </div>

            {/* Phase assessment */}
            <div>
              <SectionTitle>Phase Assessment</SectionTitle>
              <p className="font-body text-[12px] text-cream-500 mb-2">Phase status after this session:</p>
              <div className="space-y-2">
                {[
                  { val: 'continue' as const, label: `Continue Phase ${patient.currentPhase}` },
                  { val: 'advance' as const, label: `Advance to Phase ${nextPhase} — ${phaseNames[nextPhase]}` },
                  { val: 'return' as const, label: `Return to Phase ${prevPhase}` },
                  { val: 'defer' as const, label: 'Defer — document reason' },
                ].map(opt => (
                  <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="phase"
                      checked={phaseDecision === opt.val}
                      onChange={() => { setPhaseDecision(opt.val); if (opt.val === 'advance') setConfirmPhase(true) }}
                      className="accent-forest-900"
                    />
                    <span className="font-body text-[13px] text-cream-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              {confirmPhase && phaseDecision === 'advance' && (
                <div className="mt-3 bg-sage-50 rounded-xl border border-sage-200 px-4 py-3">
                  <p className="font-body text-[12px] text-forest-800">
                    Advancing to Phase {nextPhase} will update {patient.name.split(' ')[0]}'s portal experience. Confirm when session closes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Session Tools (45%) */}
          <div className="flex flex-col md:w-[45%] md:overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-cream-100 bg-white overflow-x-auto">
              {[
                { id: 'record',   label: 'Patient Record' },
                { id: 'network',  label: 'Memory Network' },
                { id: 'resources',label: 'Resources' },
                { id: 'rx',       label: 'Between-Session Rx' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={[
                    'relative px-4 py-2.5 text-[11px] font-body font-medium whitespace-nowrap transition-colors shrink-0',
                    activeTab === tab.id
                      ? 'text-forest-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-forest-900'
                      : 'text-cream-400 hover:text-cream-600',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="md:flex-1 md:overflow-y-auto">
              {activeTab === 'record'    && <PatientRecordPanel patient={patient} />}
              {activeTab === 'network'   && <MemoryNetworkPanel patient={patient} />}
              {activeTab === 'resources' && <ResourcesPanel patient={patient} />}
              {activeTab === 'rx'        && <RxPanel patient={patient} sessionRx={sessionRx} onToggle={toggleRx} />}
            </div>
          </div>
        </div>
      </div>

      {/* Close modal */}
      {closing && (
        <CloseModal
          patient={patient}
          sessionNum={sessionNum}
          sudsLog={sudsLog}
          blsSets={blsSets}
          sessionNotes={sessionNotes}
          therapistNote={therapistNote}
          onNoteChange={setTherapistNote}
          sessionRx={sessionRx}
          onRxToggle={toggleRx}
          nextNotes={nextNotes}
          onNextNotesChange={setNextNotes}
          onComplete={() => { setClosing(false); setDone(true) }}
        />
      )}
    </>
  )
}
