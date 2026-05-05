'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'

// ─── Constants ────────────────────────────────────────────────────────────────

const RATE_98980    = 50.14
const RATE_98978    = 43.02
const PLATFORM_PER  = 29
const PLATFORM_CAP  = 300

// ─── Helpers ──────────────────────────────────────────────────────────────────

function usd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderControl({
  label, value, min, max, onChange, display, sub, warning,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  display: string
  sub: string
  warning?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">{label}</p>
        <p className="font-display text-[32px] font-light text-forest-900 leading-none shrink-0">{display}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-[3px] rounded-full appearance-none cursor-pointer outline-none"
        style={{ background: `linear-gradient(to right, #1C3D2E ${pct}%, #E8E4D8 ${pct}%)` }}
      />
      <div className="flex justify-between items-start">
        <span className="font-body text-[10px] text-cream-300">{min}</span>
        <p className="font-body text-[11px] text-cream-500 text-center px-3 leading-snug max-w-[220px]">{sub}</p>
        <span className="font-body text-[10px] text-cream-300">{max}</span>
      </div>
      {warning && <p className="font-body text-[11px] text-amber-600 leading-snug">{warning}</p>}
    </div>
  )
}

function MetricCard({
  label, value, sub, variant = 'neutral',
}: {
  label: string
  value: string
  sub: string
  variant?: 'neutral' | 'negative' | 'highlight'
}) {
  const bg = variant === 'highlight' ? 'bg-forest-900 border-forest-900'
           : variant === 'negative'  ? 'bg-amber-50 border-amber-200/60'
           : 'bg-cream-25 border-cream-200'
  const lc = variant === 'highlight' ? 'text-sage-300/70'  : 'text-cream-400'
  const vc = variant === 'highlight' ? 'text-cream-25'     : variant === 'negative' ? 'text-amber-600' : 'text-forest-900'
  const sc = variant === 'highlight' ? 'text-sage-200/55'  : 'text-cream-400'

  return (
    <div className={`rounded-2xl border px-4 py-4 space-y-1 ${bg}`}>
      <p className={`font-body text-[10px] uppercase tracking-[0.1em] ${lc}`}>{label}</p>
      <p className={`font-display text-[28px] font-light leading-none ${vc}`}>{value}</p>
      <p className={`font-body text-[10px] leading-snug ${sc}`}>{sub}</p>
    </div>
  )
}

const CPT_CODES = [
  { code: '98975', desc: 'RTM setup and initial patient education',             rate: '$19.22', freq: 'Once'    },
  { code: '98978', desc: 'Behavioral health monitoring device supply',           rate: '$43.02', freq: 'Monthly' },
  { code: '98980', desc: 'RTM treatment management, first 20 minutes',           rate: '$50.14', freq: 'Monthly' },
  { code: '98981', desc: 'RTM treatment management, each additional 20 minutes', rate: '$40.84', freq: 'Monthly' },
] as const

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  const [patients,      setPatients]      = useState(20)
  const [sessionFee,    setSessionFee]    = useState(175)
  const [reviewMinutes, setReviewMinutes] = useState(22)
  const [include98978,  setInclude98978]  = useState(true)

  const rev98980         = patients * RATE_98980
  const rev98978         = include98978 ? patients * RATE_98978 : 0
  const totalRtmRev      = rev98980 + rev98978
  const platformCost     = Math.min(patients * PLATFORM_PER, PLATFORM_CAP)
  const netMonthly       = totalRtmRev - platformCost
  const annualProjection = netMonthly * 12

  const monthlySessionRev  = patients * sessionFee * 4
  const rtmPct             = monthlySessionRev > 0
    ? Math.min((totalRtmRev / monthlySessionRev) * 100, 100)
    : 0
  const revenuePerPatient  = RATE_98980 + (include98978 ? RATE_98978 : 0)
  const breakEven          = Math.ceil(PLATFORM_CAP / revenuePerPatient)
  const reviewWarning      = reviewMinutes < 20
    ? 'RTM billing (98980) requires 20+ min of review per patient per month to qualify.'
    : undefined

  return (
    <>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          background: #1C3D2E; border-radius: 50%;
          cursor: pointer;
          border: 2.5px solid #FAF7F2;
          box-shadow: 0 1px 4px rgba(28,61,46,0.25);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px; height: 16px;
          background: #1C3D2E; border-radius: 50%;
          cursor: pointer;
          border: 2px solid #FAF7F2;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-[1100px] mx-auto w-full px-6 py-10 space-y-14"
      >
        {/* Header */}
        <div className="max-w-2xl">
          <SectionLabel className="mb-2">Remote Therapeutic Monitoring</SectionLabel>
          <h1 className="font-display text-[44px] md:text-[60px] font-light text-forest-900 leading-[1.05]">
            RTM Revenue<br />Calculator
          </h1>
          <p className="font-body text-[15px] text-cream-600 mt-4 leading-relaxed max-w-[560px]">
            Estimate the revenue impact of adding Remote Therapeutic Monitoring to your EMDR practice.
            Based on CMS 2026 published rates. Conservative estimates only.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Controls */}
          <div className="space-y-10">
            <SliderControl
              label="Active Phasepoint Patients"
              value={patients} min={5} max={75}
              onChange={setPatients}
              display={String(patients)}
              sub="Patients actively using the platform with clinician review"
            />
            <SliderControl
              label="Average Session Fee"
              value={sessionFee} min={100} max={400}
              onChange={setSessionFee}
              display={`$${sessionFee}`}
              sub="Your current per-session rate"
            />
            <SliderControl
              label="Monthly Review Minutes Per Patient"
              value={reviewMinutes} min={15} max={45}
              onChange={setReviewMinutes}
              display={`${reviewMinutes} min`}
              sub="Time reviewing between-session data per patient per month"
              warning={reviewWarning}
            />

            {/* Toggle */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-25 border border-cream-100">
              <button
                onClick={() => setInclude98978(v => !v)}
                className={[
                  'relative w-11 h-[22px] rounded-full transition-colors shrink-0 mt-0.5',
                  include98978 ? 'bg-forest-900' : 'bg-cream-200',
                ].join(' ')}
                aria-label="Toggle RTM supply code 98978"
              >
                <span className={[
                  'absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                  include98978 ? 'translate-x-[26px]' : 'translate-x-[3px]',
                ].join(' ')} />
              </button>
              <div>
                <p className="font-body text-[13px] font-medium text-forest-900">Include RTM Supply Code (98978)</p>
                <p className="font-body text-[12px] text-cream-500 mt-0.5 leading-relaxed">
                  Behavioral health monitoring device supply — billed monthly when platform is used as the monitoring device
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="space-y-4">
            {/* 2×2 metric cards */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Monthly RTM Revenue"
                value={usd(totalRtmRev)}
                sub={`${patients} pts × CPT 98980${include98978 ? ' + 98978' : ''}`}
                variant="neutral"
              />
              <MetricCard
                label="Platform Cost"
                value={`\u2212${usd(platformCost)}`}
                sub="$29/patient · max $300/mo"
                variant="negative"
              />
              <MetricCard
                label="Net Monthly Gain"
                value={usd(netMonthly)}
                sub="Pure additional revenue"
                variant="highlight"
              />
              <MetricCard
                label="Annual Projection"
                value={usd(annualProjection)}
                sub="At current patient count"
                variant="neutral"
              />
            </div>

            {/* RTM % of session revenue */}
            <div className="bg-cream-25 rounded-2xl px-5 py-4 space-y-3 border border-cream-100">
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">RTM as % of Session Revenue</p>
              <p className="font-body text-[13px] text-cream-700 leading-relaxed">
                At {patients} patients, RTM represents{' '}
                <span className="font-semibold text-forest-900">{rtmPct.toFixed(1)}%</span>
                {' '}of your monthly session revenue
                <span className="text-cream-400 text-[11px] ml-1">(assumes 4 sessions/mo)</span>
              </p>
              <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-700 rounded-full transition-all duration-300"
                  style={{ width: `${rtmPct}%` }}
                />
              </div>
            </div>

            {/* Break-even */}
            <div className="bg-cream-25 rounded-2xl px-5 py-4 space-y-1 border border-cream-100">
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Break-even</p>
              <p className="font-body text-[13px] text-cream-700 leading-relaxed">
                You break even on the platform at{' '}
                <span className="font-semibold text-forest-900">
                  {breakEven} patient{breakEven !== 1 ? 's' : ''}
                </span>
                . Everything above that is net gain.
              </p>
            </div>
          </div>
        </div>

        {/* How RTM Billing Works */}
        <div className="max-w-2xl space-y-5">
          <SectionLabel className="mb-1">How It Works</SectionLabel>
          <h2 className="font-display text-[32px] font-light text-forest-900">How RTM Billing Works</h2>
          <ol className="space-y-4">
            {[
              'Patient uses Phasepoint between sessions — check-ins, grounding tools, journal entries.',
              'Patient-generated data streams to the clinician dashboard in real time.',
              'Clinician reviews activity (20+ min/patient/month required for CPT 98980).',
              'Phasepoint auto-logs clinician review time and generates billing documentation.',
              'Submit CPT 98978, 98980, and 98981 to your billing coordinator with generated records.',
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-cream-25 font-body text-xs font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="font-body text-[14px] text-cream-700 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* CPT Reference Table */}
        <div className="space-y-5">
          <SectionLabel className="mb-1">CPT Reference</SectionLabel>
          <h2 className="font-display text-[32px] font-light text-forest-900">CPT Code Reference</h2>
          <div className="rounded-2xl border border-cream-200 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-cream-25 border-b border-cream-200">
                  {['Code', 'Description', '2026 CMS Rate', 'Frequency'].map((h) => (
                    <th key={h} className={[
                      'font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 px-5 py-3',
                      h === 'Code' || h === 'Description' ? 'text-left' : 'text-right',
                    ].join(' ')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CPT_CODES.map((row, i) => (
                  <tr key={row.code} className={i < CPT_CODES.length - 1 ? 'border-b border-cream-100' : ''}>
                    <td className="font-mono text-[13px] font-bold text-forest-900 px-5 py-3.5">{row.code}</td>
                    <td className="font-body text-[13px] text-cream-700 px-5 py-3.5">{row.desc}</td>
                    <td className="font-body text-[13px] font-semibold text-forest-900 text-right px-5 py-3.5">{row.rate}</td>
                    <td className="font-body text-[12px] text-cream-400 text-right px-5 py-3.5">{row.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-cream-200 bg-cream-25 px-6 py-5">
          <p className="font-body text-[12px] text-cream-500 leading-relaxed">
            Rates based on CMS 2026 national averages. Commercial payer coverage varies by insurer.
            Verify RTM coverage with your specific payers before billing. Consult a health law attorney
            for compliance review. This calculator is illustrative only and does not constitute
            financial, legal, or medical advice.
          </p>
        </div>
      </motion.div>
    </>
  )
}
