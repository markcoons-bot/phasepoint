'use client'

import { useState } from 'react'
import { drWeedman } from '@/data/patients'
import PatientSidebar    from '@/components/clinician/PatientSidebar'
import ClinicalWorkspace from '@/components/clinician/ClinicalWorkspace'
import ContextPanel      from '@/components/clinician/ContextPanel'

export default function ClinicianOSPage() {
  const { patients, rtmSummary } = drWeedman
  const [selectedId, setSelectedId]   = useState<string>(patients[0].id)
  const [journalOpen, setJournalOpen] = useState(false)

  const selectedPatient = patients.find(p => p.id === selectedId) ?? patients[0]

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: 'calc(100dvh - 56px)' }}
    >
      {/* ── Left sidebar: patient list ──────────────────────────────────────── */}
      <aside className="w-[260px] shrink-0 overflow-y-auto border-r border-cream-100 bg-white">
        <PatientSidebar
          patients={patients}
          selectedId={selectedId}
          onSelect={setSelectedId}
          rtmSummary={rtmSummary}
        />
      </aside>

      {/* ── Center: clinical workspace ──────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <ClinicalWorkspace
          patient={selectedPatient}
          journalOpen={journalOpen}
          onJournalOpenChange={setJournalOpen}
        />
      </main>

      {/* ── Right sidebar: context panel ────────────────────────────────────── */}
      <aside
        className="w-[320px] shrink-0 overflow-y-auto border-l border-cream-100"
        style={{ background: 'var(--surface-elevated)' }}
      >
        <ContextPanel
          patient={selectedPatient}
          rtmSummary={rtmSummary}
          onOpenJournal={() => setJournalOpen(true)}
        />
      </aside>
    </div>
  )
}
