'use client'

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { Patient, EMDRPhase } from '@/data/types'
import PhaseIndicator from '@/components/ui/PhaseIndicator'
import JournalModal from './JournalModal'
import OverviewTab       from './tabs/OverviewTab'
import MemoryNetworkTab  from './tabs/MemoryNetworkTab'
import TreatmentPlanTab  from './tabs/TreatmentPlanTab'
import TrajectoryTab     from './tabs/TrajectoryTab'
import BetweenSessionTab from './tabs/BetweenSessionTab'

interface Props {
  patient: Patient
  journalOpen: boolean
  onJournalOpenChange: (open: boolean) => void
}

const TAB_LIST = [
  { value: 'overview',   label: 'Overview'       },
  { value: 'network',    label: 'Memory Network' },
  { value: 'treatment',  label: 'Treatment Plan' },
  { value: 'trajectory', label: 'Trajectory'     },
  { value: 'between',    label: 'Between-Session' },
] as const

type TabValue = typeof TAB_LIST[number]['value']

// ─── Dissociation risk badge ──────────────────────────────────────────────────

const RISK_STYLES = {
  low:     'bg-sage-100 text-forest-700 border-sage-300',
  moderate:'bg-amber-100 text-amber-600 border-amber-400/50',
  high:    'bg-red-50 text-red-700 border-red-200',
  unknown: 'bg-cream-100 text-cream-500 border-cream-200',
}

export default function ClinicalWorkspace({ patient, journalOpen, onJournalOpenChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('overview')

  const unackedAlertCount = patient.alerts.filter(a => !a.acknowledged).length

  return (
    <div className="flex flex-col h-full">

      {/* ── Patient header ───────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-0 border-b border-cream-100 bg-white">

        {/* Top row: name + badges */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-body font-semibold text-cream-25">{patient.initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display text-2xl font-light text-forest-900 leading-tight">
                  {patient.name}
                </h2>
                {patient.pronouns && (
                  <span className="font-body text-xs text-cream-400">{patient.pronouns}</span>
                )}
                <span className="font-body text-xs text-cream-400">{patient.age}y</span>
              </div>
              <p className="font-body text-[12px] text-cream-500 mt-0.5 leading-snug">
                {patient.primaryDiagnosis}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
            <PhaseIndicator phase={patient.currentPhase as EMDRPhase} size="md" />
            {patient.dissociationRisk !== 'low' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-body font-medium capitalize ${RISK_STYLES[patient.dissociationRisk]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                Dissociation: {patient.dissociationRisk}
              </span>
            )}
            {unackedAlertCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-400/50 bg-amber-100 text-amber-700 text-xs font-body font-medium">
                {unackedAlertCount} alert{unackedAlertCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Meta row: session count, last session, modality */}
        <div className="flex items-center gap-4 pb-3 text-[11px] font-body text-cream-400">
          <span>Session {patient.sessionCount}</span>
          <span className="text-cream-200">·</span>
          <span>Last: {patient.lastSessionDate}</span>
          {patient.nextSessionDate && (
            <>
              <span className="text-cream-200">·</span>
              <span>Next: {patient.nextSessionDate}</span>
            </>
          )}
          <span className="text-cream-200">·</span>
          <span className="capitalize">{patient.modality.replace(/_/g, ' ')}</span>
        </div>

        {/* Tab bar */}
        <Tabs.Root value={activeTab} onValueChange={v => setActiveTab(v as TabValue)}>
          <Tabs.List className="flex items-end gap-0 -mb-px">
            {TAB_LIST.map(tab => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={[
                  'relative px-4 py-2.5 text-[12px] font-body font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.value
                    ? 'text-forest-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-forest-900 after:rounded-t-sm'
                    : 'text-cream-500 hover:text-cream-700',
                ].join(' ')}
              >
                {tab.label}
                {tab.value === 'network' && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-sage-100 text-forest-600 align-top">
                    {patient.memoryNetwork.length}
                  </span>
                )}
                {tab.value === 'between' && unackedAlertCount > 0 && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-500 align-middle" />
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>

      {/* ── Tab content (scrollable) ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-cream-25/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {activeTab === 'overview' && (
              <OverviewTab patient={patient} />
            )}
            {activeTab === 'network' && (
              <MemoryNetworkTab patient={patient} />
            )}
            {activeTab === 'treatment' && (
              <TreatmentPlanTab patient={patient} />
            )}
            {activeTab === 'trajectory' && (
              <TrajectoryTab patient={patient} />
            )}
            {activeTab === 'between' && (
              <BetweenSessionTab
                patient={patient}
                onViewJournal={() => onJournalOpenChange(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Journal modal — state owned by parent page */}
      <JournalModal
        patient={patient}
        open={journalOpen}
        onOpenChange={onJournalOpenChange}
      />
    </div>
  )
}
