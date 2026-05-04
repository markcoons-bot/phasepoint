'use client'

import React, { useRef, useState } from 'react'
import { MemoryNode } from '@/data/types'

interface Props {
  nodes: MemoryNode[]
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const W = 560
const H = 460
const CX = 280
const CY = 200

// ─── Type maps ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<MemoryNode['type'], string> = {
  touchstone:      '#1C3D2E',
  associated:      '#3D7A5C',
  trigger:         '#C8922E',
  future_template: '#5FA882',
}

const TYPE_RADII: Record<MemoryNode['type'], number> = {
  touchstone:      26,
  associated:      18,
  trigger:         12,
  future_template: 14,
}

const TYPE_LABELS: Record<MemoryNode['type'], string> = {
  touchstone:      'Touchstone',
  associated:      'Associated',
  trigger:         'Trigger',
  future_template: 'Future Template',
}

const STATUS_COLORS: Record<MemoryNode['processingStatus'], string> = {
  active:   '#5FA882',
  queued:   '#9A9A90',
  complete: '#2D7A4F',
  deferred: '#C8C8BC',
  blocked:  '#C8922E',
}

// ─── Position computation ─────────────────────────────────────────────────────

function computePositions(nodes: MemoryNode[]): Map<string, [number, number]> {
  const positions = new Map<string, [number, number]>()
  const byType = {
    touchstone:      nodes.filter(n => n.type === 'touchstone'),
    associated:      nodes.filter(n => n.type === 'associated'),
    trigger:         nodes.filter(n => n.type === 'trigger'),
    future_template: nodes.filter(n => n.type === 'future_template'),
  }

  // Touchstone at center
  byType.touchstone.forEach(n => positions.set(n.id, [CX, CY]))

  // Associated: upper arc centered at 270° (straight up), r=138, spread 70°
  byType.associated.forEach((n, i, arr) => {
    const spread = Math.PI * 0.7
    const base = 1.5 * Math.PI
    const angle = arr.length === 1
      ? base
      : base - spread / 2 + i * (spread / (arr.length - 1))
    positions.set(n.id, [CX + 138 * Math.cos(angle), CY + 138 * Math.sin(angle)])
  })

  // Triggers: lower area, centered at 90° (down), r=200, spread 80°
  byType.trigger.forEach((n, i, arr) => {
    const spread = Math.PI * 0.8
    const base = 0.5 * Math.PI
    const angle = arr.length === 1
      ? base
      : base - spread / 2 + i * (spread / (arr.length - 1))
    positions.set(n.id, [CX + 200 * Math.cos(angle), CY + 200 * Math.sin(angle)])
  })

  // Future templates: below center, r=228
  byType.future_template.forEach((n, i, arr) => {
    const spread = Math.PI * 0.3
    const base = 0.5 * Math.PI
    const angle = arr.length === 1
      ? base
      : base - spread / 2 + i * (spread / (arr.length - 1))
    positions.set(n.id, [CX + 228 * Math.cos(angle), CY + 228 * Math.sin(angle)])
  })

  return positions
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemoryNetworkGraph({ nodes }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const positions = computePositions(nodes)
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  // Build deduplicated edge list
  const edgeSet = new Set<string>()
  const edges: [string, string][] = []
  nodes.forEach(n => {
    n.linkedNodes.forEach(targetId => {
      const key = [n.id, targetId].sort().join('--')
      if (!edgeSet.has(key) && positions.has(targetId)) {
        edgeSet.add(key)
        edges.push([n.id, targetId])
      }
    })
  })

  const selectedNode = selectedId ? nodeMap.get(selectedId) ?? null : null
  const hoveredNode  = hoveredId  ? nodeMap.get(hoveredId)  ?? null : null

  function handleNodeEnter(nodeId: string) {
    if (!svgRef.current || !containerRef.current) return
    const pos = positions.get(nodeId)
    if (!pos) return
    const svgRect       = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const scaleX = svgRect.width  / W
    const scaleY = svgRect.height / H
    setHoveredId(nodeId)
    setTooltipPos({
      x: pos[0] * scaleX + (svgRect.left - containerRect.left),
      y: pos[1] * scaleY + (svgRect.top  - containerRect.top),
    })
  }

  function handleNodeLeave() {
    setHoveredId(null)
    setTooltipPos(null)
  }

  function handleNodeClick(nodeId: string) {
    setSelectedId(prev => (prev === nodeId ? null : nodeId))
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* ── SVG canvas ──────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 via-cream-25 to-sage-50 overflow-hidden"
           style={{ aspectRatio: '560/460' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          aria-label="Memory network graph"
          style={{ display: 'block' }}
        >
          <defs>
            <style>{`
              @keyframes mnPulse {
                0%, 100% { opacity: 0.68; }
                50% { opacity: 1; }
              }
              @keyframes mnEdge {
                0%, 100% { stroke-opacity: 0.14; }
                50% { stroke-opacity: 0.38; }
              }
            `}</style>
            <radialGradient id="mnGlow" cx="50%" cy="44%" r="50%">
              <stop offset="0%"   stopColor="#C8DDD5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#C8DDD5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center glow */}
          <ellipse cx={CX} cy={CY} rx={180} ry={140} fill="url(#mnGlow)" />

          {/* Edges */}
          {edges.map(([fromId, toId], i) => {
            const from = positions.get(fromId)
            const to   = positions.get(toId)
            if (!from || !to) return null
            const active = hoveredId === fromId || hoveredId === toId ||
                           selectedId === fromId || selectedId === toId
            return (
              <line
                key={`e${i}`}
                x1={from[0]} y1={from[1]}
                x2={to[0]}   y2={to[1]}
                stroke="#4A8B6C"
                strokeWidth={active ? 1.8 : 1.2}
                strokeLinecap="round"
                strokeOpacity={active ? 0.55 : undefined}
                style={active ? undefined : {
                  animation: `mnEdge ${3.2 + i * 0.38}s ease-in-out infinite`,
                  animationDelay: `${i * 0.28}s`,
                }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const pos = positions.get(node.id)
            if (!pos) return null
            const [nx, ny] = pos
            const r        = TYPE_RADII[node.type]
            const color    = TYPE_COLORS[node.type]
            const isHov    = hoveredId  === node.id
            const isSel    = selectedId === node.id
            const active   = isHov || isSel

            return (
              <g key={node.id} style={{ cursor: 'pointer' }}>

                {/* Touchstone halos */}
                {node.type === 'touchstone' && (
                  <>
                    <circle cx={nx} cy={ny} r={r + 18} fill={color} opacity={0.045} />
                    <circle cx={nx} cy={ny} r={r + 9}  fill={color} opacity={0.09}  />
                  </>
                )}

                {/* Associated halo */}
                {node.type === 'associated' && (
                  <circle
                    cx={nx} cy={ny} r={r + 7}
                    fill={color} opacity={0.08}
                    style={{
                      animation: `mnPulse ${3.5 + i * 0.22}s ease-in-out infinite`,
                      animationDelay: `${i * 0.14}s`,
                    }}
                  />
                )}

                {/* Selection / hover ring */}
                {active && (
                  <circle
                    cx={nx} cy={ny}
                    r={r + 7}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    opacity={0.45}
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={nx} cy={ny}
                  r={active ? r + 1.5 : r}
                  fill={color}
                  style={{
                    animation: active ? 'none' : `mnPulse ${2.6 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                  onMouseEnter={() => handleNodeEnter(node.id)}
                  onMouseLeave={handleNodeLeave}
                  onClick={() => handleNodeClick(node.id)}
                />

                {/* Inner highlight for larger nodes */}
                {r >= 16 && (
                  <circle
                    cx={nx} cy={ny}
                    r={r * 0.28}
                    fill="white"
                    opacity={0.18}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Processing status dot (upper-right) */}
                <circle
                  cx={nx + r * 0.72}
                  cy={ny - r * 0.72}
                  r={3}
                  fill={STATUS_COLORS[node.processingStatus]}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            )
          })}

          {/* Axis labels for touchstone and future */}
          {nodes.map(node => {
            if (node.type !== 'touchstone' && node.type !== 'future_template') return null
            const pos = positions.get(node.id)
            if (!pos) return null
            const [nx, ny] = pos
            const r = TYPE_RADII[node.type]
            return (
              <text
                key={`lbl${node.id}`}
                x={nx} y={ny + r + 14}
                textAnchor="middle"
                fontSize={7}
                fill={TYPE_COLORS[node.type]}
                opacity={0.45}
                fontFamily="Jost, sans-serif"
                letterSpacing="1"
                style={{ pointerEvents: 'none' }}
              >
                {node.type === 'touchstone' ? 'TOUCHSTONE' : 'FUTURE'}
              </text>
            )
          })}
        </svg>

        {/* ── Hover tooltip ──────────────────────────────────────────────────── */}
        {hoveredNode && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: tooltipPos.x,
              top:  tooltipPos.y - 8,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-forest-900/95 text-cream-50 px-3 py-2 rounded-xl shadow-lg max-w-[190px]">
              <p className="text-[11px] font-body font-semibold leading-snug mb-0.5">{hoveredNode.label}</p>
              <p className="text-[9px] font-body uppercase tracking-wide text-sage-300/70 mb-1">
                {TYPE_LABELS[hoveredNode.type]}
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {hoveredNode.sudsCurrentt != null && (
                  <span className="text-[10px] font-body text-amber-400">SUDS {hoveredNode.sudsCurrentt}</span>
                )}
                {hoveredNode.voc != null && (
                  <span className="text-[10px] font-body text-sage-300">VOC {hoveredNode.voc}</span>
                )}
              </div>
              <p className="text-[9px] font-body mt-1 capitalize"
                 style={{ color: STATUS_COLORS[hoveredNode.processingStatus] }}>
                {hoveredNode.processingStatus.replace('_', ' ')}
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                            border-l-[5px] border-r-[5px] border-t-[5px]
                            border-l-transparent border-r-transparent border-t-forest-900/95" />
          </div>
        )}

        {/* ── Legend ─────────────────────────────────────────────────────────── */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4 px-4">
          {(Object.entries(TYPE_COLORS) as [MemoryNode['type'], string][]).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1 text-[9px] font-body uppercase tracking-[0.08em] text-cream-500">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {TYPE_LABELS[type].split(' ')[0]}
            </span>
          ))}
        </div>

        {/* ── Header label ───────────────────────────────────────────────────── */}
        <div className="absolute top-3 left-4">
          <span className="text-[9px] font-body uppercase tracking-[0.12em] text-cream-400">AIP Memory Network</span>
        </div>
      </div>

      {/* ── Selected node detail panel ──────────────────────────────────────── */}
      {selectedNode && (
        <div className="mt-3 p-4 rounded-xl border border-cream-100 bg-white shadow-[0_1px_6px_rgba(26,26,24,0.06)]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: TYPE_COLORS[selectedNode.type] }}
              />
              <div>
                <p className="font-body text-[13px] font-semibold text-forest-900 leading-snug">
                  {selectedNode.label}
                </p>
                <p className="font-body text-[10px] uppercase tracking-wide text-cream-400 mt-0.5">
                  {TYPE_LABELS[selectedNode.type]}
                  {selectedNode.age ? ` · Age ${selectedNode.age}` : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-cream-400 hover:text-cream-600 transition-colors shrink-0 text-sm leading-none"
              aria-label="Close detail panel"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-2.5 mb-3">
            {selectedNode.sudsBaseline != null && (
              <div>
                <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-0.5">SUDS Baseline</p>
                <p className="font-body text-[13px] font-medium text-forest-900">{selectedNode.sudsBaseline}</p>
              </div>
            )}
            {selectedNode.sudsCurrentt != null && (
              <div>
                <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-0.5">SUDS Current</p>
                <p className="font-body text-[13px] font-medium text-amber-600">{selectedNode.sudsCurrentt}</p>
              </div>
            )}
            {selectedNode.voc != null && (
              <div>
                <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mb-0.5">VOC</p>
                <p className="font-body text-[13px] font-medium text-forest-600">{selectedNode.voc}</p>
              </div>
            )}
          </div>

          {(selectedNode.negativeCognition || selectedNode.positiveCognition) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {selectedNode.negativeCognition && (
                <div className="bg-amber-100/50 rounded-lg px-3 py-2">
                  <p className="text-[9px] font-body uppercase tracking-wide text-amber-600 mb-1">NC</p>
                  <p className="font-body text-[12px] text-cream-700 italic">
                    &ldquo;{selectedNode.negativeCognition}&rdquo;
                  </p>
                </div>
              )}
              {selectedNode.positiveCognition && (
                <div className="bg-sage-100/60 rounded-lg px-3 py-2">
                  <p className="text-[9px] font-body uppercase tracking-wide text-forest-600 mb-1">PC</p>
                  <p className="font-body text-[12px] text-forest-700 italic">
                    &ldquo;{selectedNode.positiveCognition}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] font-body mb-2.5">
            {selectedNode.emotion && (
              <div>
                <span className="text-cream-400">Emotion: </span>
                <span className="text-cream-700">{selectedNode.emotion}</span>
              </div>
            )}
            {selectedNode.bodyLocation && (
              <div>
                <span className="text-cream-400">Body: </span>
                <span className="text-cream-700">{selectedNode.bodyLocation}</span>
              </div>
            )}
          </div>

          {selectedNode.clinicalNotes && (
            <div className="pt-2.5 border-t border-cream-100">
              <p className="text-[11px] font-body text-cream-500 italic leading-relaxed">
                {selectedNode.clinicalNotes}
              </p>
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-body uppercase tracking-wide px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: STATUS_COLORS[selectedNode.processingStatus] + '22',
                color: STATUS_COLORS[selectedNode.processingStatus],
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedNode.processingStatus] }} />
              {selectedNode.processingStatus.replace('_', ' ')}
            </span>

            {selectedNode.sessionHistory.length > 0 && (
              <span className="text-[10px] font-body text-cream-400">
                {selectedNode.sessionHistory.length} processing sessions
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
