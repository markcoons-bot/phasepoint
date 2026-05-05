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
    <div className="block md:flex md:overflow-hidden md:h-[calc(100dvh-56px)]">

      {/* Mobile patient strip — hidden on md+ */}
      <div className="md:hidden border-b border-cream-100 bg-white px-4 py-2.5 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={[
                'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-body whitespace-nowrap transition-colors',
                selectedId === p.id
                  ? 'bg-forest-900 border-forest-900 text-cream-25'
                  : 'bg-white border-cream-200 text-cream-700 hover:border-forest-300',
              ].join(' ')}
            >
              <span className={[
                'w-5 h-5 rounded-full text-[9px] font-semibold flex items-center justify-center shrink-0',
                selectedId === p.id ? 'bg-cream-25/20 text-cream-25' : 'bg-forest-900/10 text-forest-900',
              ].join(' ')}>
                {p.initials}
              </span>
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Left sidebar: patient list — desktop only */}
      <aside className="hidden md:block md:w-[260px] md:shrink-0 md:overflow-y-auto border-r border-cream-100 bg-white">
        <PatientSidebar
          patients={patients}
          selectedId={selectedId}
          onSelect={setSelectedId}
          rtmSummary={rtmSummary}
        />
      </aside>

      {/* Center: clinical workspace */}
      <main className="flex-1 md:overflow-hidden flex flex-col min-h-0">
        <ClinicalWorkspace
          patient={selectedPatient}
          journalOpen={journalOpen}
          onJournalOpenChange={setJournalOpen}
        />
      </main>

      {/* Right sidebar: context panel — large screens only */}
      <aside
        className="hidden lg:block lg:w-[320px] lg:shrink-0 lg:overflow-y-auto border-l border-cream-100"
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
