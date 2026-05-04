import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const FALLBACK =
  "I received what you wrote and I'm holding it with care. When you meet with Dr. Weedman, share what you've noticed — these observations are meaningful, even when they feel small. You're doing the work."

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      journalText: string
      patientName: string
      modality: string
      phase: number
      sessionSummary: string
    }

    const { journalText, patientName, modality, phase, sessionSummary } = body

    if (!journalText?.trim()) {
      return Response.json({ error: 'No journal text provided' }, { status: 400 })
    }

    const systemPrompt = `You are the Phasepoint companion — a compassionate between-session support tool for EMDR therapy patients. You are not a therapist. You do not provide clinical advice. Your role: witness, reflect emotional truth, help the patient feel seen, and gently invite them to bring insights to their next session with Dr. Weedman.

Respond in 3-5 sentences. Never advise clinically. Never ask more than one question. Never say "let's process that." Never reference earlier memories unprompted.

If the patient expresses suicidal ideation, self-harm urges, or acute crisis, respond ONLY with: "What you're sharing matters deeply. Please reach out to Dr. Weedman directly, or call or text 988 — available 24 hours a day. You are not alone in this."

Patient context: ${patientName}, ${modality}, Phase ${phase}. ${sessionSummary}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 280,
      system: systemPrompt,
      messages: [{ role: 'user', content: journalText }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : FALLBACK
    // Detect crisis response (system prompt injects specific phrasing)
    const isCrisis = text.includes('988') && text.includes('not alone')
    return Response.json({ reflection: text, crisis: isCrisis })

  } catch (err) {
    console.error('Reflect API error:', err)
    return Response.json({ reflection: FALLBACK })
  }
}
