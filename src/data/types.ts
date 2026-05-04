// ─── Phasepoint Clinical Data Types ─────────────────────────────────────────
// Structured to hold real clinical data when HIPAA infrastructure is added.

export type EMDRPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type PhaseStatus =
  | 'not_started'
  | 'in_progress'
  | 'complete'
  | 'deferred'

export type ProcessingStatus =
  | 'queued'
  | 'active'
  | 'complete'
  | 'deferred'
  | 'blocked'

export type DissociationRisk = 'low' | 'moderate' | 'high' | 'unknown'

export type WindowZone = 'hyper' | 'window' | 'hypo'

export type AlertLevel = 'info' | 'clinical' | 'urgent' | 'crisis'

export interface MemoryNode {
  id: string
  type: 'touchstone' | 'associated' | 'trigger' | 'future_template'
  label: string
  age?: number
  image?: string
  negativeCognition?: string
  positiveCognition?: string
  sudsBaseline?: number
  sudsCurrentt?: number
  voc?: number
  bodyLocation?: string
  emotion?: string
  processingStatus: ProcessingStatus
  phase?: EMDRPhase
  sessionHistory: SessionDataPoint[]
  linkedNodes: string[]
  clinicalNotes?: string
}

export interface SessionDataPoint {
  sessionNumber: number
  date: string
  suds: number
  voc?: number
  notes?: string
}

export interface Resource {
  id: string
  type:
    | 'safe_place'
    | 'calm_place'
    | 'nurturing_figure'
    | 'protective_figure'
    | 'animal'
    | 'adult_self'
    | 'wisdom_figure'
    | 'spiritual'
    | 'community'
  name: string
  description: string
  sensoryCues: string
  bodyAnchor: string
  blsAssigned: boolean
  blsParameters?: BLSParameters
  installationDate: string
  strengthRating?: number
}

export interface BLSParameters {
  modality: 'visual' | 'auditory' | 'tactile' | 'combined'
  mode: 'resourcing' | 'processing'
  speed: 'gentle' | 'standard' | 'active'
  sets: number
  passesPerSet: number
  clinicianAssigned: boolean
}

export interface ThreeProngEntry {
  id: string
  prong: 'past' | 'present' | 'future'
  label: string
  description: string
  suds?: number
  voc?: number
  frequency?: string
  avoidanceBehavior?: string
  status: ProcessingStatus
  linkedMemoryNodeId?: string
  sessionTargeted?: number[]
}

export interface SafetyPlan {
  warningSignals: string[]
  copingStrategies: string[]
  supportContacts: { name: string; phone: string; relationship: string }[]
  crisisResources: { name: string; number: string }[]
  clinicianEmergencyContact: string
  environmentSafety: string[]
}

export interface Patient {
  id: string
  name: string
  initials: string
  age: number
  pronouns?: string

  // Clinical profile
  modality: 'emdr' | 'emdr_complex' | 'emdr_adolescent'
  primaryDiagnosis: string
  currentPhase: EMDRPhase
  phaseStatus: PhaseStatus
  dissociationRisk: DissociationRisk

  // Treatment context
  treatmentStartDate: string
  lastSessionDate: string
  nextSessionDate?: string
  sessionCount: number

  // Core clinical data
  memoryNetwork: MemoryNode[]
  resources: Resource[]
  threeProngs: ThreeProngEntry[]

  // Measurements
  pclScore?: number
  phq9Score?: number
  gad7Score?: number
  desScore?: number

  // Week data
  checkIns: CheckIn[]

  // Safety
  safetyPlan: SafetyPlan

  // Clinician context
  therapistNote: string
  journalPrompt: string
  prescribedTools: string[]

  // Alerts
  alerts: ClinicalAlert[]
}

export interface CheckIn {
  date: string
  day: string
  suds: number
  windowZone: WindowZone
  note?: string
}

export interface ClinicalAlert {
  id: string
  level: AlertLevel
  message: string
  timestamp: string
  acknowledged: boolean
  source: 'journal' | 'checkin' | 'bls' | 'system' | 'crisis'
}

export interface Clinician {
  id: string
  name: string
  credentials: string
  specialty: string
  emdriaCertified: boolean
  patients: Patient[]
  rtmSummary: RTMSummary
}

export interface RTMSummary {
  month: string
  totalPatients: number
  atThreshold: number
  estimatedBilling: number
  annualProjection: number
  perPatient: RTMPatientRecord[]
}

export interface RTMPatientRecord {
  patientId: string
  patientName: string
  reviewMinutes: number
  datadays: number
  billable: boolean
  estimatedRevenue: number
  cptCodes: string[]
}
