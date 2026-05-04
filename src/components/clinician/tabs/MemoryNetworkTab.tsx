import { Patient } from '@/data/types'
import MemoryNetworkGraph from '@/components/clinician/MemoryNetworkGraph'

interface Props {
  patient: Patient
}

export default function MemoryNetworkTab({ patient }: Props) {
  const touchstone  = patient.memoryNetwork.filter(n => n.type === 'touchstone')
  const associated  = patient.memoryNetwork.filter(n => n.type === 'associated')
  const triggers    = patient.memoryNetwork.filter(n => n.type === 'trigger')
  const futures     = patient.memoryNetwork.filter(n => n.type === 'future_template')

  return (
    <div className="p-6 space-y-6">

      {/* Graph */}
      <MemoryNetworkGraph nodes={patient.memoryNetwork} />

      {/* Node summary table */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
          Network Summary — {patient.memoryNetwork.length} Nodes
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Touchstone',      nodes: touchstone, color: '#1C3D2E' },
            { label: 'Associated',      nodes: associated,  color: '#3D7A5C' },
            { label: 'Triggers',        nodes: triggers,    color: '#C8922E' },
            { label: 'Future Templates', nodes: futures,    color: '#5FA882' },
          ].map(({ label, nodes, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-cream-100 px-4 py-3 shadow-[0_1px_3px_rgba(26,26,24,0.04)]"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <p className="text-[10px] font-body uppercase tracking-[0.1em] text-cream-400">{label}</p>
              </div>
              <p className="font-display text-2xl font-light text-forest-900">{nodes.length}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Node list */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">All Nodes</p>
        <div className="space-y-2">
          {patient.memoryNetwork.map(node => {
            const colors: Record<string, string> = {
              touchstone:      '#1C3D2E',
              associated:      '#3D7A5C',
              trigger:         '#C8922E',
              future_template: '#5FA882',
            }
            const statusColors: Record<string, string> = {
              active:   '#5FA882',
              queued:   '#9A9A90',
              complete: '#2D7A4F',
              deferred: '#C8C8BC',
              blocked:  '#C8922E',
            }
            return (
              <div
                key={node.id}
                className="flex items-start gap-3 px-4 py-3 rounded-xl border border-cream-100 bg-white hover:border-cream-200 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: colors[node.type] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-body text-[13px] font-medium text-forest-900 truncate">{node.label}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {node.sudsCurrentt != null && (
                        <span className="text-[11px] font-body text-amber-600">SUDS {node.sudsCurrentt}</span>
                      )}
                      {node.voc != null && (
                        <span className="text-[11px] font-body text-forest-600">VOC {node.voc}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[9px] font-body uppercase tracking-wide"
                      style={{ color: colors[node.type] }}
                    >
                      {node.type.replace('_', ' ')}
                    </span>
                    <span className="text-cream-300">·</span>
                    <span
                      className="text-[9px] font-body uppercase tracking-wide capitalize"
                      style={{ color: statusColors[node.processingStatus] }}
                    >
                      {node.processingStatus.replace('_', ' ')}
                    </span>
                    {node.age != null && (
                      <>
                        <span className="text-cream-300">·</span>
                        <span className="text-[10px] font-body text-cream-400">Age {node.age}</span>
                      </>
                    )}
                    {node.sessionHistory.length > 0 && (
                      <>
                        <span className="text-cream-300">·</span>
                        <span className="text-[10px] font-body text-cream-400">
                          {node.sessionHistory.length} sessions
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
