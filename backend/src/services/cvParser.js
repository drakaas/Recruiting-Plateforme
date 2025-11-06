const dotenv = require('dotenv')
dotenv.config()

// Use the exact Gemini 2.5 API style and prompt the user provided
const API_KEY = process.env.CV_KEY || 'AIzaSyAvK-ESZGUwvqbgKWAuHz2eHYGIY9U5VMw'
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function analyzeWithGemini(text) {
  try {
    // eslint-disable-next-line no-console
    console.log('[cvParser] Analyzing text (first 120 chars):', (text || '').substring(0, 120) + '...')
    console.log('[cvParser] API URL:', API_URL)
    console.log('[cvParser] API KEY present:', !!API_KEY)
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
              {
                text: `i want every reply of your future replies to be exactly in the folowwing json format:
                        The JSON must follow exactly this schema:
{
  "civilite": "Monsieur" | "Madame" | "Non précisé",
  "nom": "",
  "prenom": "",
  "ville": "",
  "code_postal": "",
  "telephone": "",
  "langues":{"langue":"niveau"},
  "competences":"put all the cmobined skills with no repetition here",

  "liens": {
    "github": "",
    "linkedin": "",
    "autres": ["", ""]
  },
  "projets_professionnels": [
    {
      "nom": "",
      "niveau": "",
      "organisme": "",
      "date": "",
      "description": "",
      "competences": ["", ""]
    }
  ]
  ]
}

Rules:
- If some data is missing, fill it with an empty string or "Non précisé".
- Detect civilité (Monsieur, Madame, or Non précisé) from text.
- Extract only URLs in github/linkedin fields if available.
- Keep other links under "autres".
- "projets_professionnels" and "documents" can each have multiple entries.
- Return valid JSON and nothing else.
- Do NOT include any markdown, explanations, or prose. NO code fences. JSON only.
                ${text}
                        `,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error('[cvParser] API non-OK status:', response.status, body?.slice(0, 300))
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('[cvParser] candidates count:', Array.isArray(data?.candidates) ? data.candidates.length : 0)
    console.log('[cvParser] raw text length:', textOut.length)
    return textOut
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[cvParser] Gemini API error:', error)
    throw new Error(error.message || 'Failed to analyze text with Gemini')
  }
}

async function extractCvData(cvText) {
  const text = await analyzeWithGemini(cvText)
  if (!text) return null
  try {
    const parsed = JSON.parse(text)
    console.log('[cvParser] JSON parsed OK')
    return parsed
  } catch (_e) {
    console.warn('[cvParser] JSON parse failed, attempting to recover from substring')
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      const fixed = text.slice(start, end + 1)
      try {
        const recovered = JSON.parse(fixed)
        console.log('[cvParser] Recovered JSON parse OK')
        return recovered
      } catch (_e2) {}
    }
    console.error('[cvParser] Unable to parse JSON from model output. Output head:', (text || '').slice(0, 200))
    return null
  }
}

module.exports = { extractCvData }





