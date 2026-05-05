'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type Modality = 'standard' | 'complex' | 'adolescent' | 'grief'
type DissociationRisk = 'low' | 'moderate' | 'high'

interface SupportContact { name: string; relationship: string; phone: string }
interface PastMemory {
  id: string; label: string; age: string; suds: number
  nc: string; pc: string; voc: number; body: string
  status: 'queued' | 'active' | 'deferred'
}
interface PresentTrigger {
  id: string; description: string; context: string; suds: number
  frequency: string; avoidance: string; linkedMemory: string
}
interface FutureTemplate {
  id: string; scenario: string; pc: string; confidence: number
}
interface ResourceForm {
  name: string; visual: string; auditory: string; olfactory: string
  tactile: string; body: string; blsModality: string; blsSpeed: string
  blsSets: number; blsPasses: number; response: string; strength: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5

const RESOURCE_DEFS = [
  { id: 'safe_place',        label: 'Safe Place',          color: 'bg-sage-50 border-sage-200' },
  { id: 'calm_place',        label: 'Calm Place',          color: 'bg-sage-50 border-sage-200' },
  { id: 'nurturing_figure',  label: 'Nurturing Figure',    color: 'bg-amber-50 border-amber-200' },
  { id: 'protective_figure', label: 'Protective Figure',   color: 'bg-amber-50 border-amber-200' },
  { id: 'animal',            label: 'Animal Resource',     color: 'bg-cream-25 border-cream-200' },
  { id: 'container',         label: 'Container',           color: 'bg-cream-25 border-cream-200' },
]

const ALL_TOOLS = [
  { id: 'window_checkin',    label: 'Window of Tolerance Check-in', default: true },
  { id: 'physio_sigh',       label: 'Physiological Sigh',          default: true },
  { id: 'box_breathing',     label: 'Box Breathing',                default: true },
  { id: 'grounding_5senses', label: '5-4-3-2-1 Grounding',         default: true },
  { id: 'closure_ritual',    label: 'Closure Ritual',               default: true },
  { id: 'journal',           label: 'Journal',                      default: true },
  { id: 'session_memory',    label: 'Session Memory (read-only)',   default: true },
  { id: 'bls_resourcing',    label: 'Bilateral Stimulation',        default: false, highRiskGate: true },
  { id: 'safe_place',        label: 'Safe Place',                   default: false, requiresInstall: true },
  { id: 'container',         label: 'Container',                    default: false, requiresInstall: true },
  { id: 'butterfly_hug',     label: 'Butterfly Hug',                default: false },
]

const DEFAULT_WARNING_SIGNALS = [
  'SUDS above 7 for more than 30 minutes',
  'Inability to access safe place resource',
  'Intrusive memories interfering with sleep',
  'Thoughts of harming self or others',
  'Dissociative episodes',
  'Substance use as coping',
  'Isolation from support system',
  'Missing multiple sessions',
]

const DEFAULT_COPING = [
  'Safe place — will update when installed',
  'Container exercise',
  '4-7-8 breathing (4 cycles)',
  'Grounding: 5 things I can see, hear, touch',
  'Call support contact',
]

const EMPTY_RESOURCE_FORM: ResourceForm = {
  name: '', visual: '', auditory: '', olfactory: '', tactile: '',
  body: '', blsModality: 'butterfly_hug', blsSpeed: 'gentle',
  blsSets: 3, blsPasses: 6, response: '', strength: 7,
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400 mb-1.5">
      {children}
    </p>
  )
}

function Input({
  value, onChange, placeholder, type = 'text',
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white font-body text-[14px] text-forest-900 placeholder:text-cream-300 focus:outline-none focus:border-sage-400 transition-colors"
    />
  )
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white font-body text-[14px] text-forest-900 placeholder:text-cream-300 focus:outline-none focus:border-sage-400 transition-colors resize-none"
    />
  )
}

function Pill({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-lg border font-body text-sm transition-colors',
        active
          ? 'bg-forest-900 border-forest-900 text-cream-25'
          : 'bg-white border-cream-200 text-cream-600 hover:border-forest-300 hover:text-forest-800',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Slider({
  value, min, max, onChange, label,
}: {
  value: number; min: number; max: number; onChange: (v: number) => void; label: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="font-body text-sm font-semibold text-forest-900">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-forest-900"
      />
      <div className="flex justify-between font-body text-[10px] text-cream-300">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({
  data, onChange,
}: {
  data: {
    name: string; age: string; pronouns: string; concern: string
    modality: Modality; dissociationRisk: DissociationRisk
  }
  onChange: (k: string, v: string) => void
}) {
  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label>Full name</Label>
          <Input value={data.name} onChange={v => onChange('name', v)} placeholder="Patient full name" />
        </div>
        <div>
          <Label>Age</Label>
          <Input value={data.age} onChange={v => onChange('age', v)} type="number" placeholder="0" />
        </div>
        <div>
          <Label>Pronouns (optional)</Label>
          <Input value={data.pronouns} onChange={v => onChange('pronouns', v)} placeholder="she/her" />
        </div>
        <div className="sm:col-span-2">
          <Label>Primary presenting concern</Label>
          <Textarea
            value={data.concern}
            onChange={v => onChange('concern', v)}
            placeholder="Brief description of what brought them to therapy"
            rows={3}
          />
        </div>
      </div>

      <div>
        <Label>Modality</Label>
        <div className="flex flex-wrap gap-2">
          {(['standard', 'complex', 'adolescent', 'grief'] as Modality[]).map(m => (
            <Pill key={m} active={data.modality === m} onClick={() => onChange('modality', m)}>
              {m === 'standard' ? 'Standard EMDR'
                : m === 'complex' ? 'Complex Trauma EMDR'
                : m === 'adolescent' ? 'Adolescent EMDR'
                : 'Grief & Bereavement'}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <Label>Dissociation risk</Label>
        <div className="flex gap-2">
          {(['low', 'moderate', 'high'] as DissociationRisk[]).map(r => (
            <Pill key={r} active={data.dissociationRisk === r} onClick={() => onChange('dissociationRisk', r)}>
              {r === 'high' ? 'High — gate BLS' : r.charAt(0).toUpperCase() + r.slice(1)}
            </Pill>
          ))}
        </div>
        {data.dissociationRisk === 'high' && (
          <p className="mt-2 font-body text-[12px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
            Bilateral stimulation will require explicit session assignment. Patient cannot self-initiate BLS.
          </p>
        )}
      </div>

      <p className="font-body text-[12px] text-cream-400 border-t border-cream-100 pt-4">
        You'll gather full history in Phase 1. This is enough to get started.
      </p>
    </div>
  )
}

function Step2({
  data, onChange,
}: {
  data: {
    clinicianContact: string
    supportContacts: SupportContact[]
    copingStrategies: string[]
    warningSignals: string[]
  }
  onChange: (k: string, v: unknown) => void
}) {
  function updateContact(i: number, k: keyof SupportContact, v: string) {
    const next = [...data.supportContacts]
    next[i] = { ...next[i], [k]: v }
    onChange('supportContacts', next)
  }

  function addContact() {
    if (data.supportContacts.length >= 3) return
    onChange('supportContacts', [...data.supportContacts, { name: '', relationship: '', phone: '' }])
  }

  function removeContact(i: number) {
    onChange('supportContacts', data.supportContacts.filter((_, j) => j !== i))
  }

  function updateCoping(i: number, v: string) {
    const next = [...data.copingStrategies]
    next[i] = v
    onChange('copingStrategies', next)
  }

  function toggleSignal(signal: string) {
    const current = data.warningSignals
    onChange('warningSignals', current.includes(signal)
      ? current.filter(s => s !== signal)
      : [...current, signal])
  }

  return (
    <div className="space-y-8">
      {/* Crisis resources */}
      <div>
        <Label>If they're in crisis right now</Label>
        <div className="rounded-xl border border-cream-200 bg-cream-25 px-4 py-3 space-y-2">
          {[['988 Suicide & Crisis Lifeline', '988'], ['Crisis Text Line', 'Text HOME to 741741']].map(([name, number]) => (
            <div key={name} className="flex items-center justify-between">
              <span className="font-body text-[13px] text-forest-900">{name}</span>
              <span className="font-body text-[12px] font-semibold text-forest-600">{number}</span>
            </div>
          ))}
        </div>
        <p className="mt-1.5 font-body text-[11px] text-cream-400">These are always present. You're adding to them, not replacing them.</p>
      </div>

      {/* Clinician contact */}
      <div>
        <Label>Your after-hours contact instruction</Label>
        <Textarea
          value={data.clinicianContact}
          onChange={v => onChange('clinicianContact', v)}
          placeholder="e.g. Leave voicemail, response within 2 hours"
          rows={2}
        />
      </div>

      {/* Support contacts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>People who care about them</Label>
          {data.supportContacts.length < 3 && (
            <button type="button" onClick={addContact} className="font-body text-[11px] text-forest-600 hover:text-forest-900 transition-colors">
              + Add contact
            </button>
          )}
        </div>
        {data.supportContacts.length === 0 && (
          <button
            type="button"
            onClick={addContact}
            className="w-full py-3 rounded-xl border border-dashed border-cream-200 font-body text-[13px] text-cream-400 hover:border-forest-300 hover:text-forest-600 transition-colors"
          >
            + Add support contact
          </button>
        )}
        <div className="space-y-3">
          {data.supportContacts.map((c, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-start">
              <Input value={c.name} onChange={v => updateContact(i, 'name', v)} placeholder="Name" />
              <Input value={c.relationship} onChange={v => updateContact(i, 'relationship', v)} placeholder="Relationship" />
              <div className="flex gap-1">
                <Input value={c.phone} onChange={v => updateContact(i, 'phone', v)} placeholder="Phone" />
                <button type="button" onClick={() => removeContact(i)} className="text-cream-300 hover:text-cream-500 px-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coping strategies */}
      <div>
        <Label>What to do when activated</Label>
        <ol className="space-y-2">
          {data.copingStrategies.map((s, i) => (
            <li key={i} className="flex gap-3 items-center">
              <span className="w-6 h-6 rounded-full bg-forest-900 text-cream-25 font-body text-[10px] font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <input
                value={s}
                onChange={e => updateCoping(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] text-forest-900 focus:outline-none focus:border-sage-400 transition-colors"
              />
            </li>
          ))}
        </ol>
        <p className="mt-2 font-body text-[11px] text-cream-400">Step 1 will update automatically when you install their safe place resource.</p>
      </div>

      {/* Warning signals */}
      <div>
        <Label>Warning signals to watch for</Label>
        <div className="space-y-2">
          {DEFAULT_WARNING_SIGNALS.map(signal => (
            <label key={signal} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.warningSignals.includes(signal)}
                onChange={() => toggleSignal(signal)}
                className="w-4 h-4 accent-forest-900 rounded"
              />
              <span className="font-body text-[13px] text-cream-700 group-hover:text-forest-900 transition-colors">{signal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step3({
  installedResources,
  resourceForms,
  expandedResource,
  onToggleExpand,
  onInstall,
  onUpdateForm,
}: {
  installedResources: Set<string>
  resourceForms: Record<string, ResourceForm>
  expandedResource: string | null
  onToggleExpand: (id: string) => void
  onInstall: (id: string) => void
  onUpdateForm: (id: string, k: keyof ResourceForm, v: string | number) => void
}) {
  const patientName = 'the patient'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESOURCE_DEFS.map(({ id, label, color }) => {
          const installed = installedResources.has(id)
          const expanded = expandedResource === id
          const form = resourceForms[id] ?? EMPTY_RESOURCE_FORM
          const isContainer = id === 'container'

          return (
            <div
              key={id}
              className={`rounded-2xl border ${color} overflow-hidden transition-all`}
            >
              {/* Card header */}
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">Resource</p>
                  <p className="font-body text-[14px] font-medium text-forest-900">{label}</p>
                </div>
                {installed ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-100 border border-sage-300 font-body text-[11px] text-forest-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                    Installed ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleExpand(id)}
                    className={[
                      'px-3 py-1.5 rounded-lg font-body text-[12px] font-medium transition-colors',
                      expanded
                        ? 'bg-cream-100 text-cream-600'
                        : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
                    ].join(' ')}
                  >
                    {expanded ? 'Collapse' : 'Install Now'}
                  </button>
                )}
              </div>

              {/* Installed summary */}
              {installed && (
                <div className="px-4 pb-3">
                  <p className="font-body text-[12px] text-forest-600">"{form.name || label}"</p>
                  <p className="font-body text-[11px] text-cream-400 mt-0.5">
                    Strength {form.strength}/10 · {form.blsModality} BLS
                  </p>
                  <p className="font-body text-[10px] text-forest-500 mt-1">
                    Now appearing in portal Ground &amp; Regulate tools
                  </p>
                </div>
              )}

              {/* Installation form */}
              {expanded && !installed && (
                <div className="px-4 pb-4 space-y-4 border-t border-cream-100">
                  <div className="pt-3 space-y-3">
                    <div>
                      <Label>{isContainer ? 'What does their container look like?' : 'What do we call this place?'}</Label>
                      <Input value={form.name} onChange={v => onUpdateForm(id, 'name', v)} placeholder={isContainer ? 'e.g. A large wooden chest...' : 'e.g. Grandmother\'s garden'} />
                    </div>
                    {!isContainer && (
                      <>
                        <div>
                          <Label>What do you see?</Label>
                          <Textarea value={form.visual} onChange={v => onUpdateForm(id, 'visual', v)} placeholder="Visual details..." rows={2} />
                        </div>
                        <div>
                          <Label>What do you hear?</Label>
                          <Textarea value={form.auditory} onChange={v => onUpdateForm(id, 'auditory', v)} placeholder="Sounds..." rows={2} />
                        </div>
                        <div>
                          <Label>Any smells? (optional)</Label>
                          <Input value={form.olfactory} onChange={v => onUpdateForm(id, 'olfactory', v)} placeholder="Scents..." />
                        </div>
                        <div>
                          <Label>What do you feel on your skin?</Label>
                          <Textarea value={form.tactile} onChange={v => onUpdateForm(id, 'tactile', v)} placeholder="Tactile sensations..." rows={2} />
                        </div>
                      </>
                    )}
                    {isContainer && (
                      <div>
                        <Label>Material, appearance, lock</Label>
                        <Textarea value={form.visual} onChange={v => onUpdateForm(id, 'visual', v)} placeholder="Describe the container in detail..." rows={2} />
                      </div>
                    )}
                    <div>
                      <Label>Where do you feel {isContainer ? 'safety' : 'it'} in your body?</Label>
                      <Input value={form.body} onChange={v => onUpdateForm(id, 'body', v)} placeholder="Body location..." />
                    </div>
                  </div>

                  {/* BLS params */}
                  {!isContainer && (
                    <div className="space-y-3 pt-1 border-t border-cream-100">
                      <div>
                        <Label>BLS Modality</Label>
                        <div className="flex flex-wrap gap-2">
                          {['visual', 'auditory', 'tactile', 'butterfly_hug'].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => onUpdateForm(id, 'blsModality', m)}
                              className={[
                                'px-3 py-1.5 rounded-lg border font-body text-[12px] transition-colors',
                                form.blsModality === m
                                  ? 'bg-forest-900 border-forest-900 text-cream-25'
                                  : 'bg-white border-cream-200 text-cream-600 hover:border-forest-300',
                              ].join(' ')}
                            >
                              {m === 'butterfly_hug' ? 'Butterfly Hug' : m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Speed</Label>
                          <div className="flex gap-2">
                            {['gentle', 'standard'].map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => onUpdateForm(id, 'blsSpeed', s)}
                                className={[
                                  'flex-1 py-2 rounded-lg border font-body text-[12px] transition-colors',
                                  form.blsSpeed === s
                                    ? 'bg-forest-900 border-forest-900 text-cream-25'
                                    : 'bg-white border-cream-200 text-cream-600',
                                ].join(' ')}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Sets</Label>
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={form.blsSets}
                              onChange={e => onUpdateForm(id, 'blsSets', Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] text-center focus:outline-none focus:border-sage-400"
                            />
                          </div>
                          <div>
                            <Label>Passes</Label>
                            <input
                              type="number"
                              min={1}
                              max={30}
                              value={form.blsPasses}
                              onChange={e => onUpdateForm(id, 'blsPasses', Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] text-center focus:outline-none focus:border-sage-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label>How did installation go?</Label>
                      <Textarea value={form.response} onChange={v => onUpdateForm(id, 'response', v)} placeholder="Clinician notes on patient response..." rows={2} />
                    </div>
                    <Slider value={form.strength} min={1} max={10} onChange={v => onUpdateForm(id, 'strength', v)} label="Strength rating" />
                  </div>

                  <button
                    type="button"
                    onClick={() => onInstall(id)}
                    className="w-full py-3 rounded-xl bg-forest-700 text-cream-25 font-body text-sm font-medium hover:bg-forest-800 transition-colors"
                  >
                    Install to Patient Portal →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="font-body text-[12px] text-cream-400 text-center pt-2">
        Not sure where to start? Safe Place first, always. Then Container. The others when ready.
      </p>
    </div>
  )
}

function Step4({
  pastMemories, presentTriggers, futureTemplates,
  onAddPast, onAddPresent, onAddFuture,
}: {
  pastMemories: PastMemory[]
  presentTriggers: PresentTrigger[]
  futureTemplates: FutureTemplate[]
  onAddPast: (m: PastMemory) => void
  onAddPresent: (t: PresentTrigger) => void
  onAddFuture: (f: FutureTemplate) => void
}) {
  const [activeForm, setActiveForm] = useState<'past' | 'present' | 'future' | null>(null)

  // Past form
  const [pm, setPm] = useState<Partial<PastMemory>>({ suds: 5, voc: 3, status: 'queued' })
  // Present form
  const [pt, setPt] = useState<Partial<PresentTrigger>>({ suds: 5, frequency: 'weekly' })
  // Future form
  const [ft, setFt] = useState<Partial<FutureTemplate>>({ confidence: 5 })

  function submitPast() {
    if (!pm.label) return
    onAddPast({ id: Date.now().toString(), label: pm.label ?? '', age: pm.age ?? '', suds: pm.suds ?? 5, nc: pm.nc ?? '', pc: pm.pc ?? '', voc: pm.voc ?? 3, body: pm.body ?? '', status: pm.status ?? 'queued' })
    setPm({ suds: 5, voc: 3, status: 'queued' })
    setActiveForm(null)
  }

  function submitPresent() {
    if (!pt.description) return
    onAddPresent({ id: Date.now().toString(), description: pt.description ?? '', context: pt.context ?? '', suds: pt.suds ?? 5, frequency: pt.frequency ?? 'weekly', avoidance: pt.avoidance ?? '', linkedMemory: pt.linkedMemory ?? '' })
    setPt({ suds: 5, frequency: 'weekly' })
    setActiveForm(null)
  }

  function submitFuture() {
    if (!ft.scenario) return
    onAddFuture({ id: Date.now().toString(), scenario: ft.scenario ?? '', pc: ft.pc ?? '', confidence: ft.confidence ?? 5 })
    setFt({ confidence: 5 })
    setActiveForm(null)
  }

  const columns: { key: 'past' | 'present' | 'future'; label: string; color: string }[] = [
    { key: 'past',    label: 'Past',    color: 'border-amber-200 bg-amber-50/50' },
    { key: 'present', label: 'Present', color: 'border-cream-200 bg-cream-25' },
    { key: 'future',  label: 'Future',  color: 'border-sage-200 bg-sage-50/50' },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {columns.map(({ key, label, color }) => (
          <div key={key} className={`rounded-2xl border ${color} p-4 space-y-3 min-h-[200px]`}>
            <div className="flex items-center justify-between">
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-cream-400">{label}</p>
              {activeForm !== key && (
                <button
                  type="button"
                  onClick={() => setActiveForm(key)}
                  className="text-[11px] font-body text-forest-600 hover:text-forest-900 transition-colors"
                >
                  + Add
                </button>
              )}
            </div>

            {/* Existing items */}
            {key === 'past' && pastMemories.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-amber-200 px-3 py-2.5 space-y-1">
                <p className="font-body text-[12px] font-medium text-forest-900 leading-snug">{m.label}</p>
                <div className="flex gap-3 text-[10px] font-body text-cream-400">
                  <span>SUDS {m.suds}</span>
                  {m.age && <span>Age {m.age}</span>}
                  <span className="capitalize">{m.status}</span>
                </div>
                {m.nc && <p className="font-body text-[10px] text-amber-600 italic">"{m.nc}"</p>}
              </div>
            ))}
            {key === 'present' && presentTriggers.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-cream-200 px-3 py-2.5">
                <p className="font-body text-[12px] font-medium text-forest-900 leading-snug">{t.description}</p>
                <p className="font-body text-[10px] text-cream-400 mt-1">SUDS {t.suds} · {t.frequency}</p>
              </div>
            ))}
            {key === 'future' && futureTemplates.map(f => (
              <div key={f.id} className="bg-white rounded-xl border border-sage-200 px-3 py-2.5">
                <p className="font-body text-[12px] font-medium text-forest-900 leading-snug">{f.scenario}</p>
                <p className="font-body text-[10px] text-cream-400 mt-1">Confidence {f.confidence}/10</p>
              </div>
            ))}

            {/* Inline forms */}
            {activeForm === key && (
              <div className="space-y-3 pt-1 border-t border-cream-100">
                {key === 'past' && (
                  <>
                    <div>
                      <Label>Memory description</Label>
                      <Input value={pm.label ?? ''} onChange={v => setPm(p => ({ ...p, label: v }))} placeholder="Brief clinical shorthand" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Approx. age</Label>
                        <Input value={pm.age ?? ''} onChange={v => setPm(p => ({ ...p, age: v }))} placeholder="e.g. 8" />
                      </div>
                      <div>
                        <Label>SUDS baseline</Label>
                        <input type="number" min={0} max={10} value={pm.suds ?? 5} onChange={e => setPm(p => ({ ...p, suds: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] text-center focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <Label>Negative cognition</Label>
                      <Input value={pm.nc ?? ''} onChange={v => setPm(p => ({ ...p, nc: v }))} placeholder="e.g. I am not safe" />
                      <p className="mt-1 font-body text-[10px] text-cream-300">e.g. I am not safe · I am not good enough · I am powerless</p>
                    </div>
                    <div>
                      <Label>Positive cognition</Label>
                      <Input value={pm.pc ?? ''} onChange={v => setPm(p => ({ ...p, pc: v }))} placeholder="e.g. I am safe now" />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={submitPast} className="flex-1 py-2 rounded-lg bg-forest-900 text-cream-25 font-body text-[12px] font-medium hover:bg-forest-800 transition-colors">Add to Network</button>
                      <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-2 rounded-lg border border-cream-200 font-body text-[12px] text-cream-500 hover:bg-cream-50 transition-colors">Cancel</button>
                    </div>
                  </>
                )}
                {key === 'present' && (
                  <>
                    <div>
                      <Label>Trigger description</Label>
                      <Input value={pt.description ?? ''} onChange={v => setPt(p => ({ ...p, description: v }))} placeholder="What triggers them?" />
                    </div>
                    <div>
                      <Label>Context</Label>
                      <Input value={pt.context ?? ''} onChange={v => setPt(p => ({ ...p, context: v }))} placeholder="When / where does it appear?" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>SUDS</Label>
                        <input type="number" min={0} max={10} value={pt.suds ?? 5} onChange={e => setPt(p => ({ ...p, suds: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] text-center focus:outline-none" />
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <select value={pt.frequency ?? 'weekly'} onChange={e => setPt(p => ({ ...p, frequency: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-white font-body text-[13px] focus:outline-none">
                          {['Daily', 'Weekly', 'Occasional'].map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Avoidance behavior</Label>
                      <Input value={pt.avoidance ?? ''} onChange={v => setPt(p => ({ ...p, avoidance: v }))} placeholder="What do they avoid? (optional)" />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={submitPresent} className="flex-1 py-2 rounded-lg bg-forest-900 text-cream-25 font-body text-[12px] font-medium hover:bg-forest-800 transition-colors">Add Trigger</button>
                      <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-2 rounded-lg border border-cream-200 font-body text-[12px] text-cream-500 hover:bg-cream-50 transition-colors">Cancel</button>
                    </div>
                  </>
                )}
                {key === 'future' && (
                  <>
                    <div>
                      <Label>Scenario</Label>
                      <Textarea value={ft.scenario ?? ''} onChange={v => setFt(p => ({ ...p, scenario: v }))} placeholder="What does adaptive functioning look like?" rows={2} />
                    </div>
                    <div>
                      <Label>Positive cognition to install</Label>
                      <Input value={ft.pc ?? ''} onChange={v => setFt(p => ({ ...p, pc: v }))} placeholder="e.g. I can drive safely" />
                    </div>
                    <Slider value={ft.confidence ?? 5} min={1} max={10} onChange={v => setFt(p => ({ ...p, confidence: v }))} label="Current confidence" />
                    <div className="flex gap-2">
                      <button type="button" onClick={submitFuture} className="flex-1 py-2 rounded-lg bg-forest-900 text-cream-25 font-body text-[12px] font-medium hover:bg-forest-800 transition-colors">Add Template</button>
                      <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-2 rounded-lg border border-cream-200 font-body text-[12px] text-cream-500 hover:bg-cream-50 transition-colors">Cancel</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Step5({
  patientName, dissociationRisk,
  prescribedTools, onToggleTool,
  firstMessage, onMessageChange,
  portalActive, onTogglePortal,
}: {
  patientName: string
  dissociationRisk: DissociationRisk
  prescribedTools: string[]
  onToggleTool: (id: string) => void
  firstMessage: string
  onMessageChange: (v: string) => void
  portalActive: boolean
  onTogglePortal: () => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <Label>Between-session tools</Label>
        <div className="space-y-2">
          {ALL_TOOLS.map(tool => {
            const gated = tool.highRiskGate && dissociationRisk === 'high'
            const checked = prescribedTools.includes(tool.id)
            return (
              <label
                key={tool.id}
                className={['flex items-center gap-3 cursor-pointer group', gated ? 'opacity-40 cursor-not-allowed' : ''].join(' ')}
                title={gated ? 'Unlock after Phase 2 readiness' : undefined}
              >
                <input
                  type="checkbox"
                  checked={checked && !gated}
                  disabled={gated}
                  onChange={() => !gated && onToggleTool(tool.id)}
                  className="w-4 h-4 accent-forest-900 rounded"
                />
                <span className="font-body text-[13px] text-cream-700 group-hover:text-forest-900 transition-colors">
                  {tool.label}
                  {tool.requiresInstall && <span className="ml-1.5 text-[10px] text-cream-400">(unlocks when installed)</span>}
                  {gated && <span className="ml-1.5 text-[10px] text-amber-500">Unlock after Phase 2 readiness</span>}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <Label>First message to {patientName || 'patient'}</Label>
        <Textarea
          value={firstMessage}
          onChange={onMessageChange}
          placeholder="Write something personal. This is the first thing they'll read when they open the app. It should sound like you, not a form letter."
          rows={5}
        />
        <p className="mt-1 font-body text-[11px] text-cream-400">
          {firstMessage.length} characters · suggested 100–300
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-cream-200 bg-cream-25">
          <div>
            <p className="font-body text-[13px] font-medium text-forest-900">Activate patient portal now</p>
            {portalActive && (
              <p className="font-body text-[12px] text-forest-600 mt-0.5">
                {patientName || 'Patient'} will receive an invitation to create their account.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onTogglePortal}
            className={[
              'relative w-11 h-[22px] rounded-full transition-colors shrink-0',
              portalActive ? 'bg-forest-900' : 'bg-cream-200',
            ].join(' ')}
          >
            <span className={[
              'absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
              portalActive ? 'translate-x-[26px]' : 'translate-x-[3px]',
            ].join(' ')} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main wizard page ─────────────────────────────────────────────────────────

export default function NewPatientPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  // Step 1 state
  const [profile, setProfile] = useState({
    name: '', age: '', pronouns: '', concern: '',
    modality: 'standard' as Modality,
    dissociationRisk: 'low' as DissociationRisk,
  })

  function updateProfile(k: string, v: string) {
    setProfile(p => ({ ...p, [k]: v }))
  }

  // Step 2 state
  const [safety, setSafety] = useState({
    clinicianContact: '',
    supportContacts: [] as SupportContact[],
    copingStrategies: [...DEFAULT_COPING],
    warningSignals: DEFAULT_WARNING_SIGNALS.slice(0, 4),
  })

  function updateSafety(k: string, v: unknown) {
    setSafety(s => ({ ...s, [k]: v }))
  }

  // Step 3 state
  const [installedResources, setInstalledResources] = useState<Set<string>>(new Set())
  const [resourceForms, setResourceForms] = useState<Record<string, ResourceForm>>({})
  const [expandedResource, setExpandedResource] = useState<string | null>(null)

  function handleToggleExpand(id: string) {
    setExpandedResource(prev => prev === id ? null : id)
    if (!resourceForms[id]) {
      setResourceForms(f => ({ ...f, [id]: { ...EMPTY_RESOURCE_FORM } }))
    }
  }

  function handleInstall(id: string) {
    setInstalledResources(s => new Set([...s, id]))
    setExpandedResource(null)
  }

  function handleUpdateForm(id: string, k: keyof ResourceForm, v: string | number) {
    setResourceForms(f => ({ ...f, [id]: { ...(f[id] ?? EMPTY_RESOURCE_FORM), [k]: v } }))
  }

  // Step 4 state
  const [pastMemories, setPastMemories] = useState<PastMemory[]>([])
  const [presentTriggers, setPresentTriggers] = useState<PresentTrigger[]>([])
  const [futureTemplates, setFutureTemplates] = useState<FutureTemplate[]>([])

  // Step 5 state
  const [prescribedTools, setPrescribedTools] = useState<string[]>(
    ALL_TOOLS.filter(t => t.default).map(t => t.id)
  )
  const [firstMessage, setFirstMessage] = useState('')
  const [portalActive, setPortalActive] = useState(false)

  function toggleTool(id: string) {
    setPrescribedTools(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  function canAdvance(): boolean {
    if (step === 1) return profile.name.trim().length > 0
    return true
  }

  const stepTitles = [
    'Patient Profile',
    'Safety Plan',
    'Resource Installation',
    'Treatment Planning',
    'Patient Portal Setup',
  ]
  const stepSubtitles = [
    'Basic information to get started. You can add more detail after the first session.',
    'Build this with the patient in your first session. It appears in their app immediately.',
    'Work through these with the patient in Phase 2. Install each one in session — it appears in their app immediately.',
    'Capture what you know so far. This will grow across treatment — you don\'t need everything today.',
    'Prescribe their between-session tools and write their first message.',
  ]

  if (done) {
    const patientName = profile.name || 'New patient'
    const firstName = patientName.split(' ')[0]
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--surface-base)' }}>
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="w-16 h-16 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D7A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-[36px] font-light text-forest-900">{patientName}&rsquo;s profile is ready.</h1>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-cream-200 bg-white px-4 py-4">
              <p className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 mb-1">Portal Status</p>
              <p className="font-body text-[13px] font-medium text-forest-900">
                {portalActive ? 'Active — invitation sent' : 'Inactive — activate when ready'}
              </p>
            </div>
            <div className="rounded-2xl border border-cream-200 bg-white px-4 py-4">
              <p className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 mb-1">Resources</p>
              <p className="font-display text-2xl font-light text-forest-900">{installedResources.size}</p>
              <p className="font-body text-[11px] text-cream-400">of 6 installed</p>
            </div>
            <div className="rounded-2xl border border-cream-200 bg-white px-4 py-4">
              <p className="font-body text-[10px] uppercase tracking-[0.1em] text-cream-400 mb-1">Treatment Plan</p>
              <p className="font-body text-[12px] text-forest-900 leading-relaxed">
                {pastMemories.length} memories<br />
                {presentTriggers.length} triggers<br />
                {futureTemplates.length} templates
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/clinician')}
              className="w-full py-3.5 rounded-xl bg-forest-900 text-cream-25 font-body text-sm font-medium hover:bg-forest-800 transition-colors"
            >
              Open {firstName}&rsquo;s Dashboard →
            </button>
            <button
              onClick={() => router.push('/clinician/session/sarah-chen')}
              className="w-full py-3.5 rounded-xl border border-forest-300 text-forest-800 font-body text-sm font-medium hover:bg-sage-50 transition-colors"
            >
              Start Session Mode →
            </button>
          </div>

          <p className="font-body text-[11px] text-cream-400 leading-relaxed">
            In the full product, {firstName} receives an email invitation to create their account.
            Their portal activates immediately with the tools you've prescribed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-base)' }}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-cream-100">
        <div
          className="h-full bg-forest-900 transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="max-w-[680px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-body text-sm font-medium text-forest-900">New Patient</p>
          <p className="font-body text-[12px] text-cream-400">Step {step} of {TOTAL_STEPS}</p>
        </div>

        {/* Step title */}
        <div className="mb-8">
          <h1 className="font-display text-[32px] font-light text-forest-900">{stepTitles[step - 1]}</h1>
          <p className="font-body text-[14px] text-cream-500 mt-1.5 leading-relaxed">{stepSubtitles[step - 1]}</p>
        </div>

        {/* Step content */}
        {step === 1 && <Step1 data={profile} onChange={updateProfile} />}
        {step === 2 && <Step2 data={safety} onChange={updateSafety} />}
        {step === 3 && (
          <Step3
            installedResources={installedResources}
            resourceForms={resourceForms}
            expandedResource={expandedResource}
            onToggleExpand={handleToggleExpand}
            onInstall={handleInstall}
            onUpdateForm={handleUpdateForm}
          />
        )}
        {step === 4 && (
          <Step4
            pastMemories={pastMemories}
            presentTriggers={presentTriggers}
            futureTemplates={futureTemplates}
            onAddPast={m => setPastMemories(p => [...p, m])}
            onAddPresent={t => setPresentTriggers(p => [...p, t])}
            onAddFuture={f => setFutureTemplates(p => [...p, f])}
          />
        )}
        {step === 5 && (
          <Step5
            patientName={profile.name}
            dissociationRisk={profile.dissociationRisk}
            prescribedTools={prescribedTools}
            onToggleTool={toggleTool}
            firstMessage={firstMessage}
            onMessageChange={setFirstMessage}
            portalActive={portalActive}
            onTogglePortal={() => setPortalActive(v => !v)}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-cream-100">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/clinician')}
            className="px-5 py-2.5 rounded-xl border border-cream-200 font-body text-sm text-cream-600 hover:bg-cream-50 hover:text-forest-800 transition-colors"
          >
            {step === 1 ? '← Back to Dashboard' : '← Back'}
          </button>

          <button
            type="button"
            disabled={!canAdvance()}
            onClick={() => {
              if (step < TOTAL_STEPS) setStep(s => s + 1)
              else setDone(true)
            }}
            className={[
              'px-6 py-2.5 rounded-xl font-body text-sm font-medium transition-colors',
              canAdvance()
                ? 'bg-forest-900 text-cream-25 hover:bg-forest-800'
                : 'bg-cream-100 text-cream-300 cursor-not-allowed',
            ].join(' ')}
          >
            {step < TOTAL_STEPS ? 'Continue →' : 'Complete Setup →'}
          </button>
        </div>
      </div>
    </div>
  )
}
