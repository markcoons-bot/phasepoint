'use client'

import { Patient, RTMSummary, EMDRPhase } from '@/data/types'
import { AlertTriangle, AlertCircle, Info, CheckCircle, Send, BookOpen, Activity } from 'lucide-react'

interface Props {
  patient: Patient
  rtmSummary: RTMSummary
  onOpenJournal: () => void
}

// ─── Alert level styles ───────────────────────────────────────────────────────

const alertStyles = {
  crisis:   { bg: 'bg-red-50 border-red-200',   text: 'text-red-700',   label: 'Crisis',   Icon: AlertCircle   },
  urgent:   { bg: 'bg-red-50 border-red-200',   text: 'text-red-700',   label: 'Urgent',   Icon: AlertTriangle },
  clinical: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Clinical', Icon: AlertTriangle },
  info:     { bg: 'bg-sage-50 border-sage-200',  text: 'text-forest-700', label: 'Note',    Icon: Info         },
}

// ─── Pre-session brief (derived from patient data) ────────────────────────────

function PreSessionBrief({ patient }: { patient: Patient }) {
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')
  const latestSUDS = touchstone?.sudsCurrentt
  const baselineSUDS = touchstone?.sudsBaseline
  const recentSession = touchstone?.sessionHistory[touchstone.sessionHistory.length - 1]

  return (
    <div className="px-4 py-4 border-b border-cream-100">
      <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
        Pre-Session Brief
      </p>

      <div className="space-y-2.5">
        {/* Session number */}
        <div className="flex items-baseline justify-between">
          <span className="font-body text-[12px] text-cream-500">Next Session</span>
          <span className="font-body text-[13px] font-semibold text-forest-900">
            #{patient.sessionCount + 1} · Phase {patient.currentPhase}
          </span>
        </div>

        {/* SUDS movement */}
        {touchstone && latestSUDS != null && baselineSUDS != null && (
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[12px] text-cream-500">Touchstone SUDS</span>
            <span className="font-body text-[13px] font-medium text-forest-900">
              {baselineSUDS} → <span className="text-amber-600">{latestSUDS}</span>
            </span>
          </div>
        )}

        {/* Last session note */}
        {recentSession?.notes && (
          <div className="bg-sage-50 rounded-lg px-3 py-2 mt-1">
            <p className="text-[11px] font-body text-cream-400 mb-0.5">Session {recentSession.sessionNumber}</p>
            <p className="font-body text-[12px] text-forest-700 leading-snug italic">
              &ldquo;{recentSession.notes}&rdquo;
            </p>
          </div>
        )}

        {/* Dissociation risk */}
        {patient.dissociationRisk !== 'low' && (
          <div className="flex items-center justify-between">
            <span className="font-body text-[12px] text-cream-500">Dissociation Risk</span>
            <span className="font-body text-[12px] font-medium text-amber-600 capitalize">
              {patient.dissociationRisk}
            </span>
          </div>
        )}

        {/* Next session date */}
        {patient.nextSessionDate && (
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[12px] text-cream-500">Scheduled</span>
            <span className="font-body text-[12px] text-cream-600">{patient.nextSessionDate}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── RTM status ───────────────────────────────────────────────────────────────

function RTMStatus({ patient, rtmSummary }: { patient: Patient; rtmSummary: RTMSummary }) {
  const selected = rtmSummary.perPatient.find(r => r.patientId === patient.id)

  return (
    <div className="px-4 py-4 border-b border-cream-100">
      <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
        RTM Status — {rtmSummary.month}
      </p>

      {/* Selected patient RTM */}
      {selected && (
        <div className={`rounded-xl border px-3 py-2.5 mb-3 ${
          selected.billable ? 'border-forest-500/25 bg-forest-900/4' : 'border-cream-200 bg-cream-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-[12px] font-medium text-forest-900">{selected.patientName}</span>
            <span className={`text-[10px] font-body font-medium ${
              selected.billable ? 'text-forest-600' : 'text-cream-400'
            }`}>
              {selected.billable ? '✓ Billable' : 'Below threshold'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-body text-cream-500">
            <span>{selected.reviewMinutes} min reviewed</span>
            <span>&middot;</span>
            <span>{selected.datadays} data days</span>
            {selected.estimatedRevenue > 0 && (
              <>
                <span>&middot;</span>
                <span className="text-forest-600">${selected.estimatedRevenue}</span>
              </>
            )}
          </div>
          {selected.cptCodes.length > 0 && (
            <div className="flex gap-1.5 mt-1.5">
              {selected.cptCodes.map(code => (
                <span key={code} className="text-[9px] font-body px-1.5 py-0.5 rounded bg-forest-900/8 text-forest-700 tracking-wide">
                  CPT {code}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All patients mini list */}
      <div className="space-y-1.5">
        {rtmSummary.perPatient.map(record => (
          <div
            key={record.patientId}
            className={`flex items-center justify-between text-[11px] font-body px-2 py-1 rounded-md ${
              record.patientId === patient.id ? 'bg-forest-900/4' : ''
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                record.billable ? 'bg-forest-500' : 'bg-cream-300'
              }`} />
              <span className="text-cream-600">{record.patientName.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cream-400">{record.reviewMinutes}m</span>
              {record.estimatedRevenue > 0 && (
                <span className="text-forest-600">${record.estimatedRevenue}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-cream-100">
        <span className="font-body text-[11px] text-cream-400">
          {rtmSummary.atThreshold} / {rtmSummary.totalPatients} billable
        </span>
        <span className="font-body text-[12px] font-semibold text-forest-700">
          ${rtmSummary.estimatedBilling.toLocaleString()}/mo
        </span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContextPanel({ patient, rtmSummary, onOpenJournal }: Props) {
  const unackedAlerts = patient.alerts.filter(a => !a.acknowledged)

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Pre-session brief */}
      <PreSessionBrief patient={patient} />

      {/* Alerts */}
      {unackedAlerts.length > 0 && (
        <div className="px-4 py-4 border-b border-cream-100">
          <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
            Alerts ({unackedAlerts.length})
          </p>
          <div className="space-y-2">
            {unackedAlerts.map(alert => {
              const style = alertStyles[alert.level]
              const { Icon } = style
              return (
                <div key={alert.id} className={`rounded-xl border px-3 py-2.5 ${style.bg}`}>
                  <div className="flex items-start gap-2">
                    <Icon size={13} className={`${style.text} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-body uppercase tracking-wide font-medium ${style.text}`}>
                          {style.label}
                        </span>
                        <span className="text-[9px] font-body text-cream-400">
                          {new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className={`font-body text-[12px] leading-snug ${style.text.replace('700', '800')}`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No alerts state */}
      {unackedAlerts.length === 0 && (
        <div className="px-4 py-4 border-b border-cream-100">
          <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">Alerts</p>
          <div className="flex items-center gap-2 text-forest-600">
            <CheckCircle size={13} />
            <p className="font-body text-[12px] text-cream-500">No unacknowledged alerts</p>
          </div>
        </div>
      )}

      {/* RTM Status */}
      <RTMStatus patient={patient} rtmSummary={rtmSummary} />

      {/* Send to Patient */}
      <div className="px-4 py-4">
        <p className="text-[10px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Send to Patient
        </p>
        <div className="space-y-2">
          <button
            onClick={onOpenJournal}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-cream-200 text-left hover:border-forest-900/25 hover:bg-forest-900/3 transition-colors group"
          >
            <BookOpen size={14} className="text-cream-400 group-hover:text-forest-700 transition-colors shrink-0" />
            <div>
              <p className="font-body text-[12px] font-medium text-forest-900">View Journal Entry</p>
              <p className="font-body text-[10px] text-cream-400">Review &amp; send AI response</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-cream-200 text-left hover:border-forest-900/25 hover:bg-forest-900/3 transition-colors group">
            <Activity size={14} className="text-cream-400 group-hover:text-forest-700 transition-colors shrink-0" />
            <div>
              <p className="font-body text-[12px] font-medium text-forest-900">Assign Resource</p>
              <p className="font-body text-[10px] text-cream-400">
                {patient.resources.length} resources available
              </p>
            </div>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-cream-200 text-left hover:border-forest-900/25 hover:bg-forest-900/3 transition-colors group">
            <Send size={14} className="text-cream-400 group-hover:text-forest-700 transition-colors shrink-0" />
            <div>
              <p className="font-body text-[12px] font-medium text-forest-900">Send Message</p>
              <p className="font-body text-[10px] text-cream-400">Secure in-app message</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
