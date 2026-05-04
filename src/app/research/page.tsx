'use client'

import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'

const ease = [0.25, 0.46, 0.45, 0.94] as const

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA_FIELDS = [
  {
    type:     'SUDS trajectory per target',
    clinical: 'Processing progress marker',
    research: 'Dose-response curves for EMDR',
  },
  {
    type:     'VOC progression',
    clinical: 'Belief change measurement',
    research: 'Mechanism of change research',
  },
  {
    type:     'Session count to remission',
    clinical: 'Treatment efficiency',
    research: 'Health economics modeling',
  },
  {
    type:     'Between-session engagement',
    clinical: 'Adherence correlates',
    research: 'Dropout prediction models',
  },
  {
    type:     'Phase progression timing',
    clinical: 'Clinical benchmarking',
    research: 'Protocol optimization',
  },
  {
    type:     'Dissociation screening',
    clinical: 'Safety stratification',
    research: 'Complex trauma research',
  },
  {
    type:     'PCL-5 / PHQ-9 trends',
    clinical: 'Symptom change',
    research: 'Comparative effectiveness',
  },
]

const CITATIONS = [
  {
    n:    1,
    text: 'Homework compliance and therapy outcomes: significant relationship across 2,183 subjects (r\u00a0=\u00a0.26). Greater between-session engagement\u00a0=\u00a0improved treatment outcome.',
    src:  'Updated Meta-Analysis, Cognitive Therapy and Research',
  },
  {
    n:    2,
    text: 'AI-enabled therapy support tool: higher reliable improvement, recovery, and reliable recovery rates vs. control group.',
    src:  'NHS Talking Therapies, Journal of Medical Internet Research, 2025',
  },
  {
    n:    3,
    text: '100% of single-trauma survivors showed no diagnosable PTSD after 6 EMDR sessions.',
    src:  'Multinational EMDR research, multiple peer-reviewed replications',
  },
  {
    n:    4,
    text: 'EMDR recommended as first-line PTSD treatment by WHO, VA/DoD, APA, NICE, and ISTSS.',
    src:  'International clinical guidelines, multiple organizations',
  },
  {
    n:    5,
    text: 'No large-scale longitudinal EMDR outcomes database currently exists in any form.',
    src:  'EMDRIA Research Foundation review, 2024',
  },
]

const GOVERNANCE = [
  { label: 'Patient consent',    detail: 'Explicit, granular, revocable at any time' },
  { label: 'De-identification',  detail: 'HIPAA Safe Harbor standard minimum' },
  { label: 'IRB',                detail: 'Registry design reviewed before broad deployment' },
  { label: 'Data governance',    detail: 'Clinical advisory board oversight' },
  { label: 'Export format',      detail: 'OMOP CDM compatible for federated research networks' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="max-w-[800px] mx-auto w-full px-6 py-12 space-y-20"
    >

      {/* ─── Header ────────────────────────────────────────────────────── */}
      <FadeUp>
        <SectionLabel className="mb-3">Research Architecture</SectionLabel>
        <h1 className="font-display text-[40px] md:text-[56px] font-light text-forest-900 leading-[1.08]">
          35 years of EMDR.<br />Zero longitudinal<br />outcomes database.<br />
          <em className="italic text-forest-600">Until now.</em>
        </h1>
        <div className="mt-6 pt-6 border-t border-cream-100">
          <p className="font-display text-[28px] md:text-[32px] font-light text-cream-600 italic leading-[1.2]">
            &ldquo;The Missing Dataset&rdquo;
          </p>
        </div>
      </FadeUp>

      {/* ─── Section 1: The Research Gap ─────────────────────────────── */}
      <FadeUp>
        <div className="space-y-5">
          <SectionLabel className="mb-2">The Research Gap</SectionLabel>
          <div className="space-y-4">
            {[
              "EMDR therapy has one of the strongest evidence bases in all of psychotherapy. It is recommended by the World Health Organization, the VA/DoD, the APA, NICE, and ISTSS. It works.",
              "And yet the research community has been working from small clinical trials and case studies for 35 years. There is no large-scale, clinician-validated, longitudinal EMDR outcomes registry in existence — anywhere in the world.",
              "Phasepoint generates that registry as a natural byproduct of clinical operation. Every session. Every patient. With consent. With de-identification. With IRB-ready export infrastructure.",
            ].map((p, i) => (
              <p key={i} className="font-body text-[16px] text-cream-700 leading-[1.75]">{p}</p>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── Section 2: What the Data Contains ───────────────────────── */}
      <FadeUp>
        <div className="space-y-5">
          <SectionLabel className="mb-2">What the Data Contains</SectionLabel>
          <div className="rounded-2xl border border-cream-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-25 border-b border-cream-200">
                  {['Data Type', 'Clinical Significance', 'Research Value'].map((h) => (
                    <th
                      key={h}
                      className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 text-left px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA_FIELDS.map((row, i) => (
                  <tr key={i} className={i < DATA_FIELDS.length - 1 ? 'border-b border-cream-100' : ''}>
                    <td className="font-body text-[12px] font-semibold text-forest-900 px-5 py-3">
                      {row.type}
                    </td>
                    <td className="font-body text-[12px] text-cream-600 px-5 py-3">{row.clinical}</td>
                    <td className="font-body text-[12px] text-cream-500 italic px-5 py-3">{row.research}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>

      {/* ─── Section 3: Who Pays for It ───────────────────────────────── */}
      <FadeUp>
        <div className="space-y-6">
          <SectionLabel className="mb-2">Who Pays for It</SectionLabel>
          <div className="space-y-4">
            {[
              {
                title: 'Academic Research Institutions',
                body:  "IRB-approved, de-identified EMDR outcomes data at scale. The dataset trauma researchers have needed since Francine Shapiro developed EMDR in 1987. Target partners: VA National Center for PTSD, NIMH, EMDRIA Research Foundation, leading academic medical centers.",
              },
              {
                title: 'Insurance Payers',
                body:  "Proof that EMDR works, how long it takes, what between-session engagement predicts about dropout and acute care utilization, and where the cost savings in the healthcare system appear. The foundation of outcomes-based contracts.",
              },
              {
                title: 'Pharmaceutical Companies',
                body:  "Clinical trial infrastructure for trauma-related drug studies. Pre-built HIPAA-compliant between-session behavioral monitoring. Patient engagement tracking. De-identified symptom datasets.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-cream-100 px-6 py-5 space-y-2.5 shadow-[0_1px_6px_rgba(26,26,24,0.04)]"
              >
                <h3 className="font-body text-[14px] font-semibold text-forest-900">{title}</h3>
                <p className="font-body text-[14px] text-cream-600 leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── Section 4: The Clinical Evidence Base ───────────────────── */}
      <FadeUp>
        <div className="space-y-5">
          <SectionLabel className="mb-2">The Clinical Evidence Base</SectionLabel>
          <p className="font-body text-[16px] text-cream-700 leading-[1.75] mb-6">
            Phasepoint is not the first to show that between-session support improves therapy
            outcomes. It is the first to build the infrastructure to capture that data rigorously
            in EMDR specifically.
          </p>
          <div className="space-y-4">
            {CITATIONS.map(({ n, text, src }) => (
              <div key={n} className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-cream-100 text-cream-500 font-body text-xs font-semibold flex items-center justify-center shrink-0">
                  {n}
                </span>
                <div>
                  <p className="font-body text-[14px] text-forest-900 leading-[1.65]">{text}</p>
                  <p className="font-body text-[11px] text-cream-400 italic mt-1.5">{src}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── Section 5: The Insurance Conversation ───────────────────── */}
      <FadeUp>
        <div className="bg-forest-900 rounded-3xl px-7 py-8 space-y-5">
          <SectionLabel className="text-sage-300/60 mb-2">The Larger Opportunity</SectionLabel>
          <h2 className="font-display text-[28px] md:text-[32px] font-light text-cream-50 leading-[1.15]">
            The Insurance Conversation
          </h2>
          <p className="font-body text-[14px] text-cream-100/75 leading-[1.75]">
            The payer opportunity is not the RTM billing — that&rsquo;s near-term. The real
            opportunity is outcomes-based contracts.
          </p>
          <div className="space-y-2.5">
            {[
              'EMDR patients complete treatment in fewer sessions with platform support',
              'Between-session engagement predicts treatment completion',
              'Completion correlates with reduced acute care utilization in the 12 months following treatment',
            ].map((point) => (
              <div key={point} className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300 shrink-0 mt-2" />
                <p className="font-body text-[14px] text-cream-100/70 leading-[1.65]">
                  {point}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-[14px] text-cream-100/75 leading-[1.75] border-t border-cream-50/10 pt-5">
            &hellip;that data is the foundation of a per-member-per-month outcomes contract
            worth orders of magnitude more than per-session RTM billing.
          </p>
        </div>
      </FadeUp>

      {/* ─── Section 6: Research Governance ──────────────────────────── */}
      <FadeUp>
        <div className="space-y-5">
          <SectionLabel className="mb-2">Research Governance</SectionLabel>
          <p className="font-body text-[16px] text-cream-700 leading-[1.75] mb-5">
            Every element of the outcomes registry is built to research standards from day one.
          </p>
          <div className="space-y-3">
            {GOVERNANCE.map(({ label, detail }) => (
              <div
                key={label}
                className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-cream-25 border border-cream-100"
              >
                <div className="w-2 h-2 rounded-full bg-forest-600 shrink-0 mt-1.5" />
                <div>
                  <p className="font-body text-[13px] font-semibold text-forest-900">{label}</p>
                  <p className="font-body text-[13px] text-cream-500 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── Footer note ─────────────────────────────────────────────── */}
      <FadeUp>
        <div className="border-t border-cream-200 pt-8">
          <p className="font-display text-[22px] md:text-[26px] font-light text-forest-700 italic leading-[1.4]">
            &ldquo;The dataset doesn&rsquo;t exist yet. It begins with one practice.
            Then it becomes the most important clinical dataset in trauma research.&rdquo;
          </p>
        </div>
      </FadeUp>

    </motion.div>
  )
}
