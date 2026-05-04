'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Layers,
  Share2,
  Smartphone,
  FileText,
  Shield,
  UserCheck,
  Cpu,
  Lock,
} from 'lucide-react'

// ─── Animation helpers ────────────────────────────────────────────────────────

const ease = [0.25, 0.46, 0.45, 0.94] as const

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.52, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  },
}

// ─── Memory Network SVG ───────────────────────────────────────────────────────

interface SVGNode {
  id: number
  x: number
  y: number
  r: number
  type: 'touchstone' | 'associated' | 'trigger' | 'future'
  color: string
}

const NODES: SVGNode[] = [
  { id: 0,  x: 248, y: 195, r: 26, type: 'touchstone', color: '#1C3D2E' },
  { id: 1,  x: 112, y: 108, r: 19, type: 'associated',  color: '#3D7A5C' },
  { id: 2,  x: 384, y: 108, r: 17, type: 'associated',  color: '#3D7A5C' },
  { id: 3,  x: 128, y: 296, r: 21, type: 'associated',  color: '#3D7A5C' },
  { id: 4,  x: 370, y: 278, r: 16, type: 'associated',  color: '#3D7A5C' },
  { id: 5,  x:  54, y: 204, r: 10, type: 'trigger',     color: '#C8922E' },
  { id: 6,  x: 434, y: 196, r:  9, type: 'trigger',     color: '#C8922E' },
  { id: 7,  x: 260, y:  58, r: 12, type: 'trigger',     color: '#C8922E' },
  { id: 8,  x: 326, y: 152, r:  8, type: 'trigger',     color: '#C8922E' },
  { id: 9,  x: 168, y: 172, r:  8, type: 'trigger',     color: '#C8922E' },
  { id: 10, x: 244, y: 352, r: 14, type: 'future',      color: '#5FA882' },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [0, 7], [0, 10],
  [1, 5], [1, 9], [1, 3],
  [2, 6], [2, 8], [2, 4],
  [3, 5], [4, 6],
]

function MemoryNetworkSVG() {
  return (
    <div className="relative w-full aspect-[5/4] rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 via-cream-25 to-sage-50 overflow-hidden">
      <svg
        viewBox="0 0 496 420"
        className="w-full h-full"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <defs>
          <style>{`
            @keyframes nodePulse {
              0%, 100% { opacity: 0.65; }
              50% { opacity: 1; }
            }
            @keyframes edgeFade {
              0%, 100% { stroke-opacity: 0.14; }
              50% { stroke-opacity: 0.36; }
            }
            @keyframes touchstonePulse {
              0%, 100% { opacity: 0.85; r: 25; }
              50% { opacity: 1; r: 27; }
            }
          `}</style>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8DDD5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C8DDD5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle center glow */}
        <ellipse cx={248} cy={195} rx={160} ry={120} fill="url(#bgGlow)" />

        {/* Edges */}
        {EDGES.map(([from, to], i) => {
          const n1 = NODES[from]
          const n2 = NODES[to]
          return (
            <line
              key={`e-${i}`}
              x1={n1.x} y1={n1.y}
              x2={n2.x} y2={n2.y}
              stroke="#4A8B6C"
              strokeWidth={1.2}
              strokeLinecap="round"
              style={{
                animation: `edgeFade ${3 + i * 0.35}s ease-in-out infinite`,
                animationDelay: `${i * 0.28}s`,
              }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <g key={`n-${node.id}`}>
            {/* Halo for associated nodes */}
            {node.type === 'associated' && (
              <circle
                cx={node.x} cy={node.y}
                r={node.r + 6}
                fill={node.color}
                opacity={0.08}
                style={{
                  animation: `nodePulse ${3.5 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            )}
            {/* Halo for touchstone */}
            {node.type === 'touchstone' && (
              <>
                <circle cx={node.x} cy={node.y} r={node.r + 16} fill={node.color} opacity={0.05} />
                <circle cx={node.x} cy={node.y} r={node.r + 8} fill={node.color} opacity={0.1} />
              </>
            )}
            {/* Main node */}
            <circle
              cx={node.x} cy={node.y}
              r={node.r}
              fill={node.color}
              style={{
                animation: `nodePulse ${2.4 + i * 0.28}s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
            {/* Center dot for larger nodes */}
            {node.r >= 16 && (
              <circle
                cx={node.x} cy={node.y}
                r={node.r * 0.3}
                fill="white"
                opacity={0.2}
              />
            )}
          </g>
        ))}

        {/* Subtle phase labels */}
        <text x={248} y={230} textAnchor="middle" fontSize={8} fill="#1C3D2E" opacity={0.4} fontFamily="Jost, sans-serif" letterSpacing="1">
          TOUCHSTONE
        </text>
        <text x={244} y={376} textAnchor="middle" fontSize={7} fill="#5FA882" opacity={0.5} fontFamily="Jost, sans-serif" letterSpacing="1">
          FUTURE TEMPLATE
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4 px-4">
        {[
          { color: '#1C3D2E', label: 'Touchstone' },
          { color: '#3D7A5C', label: 'Associated' },
          { color: '#C8922E', label: 'Trigger' },
          { color: '#5FA882', label: 'Future' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1 text-[9px] font-body uppercase tracking-[0.08em] text-cream-500">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Header label */}
      <div className="absolute top-3 left-4">
        <span className="text-[9px] font-body uppercase tracking-[0.12em] text-cream-400">
          AIP Memory Network
        </span>
      </div>
    </div>
  )
}

// ─── Week Timeline ────────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const SESSION_DAY = 1 // Tuesday

const afterActivities: Record<number, Array<'checkin' | 'resource' | 'journal'>> = {
  0: ['checkin'],
  2: ['checkin', 'journal'],
  3: ['checkin', 'resource'],
  4: ['checkin'],
  5: ['checkin', 'journal', 'resource'],
  6: ['checkin'],
}

const activityColors: Record<'checkin' | 'resource' | 'journal', string> = {
  checkin:  '#5FA882',
  resource: '#C8DDD5',
  journal:  '#DDB05A',
}

function WeekTimeline({ withPhasepoint }: { withPhasepoint: boolean }) {
  return (
    <div className="flex gap-1.5">
      {DAYS.map((day, i) => {
        const isSession = i === SESSION_DAY
        const activities = withPhasepoint ? afterActivities[i] : undefined
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-wide font-body text-cream-400/60">{day}</span>
            <div
              className={[
                'w-full rounded relative overflow-hidden',
                isSession
                  ? 'bg-forest-600 h-14'
                  : withPhasepoint
                    ? 'bg-forest-800/25 h-14'
                    : 'bg-forest-800/15 h-14',
              ].join(' ')}
            >
              {isSession ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[7px] font-body text-cream-50/80 uppercase tracking-wider">Session</span>
                </div>
              ) : activities ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  {activities.map((act, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: activityColors[act] }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section label inline ─────────────────────────────────────────────────────

function SL({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={[
        'block text-[11px] font-body font-medium uppercase tracking-[0.14em] mb-3',
        light ? 'text-sage-200/50' : 'text-cream-600',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

// ─── SECTION 1 — HERO ────────────────────────────────────────────────────────

function HeroSection() {
  const scrollToResearch = () => {
    document.getElementById('research')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16"
      style={{ background: 'var(--surface-base)' }}
    >
      <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">

          {/* Left column */}
          <div className="space-y-7">

            {/* Pill label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forest-900/25 text-forest-900">
                <span className="w-1 h-1 rounded-full bg-forest-600 shrink-0" />
                <span
                  className="font-body text-[11px] tracking-[0.12em] uppercase"
                >
                  For clinicians · For patients · For the 167 hours in between
                </span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.1 }}
              className="font-display text-[52px] md:text-[72px] lg:text-[88px] font-light text-forest-900 leading-[1.05]"
            >
              Precision care<br />
              <em className="italic">at every phase.</em>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.22 }}
              className="font-body text-[17px] md:text-[18px] text-cream-600 max-w-[500px] leading-relaxed"
            >
              EMDR therapy is the most evidence-backed trauma treatment in the
              world. The infrastructure supporting it hasn&rsquo;t kept pace.
              Phasepoint changes that.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.34 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/demo"
                className="inline-flex items-center bg-forest-900 text-cream-25 font-body font-medium text-[14px] tracking-[0.05em] px-6 py-3 rounded hover:bg-forest-800 transition-colors duration-200"
              >
                Enter Clinical Demo →
              </Link>
              <button
                onClick={scrollToResearch}
                className="inline-flex items-center border border-forest-900/30 text-forest-900 font-body font-medium text-[14px] tracking-[0.05em] px-6 py-3 rounded hover:bg-forest-900/5 transition-colors duration-200"
              >
                See the Research Case
              </button>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {[
                '150,000+ EMDR practitioners worldwide',
                '167 hours between weekly sessions',
                '6 sessions — 100% PTSD remission for single-trauma',
              ].map((stat) => (
                <div
                  key={stat}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-cream-100 text-forest-900 text-[10px] uppercase tracking-[0.07em] font-body font-medium"
                >
                  {stat}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — Memory network visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="w-full"
          >
            <MemoryNetworkSVG />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 2 — THE PROBLEM ──────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="bg-forest-900 py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-14">

        <FadeUp>
          <SL light>The Problem</SL>
          <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] font-light text-cream-50 leading-[1.08] max-w-[700px]">
            50 minutes of therapy.<br />167 hours of life.
          </h2>
          <p className="font-body text-[16px] text-cream-50/70 max-w-[600px] leading-relaxed mt-5">
            A licensed EMDR therapist sees patients 50 minutes a week. The research
            is unambiguous: what happens in the other 167 hours determines outcomes
            as much as the session itself. Patients go home after the most
            neurologically demanding work of their lives with nothing but a
            handwritten note.
          </p>
        </FadeUp>

        {/* Stat cards */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              stat: '68%',
              body: 'Of patients improve when between-session engagement is high. The inverse is also true.',
            },
            {
              stat: '42%',
              body: 'Higher recovery rates when AI-supported between-session tools are used — NHS 2025 study, 244 patients.',
            },
            {
              stat: '0',
              body: 'Digital tools exist that understand the EMDR eight-phase framework. Until now.',
            },
          ].map(({ stat, body }) => (
            <motion.div
              key={stat}
              variants={stagger.item}
              className="bg-forest-800 rounded-2xl p-6 space-y-2.5 border border-forest-700/40"
            >
              <p className="font-display text-[56px] font-light text-cream-50 leading-none">{stat}</p>
              <p className="font-body text-sm text-cream-200/70 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Before/After timeline */}
        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400/50 mb-3">
                Before Phasepoint
              </p>
              <WeekTimeline withPhasepoint={false} />
              <p className="mt-2.5 font-body text-xs text-cream-400/50 italic">
                167 hours — currently unsupported
              </p>
            </div>
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-forest-500 mb-3">
                With Phasepoint
              </p>
              <WeekTimeline withPhasepoint={true} />
              <div className="mt-2.5 flex flex-wrap gap-3">
                {[
                  { color: '#5FA882', label: 'Check-in' },
                  { color: '#C8DDD5', label: 'Resource practice' },
                  { color: '#DDB05A', label: 'Journal entry' },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[10px] font-body text-cream-400/60 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── SECTION 3 — THE PRODUCT ──────────────────────────────────────────────────

const featureCards = [
  {
    icon: Layers,
    title: 'EMDR Protocol Engine',
    body: 'Phase-gated workflows. Target tracking. Three-pronged protocol board. Every clinical decision is structured, logged, and auditable.',
  },
  {
    icon: Share2,
    title: 'Memory Network Graph',
    body: 'Visual mapping of trauma networks — touchstone memories, associated events, triggers, future templates. The first digital tool that thinks like an EMDR therapist.',
  },
  {
    icon: Smartphone,
    title: 'Between-Session Companion',
    body: 'Phase-aware, clinician-directed, AI-supported support for the 167 hours between sessions. Safe. Bounded. Genuinely helpful.',
  },
  {
    icon: FileText,
    title: 'RTM Billing Infrastructure',
    body: 'CPT 98978, 98980, 98981 documentation generated automatically. Turn between-session clinical activity into reimbursable care.',
  },
]

function ProductSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--surface-base)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — text */}
          <div className="space-y-6">
            <FadeUp>
              <SL>The Platform</SL>
              <h2 className="font-display text-[40px] md:text-[52px] font-light text-forest-900 leading-[1.08]">
                Built for how EMDR<br />actually works.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                Phasepoint is the first clinical operating system built natively
                around the EMDR eight-phase framework. Every feature knows which
                phase the patient is in. Every tool the patient accesses was
                prescribed by their clinician. The platform enforces clinical
                protocol automatically — not as a restriction, but as the
                architecture that makes it safe.
              </p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                At the center of the clinician experience is something that has
                never existed digitally before: the Memory Network Graph — a visual
                map of the patient&rsquo;s trauma landscape as EMDR clinicians
                actually conceptualize it. Touchstone memories, associated events,
                present triggers, future templates — all connected, all tracked, all
                visible across the full arc of treatment.
              </p>
            </FadeUp>
            <FadeUp delay={0.26}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                The patient experiences something equally unprecedented: a companion
                that knows exactly where they are in their healing and offers
                precisely the right tools for that moment. Phase 2 feels completely
                different from Phase 7. The system enforces that difference
                automatically.
              </p>
            </FadeUp>
          </div>

          {/* Right — feature cards 2×2 */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
          >
            {featureCards.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={stagger.item}
                className="bg-white rounded-2xl border border-cream-100 p-5 space-y-3 shadow-[0_1px_6px_rgba(26,26,24,0.05)]"
              >
                <div className="w-9 h-9 rounded-xl bg-forest-900/6 flex items-center justify-center">
                  <Icon size={16} className="text-forest-700" />
                </div>
                <h3 className="font-body text-sm font-semibold text-forest-900 leading-snug">{title}</h3>
                <p className="font-body text-[13px] text-cream-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 4 — CLINICAL FOUNDATION ─────────────────────────────────────────

const pillars = [
  {
    icon: Shield,
    title: 'Phase-Gated Safety',
    body: 'Every feature is gated by the patient\'s current EMDR phase and dissociation risk profile. A Phase 2 patient cannot access tools inappropriate to stabilization. A patient flagged for dissociation risk cannot access bilateral stimulation without explicit clinician assignment.',
  },
  {
    icon: UserCheck,
    title: 'Clinician-Directed',
    body: 'EMDRIA policy explicitly prohibits self-administered EMDR therapy. Phasepoint is architected around that boundary. The clinician prescribes every tool. The patient practices what was assigned. The data flows back for clinical review.',
  },
  {
    icon: Cpu,
    title: 'AI Within Clinical Bounds',
    body: 'The AI companion can hold space, reflect, guide clinician-prescribed tools, and detect crisis. It cannot select targets, initiate floatback, intensify affect, or perform therapy. Every AI response is governed by a clinical policy engine that runs independently of the language model.',
  },
  {
    icon: Lock,
    title: 'Safety Architecture',
    body: 'Three layers of safety run continuously: AI crisis detection, clinician alert thresholds, and a crisis escalation pathway always one tap from anywhere in the patient interface. The platform cannot be used in a way that removes the safety layer.',
  },
]

const endorsingOrgs = [
  'WHO',
  'American Psychological Association',
  'U.S. Department of Veterans Affairs',
  'NICE (UK)',
  'EMDRIA',
  'ISTSS',
]

function ClinicalSection() {
  return (
    <section
      className="py-24 lg:py-32 border-t border-cream-100"
      style={{ background: 'var(--surface-elevated)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-12">

        <FadeUp>
          <SL>Clinical Foundation</SL>
          <h2 className="font-display text-[40px] md:text-[52px] font-light text-forest-900 leading-[1.08] max-w-[700px]">
            Built on 35 years of EMDR research.
          </h2>
          <p className="font-body text-[15px] text-cream-600 max-w-[680px] leading-relaxed mt-4">
            Every architectural decision in Phasepoint was made in response to the
            clinical literature — the EMDRIA clinical guidelines, the AIP model, the
            Korn-Leeds RDI framework, the Siegel window of tolerance, the Artigas
            butterfly hug protocol, the Shapiro eight-phase structure. This is not a
            wellness application that borrowed EMDR terminology. It is clinical
            infrastructure built by people who read the research.
          </p>
        </FadeUp>

        {/* Pillars */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {pillars.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={stagger.item}
              className="bg-white rounded-2xl border border-cream-100 p-5 space-y-3 shadow-[0_1px_4px_rgba(26,26,24,0.04)]"
            >
              <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                <Icon size={15} className="text-forest-700" />
              </div>
              <h3 className="font-body text-sm font-semibold text-forest-900">{title}</h3>
              <p className="font-body text-[12.5px] text-cream-600 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Endorsing orgs */}
        <FadeUp>
          <div className="border-t border-cream-100 pt-10 space-y-4">
            <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 text-center">
              EMDR therapy is recommended by these organizations. Phasepoint is built to the standard those recommendations require.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              {endorsingOrgs.map((org, i) => (
                <React.Fragment key={org}>
                  {i > 0 && (
                    <span className="text-cream-300 text-xs hidden sm:inline">·</span>
                  )}
                  <span className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-500">
                    {org}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── SECTION 5 — THE RESEARCH CASE ───────────────────────────────────────────

const researchBuyers = [
  {
    title: 'Academic Researchers',
    body: 'IRB-approved, de-identified EMDR outcomes data at scale. The dataset trauma researchers have needed for 35 years.',
  },
  {
    title: 'Insurance Payers',
    body: 'Proof that EMDR works, how long it takes, and what between-session engagement predicts about dropout and acute care utilization.',
  },
  {
    title: 'Pharmaceutical Companies',
    body: 'Between-session behavioral monitoring infrastructure for trauma-related drug trials. Pre-built, validated, HIPAA-compliant.',
  },
]

function ResearchSection() {
  return (
    <section id="research" className="bg-sage-50 py-24 lg:py-32 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left */}
          <div className="space-y-6">
            <FadeUp>
              <SL>The Research Case</SL>
              <h2 className="font-display text-[40px] md:text-[52px] font-light text-forest-900 leading-[1.08]">
                The data that doesn&rsquo;t exist yet.<br />That we&rsquo;ll build.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                There is no large-scale, longitudinal, clinician-validated EMDR
                outcomes database in the world. The research community has worked
                from small clinical trials and case studies for 35 years. Phasepoint
                generates that data as a natural byproduct of clinical operation.
              </p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                Every patient on the platform — with explicit consent and rigorous
                de-identification — contributes to an outcomes registry that tracks
                SUDS trajectories, VOC progressions, session counts to remission,
                between-session engagement patterns, dropout predictors, and phase
                progression timing.
              </p>
            </FadeUp>
            <FadeUp delay={0.26}>
              <p className="font-body text-[15px] text-cream-700 leading-relaxed">
                This dataset will be licensable to academic medical centers, the VA
                National Center for PTSD, NIMH, EMDRIA&rsquo;s research foundation,
                and pharmaceutical companies conducting trauma trials. It is
                potentially the most valuable clinical dataset in trauma research —
                and it grows with every session.
              </p>
            </FadeUp>
          </div>

          {/* Right — buyer cards */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-col gap-4 justify-start"
          >
            {researchBuyers.map(({ title, body }) => (
              <motion.div
                key={title}
                variants={stagger.item}
                className="bg-white rounded-2xl border border-sage-200 p-6 space-y-2 shadow-[0_1px_6px_rgba(26,26,24,0.04)]"
              >
                <h3 className="font-body text-sm font-semibold text-forest-900">{title}</h3>
                <p className="font-body text-[13.5px] text-cream-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 6 — THE BUSINESS ─────────────────────────────────────────────────

const phases = [
  {
    num: '01',
    title: 'Pilot — One Practice',
    body: 'Validate clinical value, RTM billing eligibility, and patient outcomes in a single EMDR practice. Establish the clinical evidence base.',
  },
  {
    num: '02',
    title: 'Network — EMDR Community',
    body: "License to EMDRIA's 20,000+ member network. The RTM billing generated covers the platform cost. The outcomes data builds the research case.",
  },
  {
    num: '03',
    title: 'Scale — Clinical Infrastructure',
    body: 'Group practices, health systems, VA networks, international EMDR associations. The platform becomes the operating layer of global EMDR care.',
  },
]

const rtmMath = [
  { value: '$1,032', sub: 'per month · 20 patients at CPT 98980', highlight: false },
  { value: '− $300', sub: 'platform subscription', highlight: false },
  { value: '$732',   sub: 'net gain per month',                   highlight: true  },
  { value: '$8,784', sub: 'per year · pure additional revenue',  highlight: false },
]

function BusinessSection() {
  return (
    <section className="bg-forest-900 py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-14">

        <FadeUp>
          <SL light>The Business</SL>
          <h2 className="font-display text-[40px] md:text-[52px] font-light text-cream-50 leading-[1.08]">
            One practice. Then the world.
          </h2>
        </FadeUp>

        {/* Phase cards */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {phases.map(({ num, title, body }) => (
            <motion.div
              key={num}
              variants={stagger.item}
              className="bg-cream-50/8 border border-cream-50/10 rounded-2xl p-6 space-y-4"
            >
              <p className="font-display text-[48px] font-light text-amber-400 leading-none">{num}</p>
              <div className="space-y-2">
                <h3 className="font-body text-sm font-semibold text-cream-50">{title}</h3>
                <p className="font-body text-[13.5px] text-cream-200/65 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* RTM Math */}
        <FadeUp>
          <div className="border-t border-cream-50/10 pt-10 space-y-5">
            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-sage-300/60">The RTM Math</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {rtmMath.map(({ value, sub, highlight }) => (
                <div key={value}>
                  <p
                    className={[
                      'font-display text-[36px] font-light leading-none',
                      highlight ? 'text-amber-400' : 'text-cream-50',
                    ].join(' ')}
                  >
                    {value}
                  </p>
                  <p className="font-body text-[11px] text-cream-400/60 mt-1.5 leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-[12.5px] text-cream-400/50 max-w-[520px] leading-relaxed">
              Before research licensing, before marketplace, before payer contracts.
              The RTM billing alone covers the platform cost by 3.4×.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── SECTION 7 — MISSION ─────────────────────────────────────────────────────

function MissionSection() {
  return (
    <section className="py-28 lg:py-36" style={{ background: 'var(--surface-base)' }}>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center space-y-10">

        <FadeUp>
          <h2 className="font-display text-[38px] md:text-[56px] lg:text-[72px] font-light text-forest-900 leading-[1.08]">
            There are 150,000 trained EMDR<br className="hidden md:block" /> therapists in the world.
          </h2>
        </FadeUp>

        <FadeUp delay={0.28}>
          <h2 className="font-display text-[38px] md:text-[56px] lg:text-[72px] font-light text-forest-700 leading-[1.08]">
            There are hundreds of millions of<br className="hidden md:block" /> trauma survivors who need them.
          </h2>
        </FadeUp>

        <FadeUp delay={0.44}>
          <p className="font-body text-[17px] md:text-[18px] text-cream-600 max-w-[640px] mx-auto leading-relaxed">
            Phasepoint is how we close that gap. Not by replacing the clinical
            relationship — but by extending it into the 167 hours where patients
            are currently alone.
          </p>
        </FadeUp>

        <FadeUp delay={0.56}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center bg-forest-900 text-cream-25 font-body font-medium text-[14px] tracking-[0.05em] px-6 py-3 rounded hover:bg-forest-800 transition-colors duration-200"
            >
              Explore the Clinical Demo →
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center border border-forest-900/30 text-forest-900 font-body font-medium text-[14px] tracking-[0.05em] px-6 py-3 rounded hover:bg-forest-900/5 transition-colors duration-200"
            >
              See the RTM Calculator
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const footerLinks = [
  { href: '/demo',       label: 'Patient Portal' },
  { href: '/clinician',  label: 'Clinician OS' },
  { href: '/calculator', label: 'RTM Calculator' },
  { href: '/research',   label: 'Research Case' },
]

function Footer() {
  return (
    <footer className="bg-forest-950">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Wordmark + tagline */}
          <div className="space-y-2">
            <Link href="/" className="font-display text-lg tracking-[0.2em] text-cream-50 uppercase block">
              Phasepoint
            </Link>
            <p className="font-body text-xs text-cream-400/60">
              Clinical Demo — Built to start a conversation.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-xs text-cream-400/50 hover:text-cream-300 transition-colors uppercase tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Pilot interest */}
          <div className="md:text-right space-y-1">
            <p className="font-body text-xs text-cream-400/60">Interested in piloting Phasepoint?</p>
            <a
              href="mailto:pilot@phasepoint.io"
              className="font-body text-sm text-sage-300/80 hover:text-sage-300 transition-colors"
            >
              pilot@phasepoint.io
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-cream-50/5 py-4">
        <p className="text-center font-body text-[10px] text-cream-50/25 tracking-wide">
          This is a demonstration prototype. All patient data is fictional. Built on peer-reviewed EMDR clinical research.
        </p>
      </div>
    </footer>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <ProductSection />
      <ClinicalSection />
      <ResearchSection />
      <BusinessSection />
      <MissionSection />
      <Footer />
    </div>
  )
}
