const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.CV_KEY || 'AIzaSyAvK-ESZGUwvqbgKWAuHz2eHYGIY9U5VMw'
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function normalize(input) {
  if (input == null) return ''
  if (typeof input === 'string') return input
  try { return JSON.stringify(input) } catch (_e) { return String(input) }
}

async function generateInterviewPlan(cv, offer) {
     console.log("hereee")
  const cvText = normalize(cv)
  const offerText = normalize(offer)
  const instruction = `now from the following cv and job offer i want you to generate for me questions and time dedicated for each question depending on the complexity of hte question the total questions will be 10 and will have 20 minutes, \n\n i want questions to be diverse from pure technical ones especially about the prioritized technologies and if they were used in some projects ask about them\n\n ask about the company maybe ask soft skills questions like situations etc overall hr  questions`

  const schema = `Return STRICT JSON only (no markdown) with this exact shape:\n{\n  "total_minutes": 20,\n  "questions": [\n    {\n      "type": "technical" | "project" | "company" | "soft_skill" | "hr",\n      "question": string,\n      "time_minutes": number // 1.0 to 3.0 per question. Sum of all = 20\n    }\n  ],\n  "notes": string // optional brief rationale\n}`

  const prompt = `${instruction}\n\n${schema}\n\nRules:\n- Exactly 10 questions.\n- Total time exactly 20 minutes (sum to 20).\n- Prioritize offer.priority skills (e.g., skills marked Importante), map to CV projects when possible.\n- Mix: technical (focused on prioritized technologies), project deep-dive (from CV), company awareness, behavioral/soft skills, HR.\n- Keep questions concise and practical.\n- JSON only. No prose.\n\nCV:\n${cvText}\n\nOFFER:\n${offerText}`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: prompt }] },
      ],
    }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Gemini interview generation failed: ${response.status} ${body?.slice(0, 300)}`)
  }
  const data = await response.json()
  const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  console.log(textOut)
  try {
    return JSON.parse(textOut)
  } catch (_e) {
    const s = textOut.indexOf('{')
    const e = textOut.lastIndexOf('}')
    if (s >= 0 && e > s) {
      try { return JSON.parse(textOut.slice(s, e + 1)) } catch (_e2) {}
    }
    return null
  }
}

module.exports = { generateInterviewPlan }


