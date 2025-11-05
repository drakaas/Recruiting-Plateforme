const bcrypt = require('bcryptjs')
const User = require('../models/User')
const path = require('path')

function mapParsedToProfile(parsed) {
  if (!parsed) return {}
  const civRaw = String(parsed.civilite || '').toLowerCase()
  const civility = civRaw.includes('monsieur') ? 'mr' : civRaw.includes('madame') ? 'mrs' : 'other'
  const links = {
    github: parsed?.liens?.github || '',
    linkedin: parsed?.liens?.linkedin || '',
    others: Array.isArray(parsed?.liens?.autres) ? parsed.liens.autres.filter(Boolean) : [],
  }
  const projects = Array.isArray(parsed?.projets_professionnels)
    ? parsed.projets_professionnels.map((p) => ({
        name: p?.nom || '',
        level: p?.niveau || '',
        organization: p?.organisme || '',
        date: p?.date || '',
        description: p?.description || '',
        skills: Array.isArray(p?.competences) ? p.competences.filter(Boolean) : [],
      }))
    : []

  const skills = typeof parsed?.competences === 'string'
    ? parsed.competences.split(',').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(parsed?.competences) ? parsed.competences.filter(Boolean) : []

  return {
    civility,
    firstName: parsed?.prenom || '',
    lastName: parsed?.nom || '',
    city: parsed?.ville || '',
    postalCode: parsed?.code_postal || '',
    phone: parsed?.telephone || '',
    languages: parsed?.langues || {},
    skills,
    links,
    projects,
  }
}

async function createUser(req, res, next) {
  try {
    const { email, password, parsed, role, companyId } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
    const normalized = String(email).trim().toLowerCase()
    const exists = await User.findOne({ email: { $regex: `^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } })
    if (exists) return res.status(409).json({ error: 'email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const profile = mapParsedToProfile(parsed)

    const doc = { email: normalized, passwordHash, profile }
    if (role === 'recruiter') {
      doc.role = 'recruiter'
      if (companyId) doc.company = companyId
    }

    const user = await User.create(doc)
    return res.status(201).json({ id: user._id.toString(), email: user.email, role: user.role, company: user.company || null })
  } catch (err) {
    return next(err)
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const { id } = req.params
    const { profile } = req.body
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { profile } },
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ error: 'user not found' })
    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
}

async function attachUserFiles(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ error: 'user not found' })

    const cvFile = (req.files?.cv || [])[0]
    const docs = req.files?.documents || []

    if (cvFile) {
      const cvName = (req.body?.cvName && String(req.body.cvName)) || 'CV'
      const relPath = toUploadsRelativePath(cvFile.path)
      user.documents = [
        ...(user.documents || []),
        {
          name: cvName,
          filename: cvFile.filename,
          path: relPath,
          mimetype: cvFile.mimetype,
          size: cvFile.size,
        },
      ]
    }

    if (docs.length > 0) {
      const names = Array.isArray(req.body?.documentNames)
        ? req.body.documentNames
        : req.body?.documentNames ? [req.body.documentNames] : []

      const mapped = docs.map((f, idx) => ({
        name: names[idx] || f.originalname,
        filename: f.filename,
        path: toUploadsRelativePath(f.path),
        mimetype: f.mimetype,
        size: f.size,
      }))
      user.documents = [...(user.documents || []), ...mapped]
    }

    await user.save()
    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
}

module.exports = { createUser, updateUserProfile, attachUserFiles }
async function getUser(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findById(id).lean()
    if (!user) return res.status(404).json({ error: 'user not found' })
    // Do not expose password hash
    delete user.passwordHash
    return res.json(user)
  } catch (err) {
    return next(err)
  }
}

module.exports = { createUser, updateUserProfile, attachUserFiles, getUser }

function toUploadsRelativePath(absPath) {
  try {
    const uploadsRoot = path.join(process.cwd(), 'uploads')
    let rel = path.relative(uploadsRoot, absPath)
    // normalize to use forward slashes for portability
    rel = rel.split(path.sep).join('/')
    return `uploads/${rel}`
  } catch (_e) {
    return absPath
  }
}


