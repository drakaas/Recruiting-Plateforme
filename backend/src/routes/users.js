const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { createUser, updateUserProfile, attachUserFiles, getUser } = require('../controllers/usersController')

const router = express.Router()

router.post('/', createUser)
router.put('/:id', updateUserProfile)
router.get('/:id', getUser)

// Multer storage configured per user id param
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.params.id
    const dest = path.join(process.cwd(), 'uploads', 'users', userId)
    fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
    cb(null, `${Date.now()}_${safeName}`)
  },
})

const upload = multer({ storage })

router.post(
  '/:id/files',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 20 },
  ]),
  attachUserFiles
)

module.exports = router


