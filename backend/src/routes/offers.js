const express = require('express')
const Offer = require('../models/Offer')
const Recruiter = require('../models/Recruiter')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { recruiterId } = req.query || {}
    const criteria = {}
    if (recruiterId) criteria.recruiter = recruiterId
    const list = await Offer.find(criteria).sort({ createdAt: -1 }).lean()
    // Map to UI-friendly date label similar to existing component
    const mapped = list.map((o) => ({
      ...o,
      publishedAt: o.publishedAt ? `Publié le ${new Date(o.publishedAt).toLocaleDateString('fr-FR')}` : 'Brouillon',
    }))
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

    const json = doc.toJSON()
    json.publishedAt = 'Brouillon'
    return res.status(201).json(json)
  } catch (err) {
    return next(err)
  }
})

module.exports = router


