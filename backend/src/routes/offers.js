const express = require('express')
const Offer = require('../models/Offer')
const Recruiter = require('../models/Recruiter')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { recruiterId } = req.query || {}
    const criteria = {}
    if (recruiterId) criteria.recruiter = recruiterId

    // Load offers (no populate), we will resolve company via recruiter if needed
    const list = await Offer.find(criteria).sort({ createdAt: -1 }).lean()

    // Resolve company for each offer: prefer offer.company, else recruiter.company
    const recruiterIds = Array.from(new Set(list.map((o) => String(o.recruiter))))
    const RecruiterModel = require('../models/Recruiter')
    const recruiters = await RecruiterModel.find({ _id: { $in: recruiterIds } })
      .select('company')
      .lean()
    const recruiterIdToCompanyId = recruiters.reduce((acc, r) => {
      acc[String(r._id)] = r.company ? String(r.company) : null
      return acc
    }, {})

    const companyIds = Array.from(
      new Set(
        list.map((o) => {
          const direct = o.company ? String(o.company) : null
          return direct || recruiterIdToCompanyId[String(o.recruiter)] || null
        }).filter(Boolean)
      )
    )

    const Company = require('../models/Company')
    const companies = await Company.find({ _id: { $in: companyIds } }).select('name imageUrl').lean()
    const companyIdToDoc = companies.reduce((acc, c) => {
      acc[String(c._id)] = { _id: String(c._id), name: c.name, imageUrl: c.imageUrl || '' }
      return acc
    }, {})

    // Map to UI-friendly date label and attach company object
    const mapped = list.map((o) => {
      const companyId = o.company ? String(o.company) : recruiterIdToCompanyId[String(o.recruiter)] || null
      const company = companyId ? companyIdToDoc[companyId] || null : null
      return {
        ...o,
        company: company || o.company, // ensure object if found, otherwise keep original
        publishedAt: o.publishedAt
          ? `Publié le ${new Date(o.publishedAt).toLocaleDateString('fr-FR')}`
          : 'Brouillon',
      }
    })
    return res.json(mapped)
  } catch (err) {
    return next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      recruiterId,
      title,
      department,
      status,
      location,
      contractType,
      contractDuration,
      salary,
      remote,
      experience,
      education,
      mission,
      keywords,
      skills,
    } = req.body || {}

    if (!recruiterId || !title) return res.status(400).json({ error: 'recruiterId and title are required' })

    const recruiter = await Recruiter.findById(recruiterId).lean()
    if (!recruiter) return res.status(404).json({ error: 'recruiter not found' })

    const doc = await Offer.create({
      recruiter: recruiterId,
      company: recruiter.company || undefined,
      title,
      department,
      status: status || 'Disponible',
      publishedAt: null,
      location,
      contractType,
      contractDuration,
      salary,
      remote,
      experience,
      education,
      mission,
      keywords: Array.isArray(keywords) ? keywords : [],
      skills: Array.isArray(skills) ? skills : [],
      candidates: [],
    })

    // Populate company info for the response (name, imageUrl)
    await doc.populate('company', 'name imageUrl')
    const json = doc.toJSON()
    json.publishedAt = 'Brouillon'
    return res.status(201).json(json)
  } catch (err) {
    return next(err)
  }
})

module.exports = router

// Get single offer by id (includes company via offer.company or recruiter.company)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const OfferModel = Offer
    const doc = await OfferModel.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })

    const RecruiterModel = require('../models/Recruiter')
    const Company = require('../models/Company')

    const recruiterId = doc.recruiter ? String(doc.recruiter) : null
    const recruiter = recruiterId
      ? await RecruiterModel.findById(recruiterId).select('company').lean()
      : null
    const companyId = doc.company ? String(doc.company) : recruiter?.company ? String(recruiter.company) : null
    const company = companyId
      ? await Company.findById(companyId).select('name imageUrl email address description').lean()
      : null

    const result = {
      ...doc,
      company: company || doc.company || null,
      publishedAt: doc.publishedAt
        ? `Publié le ${new Date(doc.publishedAt).toLocaleDateString('fr-FR')}`
        : 'Brouillon',
    }
    return res.json(result)
  } catch (err) {
    return next(err)
  }
})


