const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Recruiter = require('../models/Recruiter')

const router = express.Router()

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const normalized = String(email).trim().toLowerCase()
    // Try recruiters first
    const recruiterDoc = await Recruiter.findOne({
      email: { $regex: `^${escapeRegExp(normalized)}$`, $options: 'i' },
    })
      .select('+passwordHash')
      .lean()
    if (recruiterDoc) {
      const ok = await bcrypt.compare(password, recruiterDoc.passwordHash)
      if (!ok) return res.status(401).json({ error: 'invalid credentials' })
      return res.json({ id: recruiterDoc._id.toString(), email: recruiterDoc.email, role: 'recruiter', company: recruiterDoc.company || null })
    }

    // Fallback to users (candidates)
    const user = await User.findOne({
      email: { $regex: `^${escapeRegExp(normalized)}$`, $options: 'i' },
    })
      .select('+passwordHash')
      .lean()
    if (!user) return res.status(401).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })
    return res.json({ id: user._id.toString(), email: user.email, role: user.role, company: user.company || null })
  } catch (err) {
    return next(err)
  }
})

module.exports = router


