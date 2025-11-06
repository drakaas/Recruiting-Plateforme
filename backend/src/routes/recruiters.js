const express = require('express')
const bcrypt = require('bcryptjs')
const Recruiter = require('../models/Recruiter')

const router = express.Router()

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.get('/', async (_req, res, next) => {
  try {
    const list = await Recruiter.find({}).select('-passwordHash').populate('company').lean()
    return res.json(list)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const r = await Recruiter.findById(req.params.id).select('-passwordHash').populate('company').lean()
    if (!r) return res.status(404).json({ error: 'not found' })
    return res.json(r)
  } catch (err) {
    return next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { email, password, companyId, firstName, lastName, contactNumber } = req.body || {}
    if (!email || !password || !companyId) return res.status(400).json({ error: 'email, password and companyId are required' })
    const normalized = String(email).trim().toLowerCase()
    const exists = await Recruiter.findOne({ email: { $regex: `^${escapeRegExp(normalized)}$`, $options: 'i' } })
    if (exists) return res.status(409).json({ error: 'email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const doc = await Recruiter.create({ email: normalized, passwordHash, firstName, lastName, contactNumber, company: companyId })
    return res.status(201).json({ id: doc._id.toString(), email: doc.email, company: doc.company })
  } catch (err) {
    return next(err)
  }
})

module.exports = router






