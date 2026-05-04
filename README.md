# Phasepoint

**Precision care at every phase.**

The clinical operating system for EMDR therapy. Built for clinicians. Designed for patients. Grounded in 35 years of EMDR research.

## What This Is

Phasepoint is a clinician-directed EMDR operating system — not a wellness app, not a meditation tool. Clinical infrastructure that digitizes the complete EMDR treatment framework and extends the clinician's presence into the 167 hours between sessions.

## Demo Navigation

- **/** — Landing page and product story
- **/demo** — Patient portal (6 fictional patients)
- **/clinician** — Clinician operating system
- **/calculator** — RTM billing calculator
- **/research** — Research case and data thesis

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/markcoons-bot/phasepoint.git
cd phasepoint

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# 4. Run development server
npm run dev
```

## Deployment

Connect to Vercel. Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard. Deploy.

The journal AI reflection will be live once the API key is added. Everything else works without it.

## Demo Patients

All patient data is fictional, built around the clinical profiles of common EMDR presentations:

| Patient | Diagnosis | Phase | Notes |
|---------|-----------|-------|-------|
| Sarah Chen | PTSD — MVA | Phase 4 | Active processing, SUDS 9→3 |
| James Okafor | Performance anxiety | Phase 3 | Assessment, target identified |
| Elena Vasquez | Complex PTSD | Phase 2 | Dissociation-gated, BLS held |
| Michael Torres | Complicated grief | Phase 2 | Anniversary week |
| Aisha Johnson | Attachment trauma | Phase 2 | Strong resource team building |
| Tyler Park | Social anxiety (adolescent) | Phase 2 | Courage ladder active |

## Clinical Foundation

Built on peer-reviewed EMDR research, EMDRIA clinical guidelines, and the AIP model. All clinical architecture reviewed against published protocols.

Not medical advice. Not a substitute for clinical care.

---

*Clinical Demo — Built to start a conversation.*
