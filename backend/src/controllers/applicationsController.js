const fs = require('fs/promises')
const path = require('path')
const Application = require('../models/Application')

function toUploadsRelativePath(filePath) {
  if (!filePath) return null
  const uploadsRoot = path.join(process.cwd(), 'uploads')
  const relative = path.relative(uploadsRoot, filePath)
  if (relative.startsWith('..')) return filePath.replace(/\\/g, '/')
  return path.join('uploads', relative).replace(/\\/g, '/')
}

exports.createApplication = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Le CV est requis.' })
    }

    const { jobId, jobTitle, company, candidateId, candidateName, candidateEmail, message } = req.body
    if (!jobId || !jobTitle || !company || !candidateEmail) {
      return res.status(400).json({ message: 'Informations de candidature incomplètes.' })
    }

    const cvInfo = {
      originalName: req.file.originalname,
      path: toUploadsRelativePath(req.file.path),
      size: req.file.size,
      mimetype: req.file.mimetype,
    }

    const documentFiles = Array.isArray(req.files?.documents)
      ? req.files.documents
      : Array.isArray(req.files)
        ? req.files
        : []

    const documents = documentFiles.map((file) => ({
      originalName: file.originalname,
      path: toUploadsRelativePath(file.path),
      size: file.size,
      mimetype: file.mimetype,
    }))

    const app = await Application.create({
      jobId,
      jobTitle,
      company,
      candidateId,
      candidateName,
      candidateEmail,
      message,
      cv: cvInfo,
      documents,
    })

    res.status(201).json({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      company: app.company,
      status: app.status,
      createdAt: app.createdAt,
      interviewConfig: {
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        interviewDuration: 8,
        questionCount: 3,
      },
    })
  } catch (error) {
    // If something went wrong, attempt to clean uploaded files to avoid orphaned data
    const filesToClean = []
    if (req.file?.path) filesToClean.push(req.file.path)
    const rest = Array.isArray(req.files?.documents) ? req.files.documents : []
    rest.forEach((file) => {
      if (file?.path) filesToClean.push(file.path)
    })
    await Promise.allSettled(filesToClean.map((filePath) => fs.unlink(filePath)))
    next(error)
  }
}
