const { extractCvData } = require('../services/cvParser')
const { scoreCvAgainstOffer } = require('../services/compatibilityScorer')
const { generateInterviewPlan } = require('../services/interviewGenerator')

async function extractCvText(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Expected field "cv" of type PDF.' })
    }

    const data = new Uint8Array(req.file.buffer)
    // Dynamically import the ESM build of pdfjs (installed as pdfjs-dist). In Node we
    // load the ESM module at runtime and use its exports. This avoids requiring a
    // non-existent CJS worker file.
    const pdfjsModule = await import('pdfjs-dist/build/pdf.mjs')
    const pdfjsLib = pdfjsModule.default || pdfjsModule
    const loadingTask = pdfjsLib.getDocument({ data })
    const pdf = await loadingTask.promise

    let fullText = ''
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item) => item.str).join(' ')
      fullText += `\n--- Page ${pageNum} ---\n` + pageText + '\n'
    }

    // eslint-disable-next-line no-console
    console.log(`\n--- Extracted Text from ${req.file.originalname} ---\n` + fullText + '\n')

    let parsed = null
    try {
      parsed = await extractCvData(fullText)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Gemini parsing failed:', e.message || e)
    }

    return res.json({
      file: {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      preview: fullText.slice(0, 1000),
      parsed,
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = { extractCvText }

async function scoreCompatibility(req, res, next) {
  try {
    const { cv, offer } = req.body || {}
    if (!cv || !offer) {
      return res.status(400).json({ error: 'Missing payload. Expect JSON body with { cv, offer }.' })
    }
    const result = await scoreCvAgainstOffer(cv, offer)
    if (!result) {
      return res.status(502).json({ error: 'Model returned no parsable result' })
    }
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

module.exports.scoreCompatibility = scoreCompatibility

async function generateInterview(req, res, next) {
  try {
    const { cv, offer } = req.body || {}
    if (!cv || !offer) {
      return res.status(400).json({ error: 'Missing payload. Expect { cv, offer }.' })
    }
    const plan = await generateInterviewPlan(cv, offer)
    if (!plan || !Array.isArray(plan.questions)) {
      return res.status(502).json({ error: 'Model returned no valid interview plan' })
    }
    // Hard-validate 10 questions and 10 minutes total if possible
    const total = (plan.questions || []).reduce((acc, q) => acc + (Number(q.time_minutes) || 0), 0)
    return res.json({
      total_minutes: plan.total_minutes || 10,
      questions: plan.questions,
      total_computed: Math.round(total * 100) / 100,
      notes: plan.notes || '',
    })
  } catch (err) {
    return next(err)
  }
}

module.exports.generateInterview = generateInterview


