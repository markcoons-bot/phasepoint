'use client'

import { Patient, EMDRPhase, RTMSummary } from '@/data/types'
import MoodSparkline from '@/components/ui/MoodSparkline'
import PhaseIndicator from '@/components/ui/PhaseIndicator'

interface Props {
  patients: Patient[]
  selectedId: string
  onSelect: (id: string) => void
  rtmSummary: RTMSummary
}

function avatarStyle(phase: EMDRPhase): string {
  if (phase <= 2) return 'bg-sage-100 text-forest-700 border border-sage-300'
  if (phase <= 6) return 'bg-amber-100 text-amber-600 border border-amber-400/50'
  return 'bg-forest-900 text-cream-25 border border-forest-700'
}

function alertDotColor(patient: Patient): string | null {
  const unacked = patient.alerts.filter(a => !a.acknowledged)
  if (unacked.some(a => a.level === 'crisis' || a.level === 'urgent')) return '#8B2020'
  if (unacked.some(a => a.level === 'clinical')) return '#C8922E'
  if (unacked.some(a => a.level === 'info')) return '#5FA882'
  return null
}

export default function PatientSidebar({ patients, selectedId, onSelect, rtmSummary }: Props) {
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-cream-100">
        <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-0.5">Caseload</p>
        <p className="font-body text-sm font-medium text-forest-900">
          {patients.length} Patients &middot; {rtmSummary.month}
        </p>
      </div>

      {/* Patient list */}
      <div className="flex-1 overflow-y-auto py-1">
        {patients.map(patient => {
          const isSelected = patient.id === selectedId
          const dotColor   = alertDotColor(patient)
          const rtmRecord  = rtmSummary.perPatient.find(r => r.patientId === patient.id)

          return (
            <button
              key={patient.id}
              onClick={() => onSelect(patient.id)}
              className={[
                'w-full text-left px-4 py-3 border-r-2 transition-colors',
                isSelected
                  ? 'bg-forest-900/5 border-forest-900'
                  : 'border-transparent hover:bg-cream-25',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">

                {/* Avatar with alert dot */}
                <div className="relative shrink-0 mt-0.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-body font-semibold ${avatarStyle(patient.currentPhase as EMDRPhase)}`}>
                    {patient.initials}
                  </div>
                  {dotColor && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-white"
                      style={{ backgroundColor: dotColor }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <p className="font-body text-[13px] font-medium text-forest-900 truncate leading-snug">
                      {patient.name}
                    </p>
                    {rtmRecord?.billable && (
                      <span className="text-[9px] font-body text-forest-500 shrink-0 leading-none">RTM ✓</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <PhaseIndicator phase={patient.currentPhase as EMDRPhase} showName={false} size="sm" />
                    <span className="text-[10px] font-body text-cream-400">
                      S{patient.sessionCount}
                    </span>
                  </div>

                  {/* Micro sparkline */}
                  {patient.checkIns.length > 0 && (
                    <div className="mt-1.5">
                      <MoodSparkline checkIns={patient.checkIns} maxHeight={14} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* RTM summary footer */}
      <div className="border-t border-cream-100 bg-sage-50 px-4 py-3.5">
        <p className="text-[9px] font-body uppercase tracking-[0.1em] text-cream-400 mb-2.5">
          RTM — {rtmSummary.month}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-display text-2xl font-light text-forest-900 leading-none">
              {rtmSummary.atThreshold}
              <span className="text-sm text-cream-400 ml-1">/ {rtmSummary.totalPatients}</span>
            </p>
            <p className="text-[10px] font-body text-cream-400 mt-0.5">at threshold</p>
          </div>
          <div>
            <p className="font-display text-2xl font-light text-forest-700 leading-none">
              ${rtmSummary.estimatedBilling.toLocaleString()}
            </p>
            <p className="text-[10px] font-body text-cream-400 mt-0.5">est. monthly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
