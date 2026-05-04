'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { Patient } from '@/data/types'

interface Props {
  patient: Patient
}

// VOC trajectory alongside SUDS — for patients without explicit VOC session data,
// we infer a smooth progression toward the current VOC value.
function buildChartData(patient: Patient) {
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')
  if (!touchstone || touchstone.sessionHistory.length === 0) return []

  const history = touchstone.sessionHistory
  const currentVoc = touchstone.voc ?? null

  return history.map((session, i) => {
    // Linear VOC interpolation: starts near 1, ends at current VOC
    const vocEnd   = currentVoc ?? 4
    const vocStart = 1
    const progress = history.length > 1 ? i / (history.length - 1) : 1
    const voc = Math.round(vocStart + progress * (vocEnd - vocStart))

    return {
      label:   `S${session.sessionNumber}`,
      session: session.sessionNumber,
      suds:    session.suds,
      voc,
      notes:   session.notes,
      date:    session.date,
    }
  })
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-forest-900/95 rounded-xl px-3 py-2.5 shadow-lg">
      <p className="font-body text-[11px] text-sage-300/70 uppercase tracking-wide mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-body text-[12px] font-medium" style={{ color: p.color }}>
          {p.name.toUpperCase()} {p.value}
        </p>
      ))}
    </div>
  )
}

export default function TrajectoryTab({ patient }: Props) {
  const data = buildChartData(patient)
  const touchstone = patient.memoryNetwork.find(n => n.type === 'touchstone')
  const hasData = data.length > 0

  return (
    <div className="p-6 space-y-6">

      {/* Chart header */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-1">
          SUDS / VOC Trajectory
        </p>
        {touchstone && (
          <p className="font-body text-[13px] text-cream-600">
            {touchstone.label} · Phase {patient.currentPhase} Processing
          </p>
        )}
      </div>

      {hasData ? (
        <>
          {/* Line chart */}
          <div className="bg-white rounded-2xl border border-cream-100 px-5 pt-5 pb-3 shadow-[0_1px_4px_rgba(26,26,24,0.04)]">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D8" strokeOpacity={0.8} />
                <XAxis
                  dataKey="label"
                  tick={{ fontFamily: 'Jost, sans-serif', fontSize: 11, fill: '#9A9A90' }}
                  axisLine={{ stroke: '#E8E4D8' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontFamily: 'Jost, sans-serif', fontSize: 11, fill: '#9A9A90' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: 11,
                    paddingTop: 8,
                  }}
                />
                {/* SUDS: amber — decreasing trend is good */}
                <Line
                  type="monotone"
                  dataKey="suds"
                  name="SUDS"
                  stroke="#C8922E"
                  strokeWidth={2.5}
                  dot={{ fill: '#C8922E', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                {/* VOC: forest — increasing trend is good */}
                <Line
                  type="monotone"
                  dataKey="voc"
                  name="VOC"
                  stroke="#1C3D2E"
                  strokeWidth={2.5}
                  dot={{ fill: '#1C3D2E', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  strokeDasharray="5 3"
                />
                {/* Target thresholds */}
                <ReferenceLine y={1} stroke="#5FA882" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'SUDS target', position: 'insideTopRight', fontSize: 9, fill: '#5FA882', fontFamily: 'Jost, sans-serif' }} />
                <ReferenceLine y={7} stroke="#1C3D2E" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'VOC target', position: 'insideTopLeft', fontSize: 9, fill: '#1C3D2E', fontFamily: 'Jost, sans-serif' }} />
              </LineChart>
            </ResponsiveContainer>

            <p className="font-body text-[10px] text-cream-400 mt-1 text-center italic">
              SUDS ↓ toward 0 · VOC ↑ toward 7+ · Dashed line = VOC trajectory
            </p>
          </div>

          {/* Session data table */}
          <div>
            <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-3">
              Session-by-Session Data
            </p>
            <div className="space-y-2">
              {data.map((row, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 px-4 py-3 rounded-xl border border-cream-100 bg-white"
                >
                  <div className="shrink-0 text-center">
                    <p className="font-body text-[11px] text-cream-400">{row.date}</p>
                    <p className="font-body text-[12px] font-semibold text-forest-900">{row.label}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[9px] font-body uppercase tracking-wide text-cream-400 mb-0.5">SUDS</p>
                      <p className="font-body text-[14px] font-medium text-amber-600">{row.suds}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-body uppercase tracking-wide text-cream-400 mb-0.5">VOC</p>
                      <p className="font-body text-[14px] font-medium text-forest-700">{row.voc}</p>
                    </div>
                  </div>
                  {row.notes && (
                    <p className="font-body text-[12px] text-cream-600 italic leading-snug flex-1 self-center">
                      {row.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-3">
            <span className="font-display text-2xl text-forest-600">~</span>
          </div>
          <p className="font-body text-sm text-cream-500">No processing sessions recorded yet.</p>
          <p className="font-body text-xs text-cream-400 mt-1">
            Trajectory data will appear once Phase 4 processing begins.
          </p>
        </div>
      )}
    </div>
  )
}
