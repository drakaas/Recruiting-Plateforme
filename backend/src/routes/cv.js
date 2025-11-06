const { Router } = require('express')
const multer = require('multer')
const { extractCvText, scoreCompatibility, generateInterview } = require('../controllers/cvController')

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'))
    }
    cb(null, true)
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

router.post('/extract', upload.single('cv'), extractCvText)
router.post('/score', scoreCompatibility)
router.post('/interview', generateInterview)

module.exports = router


