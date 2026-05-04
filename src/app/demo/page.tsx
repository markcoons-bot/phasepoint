'use client'

import { useState } from 'react'
import { drWeedman } from '@/data/patients'
import HomeHero             from '@/components/portal/HomeHero'
import PatientSwitcher      from '@/components/portal/PatientSwitcher'
import NavCards             from '@/components/portal/NavCards'
import MoodSection          from '@/components/portal/MoodSection'
import GroundSection        from '@/components/portal/GroundSection'
import JournalSection       from '@/components/portal/JournalSection'
import SessionMemorySection from '@/components/portal/SessionMemorySection'
import SafetyButton         from '@/components/portal/SafetyButton'

const { patients } = drWeedman

export default function DemoPage() {
  const [selectedId, setSelectedId] = useState(patients[0].id)
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  return (
    <div className="w-full">

      {/* Demo mode banner */}
      <div className="flex justify-center py-2 px-4" style={{ background: 'var(--surface-base)' }}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="font-body text-[11px] text-amber-700 tracking-wide">
            Demo Mode &middot; All patient data is fictional &middot; Journal AI reflection is live
          </span>
        </div>
      </div>

      {/* Patient switcher — sticky below nav */}
      <div
        className="sticky z-20 px-4 py-3 border-b border-cream-100"
        style={{ top: '56px', background: 'var(--surface-base)' }}
      >
        <PatientSwitcher
          patients={patients}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Scrollable content — keyed to patient so tool states reset on switch */}
      <div
        key={selectedId}
        className="max-w-[680px] mx-auto w-full px-4 pb-28 space-y-10 pt-6"
      >

        {/* Hero */}
        <HomeHero patient={patient} />

        {/* Quick nav */}
        <NavCards patient={patient} />

        {/* Mood / check-ins */}
        <section id="mood" className="space-y-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.15em] text-cream-400">
              How you&rsquo;ve been
            </p>
            <h2 className="font-display text-2xl font-light text-forest-900 mt-0.5">
              This week
            </h2>
          </div>
          <MoodSection patient={patient} />
        </section>

        {/* Ground & Regulate */}
        <section id="ground" className="space-y-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.15em] text-cream-400">
              Tools for right now
            </p>
            <h2 className="font-display text-2xl font-light text-forest-900 mt-0.5">
              Ground &amp; Regulate
            </h2>
            <p className="font-body text-[13px] text-cream-500 mt-1 leading-relaxed">
              These tools work with your nervous system directly.
              Use any time — between sessions, after a trigger, or before sleep.
            </p>
          </div>
          <GroundSection patient={patient} />
        </section>

        {/* Journal */}
        <section id="journal" className="space-y-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.15em] text-cream-400">
              Write &amp; reflect
            </p>
            <h2 className="font-display text-2xl font-light text-forest-900 mt-0.5">
              Journal
            </h2>
          </div>
          <JournalSection patient={patient} />
        </section>

        {/* Session Memory */}
        <section id="session" className="space-y-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.15em] text-cream-400">
              Where the work stands
            </p>
            <h2 className="font-display text-2xl font-light text-forest-900 mt-0.5">
              Session Memory
            </h2>
          </div>
          <SessionMemorySection patient={patient} />
        </section>

      </div>

      {/* Safety disclaimer — always at bottom */}
      <div className="max-w-[680px] mx-auto w-full px-4 pb-6 text-center">
        <p className="font-body text-[10px] text-cream-300 leading-relaxed">
          Phasepoint is a between-session support tool provided by your therapist.
          It is not a therapist or emergency service.
          If you are in immediate danger, call 911.
          Crisis support: call or text&nbsp;988.
        </p>
      </div>

      {/* Floating safety button — always visible */}
      <SafetyButton patient={patient} />
    </div>
  )
}
