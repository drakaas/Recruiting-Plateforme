const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { createApplication } = require('../controllers/applicationsController')

const router = express.Router()

function ensureDir(dest, cb) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) cb(err)
    else cb(null, dest)
  })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const jobId = req.body?.jobId ? String(req.body.jobId) : 'unknown'
    const cleanJob = jobId.replace(/[^a-z0-9-]/gi, '-').slice(0, 48) || 'job'
    const dest = path.join(process.cwd(), 'uploads', 'applications', cleanJob)
    ensureDir(dest, cb)
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, ext).replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'document'
    const timestamp = Date.now()
    cb(null, `${baseName}-${timestamp}${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Format de fichier non supporté.'))
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
})

router.post(
  '/',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
  ]),
  (req, res, next) => {
    if (Array.isArray(req.files?.cv) && req.files.cv[0]) {
      req.file = req.files.cv[0]
    }
    return createApplication(req, res, next)
  }
)

module.exports = router
