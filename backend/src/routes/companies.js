const express = require('express')
const Company = require('../models/Company')

const router = express.Router()

router.get('/', async (_req, res, next) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 }).lean()
    return res.json(companies)
  } catch (err) {
    return next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, email, address, imageUrl, description } = req.body || {}
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' })
    const company = await Company.create({ name, email, address, imageUrl, description })
    return res.status(201).json({ id: company._id.toString() })
  } catch (err) {
    return next(err)
  }
})

module.exports = router






