import { Patient, ThreeProngEntry, Resource } from '@/data/types'

interface Props {
  patient: Patient
}

// ─── Three-prong board ────────────────────────────────────────────────────────

const PRONG_META = {
  past:    { label: 'Past',    color: 'border-amber-400/40', bg: 'bg-amber-100/50',   dot: 'bg-amber-600',    heading: 'Trauma Targets' },
  present: { label: 'Present', color: 'border-forest-600/25', bg: 'bg-forest-900/4',  dot: 'bg-forest-600',   heading: 'Present Triggers' },
  future:  { label: 'Future',  color: 'border-sage-300',     bg: 'bg-sage-50',        dot: 'bg-forest-500',   heading: 'Future Templates' },
}

const STATUS_COLORS: Record<ThreeProngEntry['status'], string> = {
  active:   '#5FA882',
  queued:   '#9A9A90',
  complete: '#2D7A4F',
  deferred: '#C8C8BC',
  blocked:  '#C8922E',
}

function ThreeProngColumn({
  prong,
  entries,
}: {
  prong: 'past' | 'present' | 'future'
  entries: ThreeProngEntry[]
}) {
  const meta = PRONG_META[prong]
  return (
    <div className={`rounded-2xl border ${meta.color} ${meta.bg} p-4 space-y-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-500">{meta.label}</p>
        <span className="ml-auto text-[10px] font-body text-cream-400">{entries.length}</span>
      </div>

      {entries.length === 0 ? (
        <p className="font-body text-[12px] text-cream-400 italic py-2">No entries yet</p>
      ) : (
        entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-xl border border-cream-100 px-3 py-3 space-y-1.5 shadow-[0_1px_3px_rgba(26,26,24,0.04)]">
            <p className="font-body text-[13px] font-medium text-forest-900 leading-snug">{entry.label}</p>
            <p className="font-body text-[12px] text-cream-600 leading-relaxed">{entry.description}</p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {entry.suds != null && (
                <span className="text-[11px] font-body text-amber-600">SUDS {entry.suds}</span>
              )}
              {entry.voc != null && (
                <span className="text-[11px] font-body text-forest-600">VOC {entry.voc}</span>
              )}
              {entry.frequency && (
                <span className="text-[10px] font-body text-cream-400">{entry.frequency}</span>
              )}
            </div>

            {entry.avoidanceBehavior && (
              <p className="font-body text-[11px] text-cream-500 italic">{entry.avoidanceBehavior}</p>
            )}

            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[entry.status] }}
              />
              <span
                className="text-[10px] font-body capitalize"
                style={{ color: STATUS_COLORS[entry.status] }}
              >
                {entry.status.replace('_', ' ')}
              </span>
              {entry.sessionTargeted && entry.sessionTargeted.length > 0 && (
                <>
                  <span className="text-cream-300">·</span>
                  <span className="text-[10px] font-body text-cream-400">
                    Sessions {entry.sessionTargeted.join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ─── Resource card ────────────────────────────────────────────────────────────

const RESOURCE_TYPE_LABELS: Record<Resource['type'], string> = {
  safe_place:        'Safe Place',
  calm_place:        'Calm Place',
  nurturing_figure:  'Nurturing Figure',
  protective_figure: 'Protective Figure',
  animal:            'Animal',
  adult_self:        'Adult Self',
  wisdom_figure:     'Wisdom Figure',
  spiritual:         'Spiritual',
  community:         'Community',
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-white rounded-xl border border-cream-100 px-4 py-3.5 shadow-[0_1px_3px_rgba(26,26,24,0.04)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-body text-[13px] font-medium text-forest-900 leading-snug">{resource.name}</p>
          <p className="text-[10px] font-body uppercase tracking-wide text-cream-400 mt-0.5">
            {RESOURCE_TYPE_LABELS[resource.type]}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {resource.strengthRating != null && (
            <span className="text-[10px] font-body text-forest-600 font-medium">
              Strength {resource.strengthRating}/10
            </span>
          )}
          {resource.blsAssigned && (
            <span className="text-[9px] font-body uppercase tracking-wide px-1.5 py-0.5 rounded bg-forest-900/8 text-forest-700">
              BLS ✓
            </span>
          )}
        </div>
      </div>

      <p className="font-body text-[12px] text-cream-600 leading-relaxed mb-2">{resource.description}</p>

      <p className="font-body text-[11px] text-cream-500 italic leading-snug">
        Sensory: {resource.sensoryCues}
      </p>
      <p className="font-body text-[11px] text-forest-600 italic mt-1 leading-snug">
        Body: {resource.bodyAnchor}
      </p>

      {resource.blsAssigned && resource.blsParameters && (
        <div className="mt-2 pt-2 border-t border-cream-100 flex flex-wrap gap-2">
          {[
            resource.blsParameters.modality,
            resource.blsParameters.mode,
            resource.blsParameters.speed,
            `${resource.blsParameters.sets} sets × ${resource.blsParameters.passesPerSet}`,
          ].map((val, i) => (
            <span key={i} className="text-[10px] font-body px-1.5 py-0.5 rounded bg-sage-100 text-forest-700 capitalize">
              {val}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TreatmentPlanTab({ patient }: Props) {
  const pastEntries    = patient.threeProngs.filter(e => e.prong === 'past')
  const presentEntries = patient.threeProngs.filter(e => e.prong === 'present')
  const futureEntries  = patient.threeProngs.filter(e => e.prong === 'future')

  return (
    <div className="p-6 space-y-8">

      {/* Three-Prong Protocol Board */}
      <div>
        <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400 mb-4">
          Three-Prong Protocol Board
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ThreeProngColumn prong="past"    entries={pastEntries}    />
          <ThreeProngColumn prong="present" entries={presentEntries} />
          <ThreeProngColumn prong="future"  entries={futureEntries}  />
        </div>
      </div>

      {/* Resources */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[11px] font-body uppercase tracking-[0.12em] text-cream-400">
            Resource Team
          </p>
          <span className="font-body text-[11px] text-cream-400">
            {patient.resources.filter(r => r.blsAssigned).length} with BLS · {patient.resources.length} total
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {patient.resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}
