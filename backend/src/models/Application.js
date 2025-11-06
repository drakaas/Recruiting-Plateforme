const mongoose = require('mongoose')

const StoredFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    mimetype: { type: String },
  },
  { _id: false }
)

const ApplicationSchema = new mongoose.Schema(
  {
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    jobTitle: { type: String },
    companyName: { type: String },
    candidateId: { type: String },
    // candidateName removed
    // candidateEmail removed
    message: { type: String },
    status: {
      type: String,
      enum: ['soumis', 'cv_traite', 'rejete', 'accepte', 'preselectionne', 'en_attente_interview'],
      default: 'soumis',
    },
    compatibilityScore: { type: Number },
    rejectionReason: { type: String },
    cv: StoredFileSchema,
    documents: [StoredFileSchema],
    analysis: {
      preview: { type: String },
      parsed: { type: mongoose.Schema.Types.Mixed },
    },
    interviewPlan: {
      total_minutes: { type: Number },
      questions: { type: [mongoose.Schema.Types.Mixed] },
      notes: { type: String },
    },
    interviewScore: { type: Number },
  },
  { timestamps: true }
)

// Prevent duplicate applications per candidate per offer
ApplicationSchema.index({ offer: 1, candidateId: 1 }, { unique: true, sparse: true })

ApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Application', ApplicationSchema)


