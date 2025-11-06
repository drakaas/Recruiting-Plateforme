const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Application = require('../models/Application')
const Offer = require('../models/Offer')
const { scoreCvAgainstOffer } = require('../services/compatibilityScorer')

const router = express.Router()

// store uploads first in tmp, then move to uploads/candidature/<applicationId>
const tmpDir = path.join(process.cwd(), 'uploads', 'tmp')
fs.mkdirSync(tmpDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tmpDir)
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const timestamp = Date.now()
    cb(null, `${timestamp}_${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
    ]
    if (!allowed.includes(file.mimetype)) return cb(new Error('Unsupported file type'))
    cb(null, true)
  },
})

router.post(
  '/',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      const {
        jobId,
        jobTitle,
        company,
        candidateId,
        message,
      } = req.body || {}

      // Validate offer id if provided
      let offerId = null
      if (jobId && /^[a-f\d]{24}$/i.test(String(jobId))) {
        offerId = jobId
      }

      // Reject duplicate application for same candidate/offer
      if (offerId && candidateId) {
        const existing = await Application.findOne({ offer: offerId, candidateId }).select('_id').lean()
        if (existing) return res.status(409).json({ error: 'already_applied' })
      }

      // Create base application (without file paths first) and mark en_attente_interview immediately
      const appDoc = await Application.create({
        offer: offerId || undefined,
        jobTitle: jobTitle || undefined,
        companyName: company || undefined,
        candidateId: candidateId || undefined,
        message: message || undefined,
        status: 'en_attente_interview',
        cv: undefined,
        documents: [],
      })

      const appId = appDoc._id.toString()
      const appDir = path.join(process.cwd(), 'uploads', 'candidature', appId)
      fs.mkdirSync(appDir, { recursive: true })

      const moveToAppDir = (file) => {
        const destPath = path.join(appDir, file.filename)
        fs.renameSync(file.path, destPath)
        return {
          filename: file.originalname,
          path: `/uploads/candidature/${appId}/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype,
        }
      }

      const cvFile = req.files?.cv?.[0]
      const docsFiles = Array.isArray(req.files?.documents) ? req.files.documents : []

      const cvStored = cvFile ? moveToAppDir(cvFile) : undefined
      const docsStored = docsFiles.map(moveToAppDir)

      appDoc.cv = cvStored
      appDoc.documents = docsStored
      await appDoc.save()

      // Optionally, attach full offer (with company populated) in response
      let offerSummary = null
      if (offerId) {
        const offer = await Offer.findById(offerId)
          .populate('company')
          .lean()
        offerSummary = offer || null
      }

      // Respond immediately with en_attente_interview so UI can show it, then process analysis async
      const json = appDoc.toJSON()
      const immediatePayload = { ...json, offer: offerId ? offerSummary : json.offer }
      res.status(201).json(immediatePayload)

      ;(async () => {
        // Analyze CV like cvParser: extract text from PDF then parse via Gemini
        let analysis = null
        if (cvStored && cvStored.path && cvFile?.mimetype === 'application/pdf') {
          try {
            const absPath = path.join(process.cwd(), cvStored.path.replace(/^\//, ''))
            console.log('[applications] (bg) CV analysis starting for', { absPath, mimetype: cvFile.mimetype })
            const fsLocal = require('fs')
            const buf = fsLocal.readFileSync(absPath)
            const data = Uint8Array.from(buf)
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
            const { extractCvData } = require('../services/cvParser')
            let parsed = null
            try {
              parsed = await extractCvData(fullText)
            } catch (_e) {}

            let compatibility = null
            let finalStatus = null
            try {
              if (offerSummary) {
                const inputCv = parsed || fullText
                compatibility = await scoreCvAgainstOffer(inputCv, offerSummary)
                if (compatibility && typeof compatibility.score_percent === 'number') {
                  appDoc.compatibilityScore = compatibility.score_percent
                }
                if (compatibility && typeof compatibility.score_percent === 'number') {
                  if (compatibility.score_percent >= 50) {
                    finalStatus = 'cv_traite'
                  } else {
                    finalStatus = 'rejete'
                    if (!compatibility.reason) compatibility.reason = 'not compatible'
                    appDoc.rejectionReason = compatibility.reason
                  }
                }
              }
            } catch (_e) {}

            // If passed, generate interview and attach
            if (finalStatus === 'cv_traite') {
              try {
                const { generateInterviewPlan } = require('../services/interviewGenerator')
                const plan = await generateInterviewPlan(parsed || fullText, offerSummary)
                if (plan && Array.isArray(plan.questions)) {
                  appDoc.interviewPlan = {
                    total_minutes: plan.total_minutes || 10,
                    questions: plan.questions,
                    notes: plan.notes || '',
                  }
                }
              } catch (_e) {}
            }

            analysis = { preview: fullText.slice(0, 1200), parsed, compatibility }
            if (finalStatus) appDoc.status = finalStatus
            await appDoc.save()
            console.log('[applications] (bg) updated application', { id: String(appDoc._id), status: appDoc.status, score: appDoc.compatibilityScore, hasInterview: !!appDoc.interviewPlan })
          } catch (e) {
            console.error('[applications] (bg) analysis failed:', e?.message || e)
          }
        }
      })()
    } catch (err) {
      return next(err)
    }
  }
)

// List applications (filter by candidateId and/or offerId)
router.get('/', async (req, res, next) => {
  try {
    const { candidateId, offerId } = req.query || {}
    const criteria = {}
    if (candidateId) criteria.candidateId = candidateId
    if (offerId && /^[a-f\d]{24}$/i.test(String(offerId))) criteria.offer = offerId
    const list = await Application.find(criteria).sort({ createdAt: -1 }).lean()

    // enrich with offer + company
    const offerIds = Array.from(new Set(list.map((a) => (a.offer ? String(a.offer) : null)).filter(Boolean)))
    let enriched = list
    if (offerIds.length > 0) {
      const OfferModel = require('../models/Offer')
      const CompanyModel = require('../models/Company')
      const offers = await OfferModel.find({ _id: { $in: offerIds } })
        .select('title company')
        .lean()
      const offerIdToOffer = offers.reduce((acc, o) => {
        acc[String(o._id)] = o
        return acc
      }, {})
      const companyIds = Array.from(
        new Set(
          offers
            .map((o) => (o.company ? String(o.company) : null))
            .filter(Boolean)
        )
      )
      const companies = await CompanyModel.find({ _id: { $in: companyIds } })
        .select('name imageUrl')
        .lean()
      const companyIdToDoc = companies.reduce((acc, c) => {
        acc[String(c._id)] = { name: c.name, imageUrl: c.imageUrl || '' }
        return acc
      }, {})

      enriched = list.map((a) => {
        const off = a.offer ? offerIdToOffer[String(a.offer)] : null
        const comp = off?.company ? companyIdToDoc[String(off.company)] : null
        return {
          ...a,
          id: String(a._id),
          offerMeta: off
            ? {
                id: String(off._id),
                title: off.title || null,
                company: comp || null,
              }
            : null,
        }
      })
    }
    // ensure id field for all entries
    const withIds = enriched.map((a) => (a.id ? a : { ...a, id: String(a._id) }))
    return res.json(withIds)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await Application.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    return res.json({ ...doc, id: String(doc._id) })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

// Delete an application and its uploaded files directory
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await Application.findById(id)
    if (!doc) return res.status(404).json({ error: 'not_found' })

    // Remove files folder uploads/candidature/<id>
    const dir = path.join(process.cwd(), 'uploads', 'candidature', id)
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true })
      }
    } catch (_e) {}

    await doc.deleteOne()
    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
})


// Save interview result (score) and set status to preselectionne
router.post('/:id/interview-result', async (req, res, next) => {
  try {
    const { id } = req.params
    const { score } = req.body || {}
    const doc = await Application.findById(id)
    if (!doc) return res.status(404).json({ error: 'not_found' })
    const num = Math.max(0, Math.min(100, Math.round(Number(score) || 0)))
    doc.interviewScore = num
    doc.status = 'preselectionne'
    await doc.save()
    return res.json({ ok: true, id: String(doc._id), interviewScore: doc.interviewScore, status: doc.status })
  } catch (err) {
    return next(err)
  }
})


