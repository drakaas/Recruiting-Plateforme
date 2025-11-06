const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Application = require('../models/Application')
const Offer = require('../models/Offer')

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

      // Create base application (without file paths first)
      const appDoc = await Application.create({
        offer: offerId || undefined,
        jobTitle: jobTitle || undefined,
        companyName: company || undefined,
        candidateId: candidateId || undefined,
        message: message || undefined,
        status: 'soumis',
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

      // Optionally, attach offer summary in response
      let offerSummary = null
      if (offerId) {
        const offer = await Offer.findById(offerId).select('title company').lean()
        offerSummary = offer || null
      }

      const json = appDoc.toJSON()
      return res.status(201).json({ ...json, offer: offerSummary || json.offer })
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
    return res.json(enriched)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await Application.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    return res.json(doc)
  } catch (err) {
    return next(err)
  }
})

module.exports = router


