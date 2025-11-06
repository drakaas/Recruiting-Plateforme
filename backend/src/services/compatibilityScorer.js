const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.CV_KEY || 'AIzaSyAvK-ESZGUwvqbgKWAuHz2eHYGIY9U5VMw'
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function normalizeText(input) {
  if (input == null) return ''
  if (typeof input === 'string') return input
  try {
    return JSON.stringify(input)
  } catch (_e) {
    return String(input)
  }
}

async function scoreWithGemini(cvPlain, offerPlain) {
  const systemInstruction = `i will give you a cv informations and a job offer and i want you to give a scoree of compatibility between the 2 of them for skills othe offer they"ll be eliminatory if important they need to be in the cv and analyse the experiences and see if the candidate will do good and return a percentage this score should never be over 95`

  const prompt = `Instructions:\n${systemInstruction}\n\nOutput strictly JSON only with this schema and nothing else (no markdown):\n{\n  "score_percent": number, // 0-100 integer\n  "missing_important_skills": string[],\n  "matched_skills": string[],\n  "experience_summary": string\n}\n\nRules:\n- Treat skills in the offer marked as important/mandatory/required as eliminatory: if missing, cap score at <= 40 and list them in missing_important_skills.\n- Evaluate experience recency, duration, and relevance to the offer.\n- Be strict but fair; avoid hallucinating skills not present in the CV.\n- Return valid JSON only.\n\nCV:\n${cvPlain}\n\nOFFER:\n${offerPlain}`
     console.log(cvPlain, offerPlain);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Gemini scoring failed: ${response.status} ${body?.slice(0, 300)}`)
  }
  const data = await response.json()
  console.log("HAHAHAHAHA"+data);
  const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return textOut
}

async function scoreCvAgainstOffer(cv, offer) {
  const cvPlain = normalizeText(cv)
  const offerPlain = normalizeText(offer)
  const raw = await scoreWithGemini(cvPlain, offerPlain)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    // Coerce to safe shape
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score_percent) || 0)))
    return {
      score_percent: score,
      missing_important_skills: Array.isArray(parsed.missing_important_skills) ? parsed.missing_important_skills : [],
      matched_skills: Array.isArray(parsed.matched_skills) ? parsed.matched_skills : [],
      experience_summary: typeof parsed.experience_summary === 'string' ? parsed.experience_summary : '',
      _model_raw: parsed,
    }
  } catch (_e) {
    // Try bracket recovery
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        const fixed = JSON.parse(raw.slice(start, end + 1))
        const score = Math.max(0, Math.min(100, Math.round(Number(fixed.score_percent) || 0)))
        return {
          score_percent: score,
          missing_important_skills: Array.isArray(fixed.missing_important_skills) ? fixed.missing_important_skills : [],
          matched_skills: Array.isArray(fixed.matched_skills) ? fixed.matched_skills : [],
          experience_summary: typeof fixed.experience_summary === 'string' ? fixed.experience_summary : '',
          _model_raw: fixed,
        }
      } catch (_e2) {}
    }
    return null
  }
}

module.exports = { scoreCvAgainstOffer }




