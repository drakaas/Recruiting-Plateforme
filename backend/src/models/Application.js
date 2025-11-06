const { Schema, model } = require('mongoose')

const fileSchema = new Schema(
  {
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
  },
  { _id: false }
)

const applicationSchema = new Schema(
  {
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    candidateId: { type: String },
    candidateName: { type: String },
    candidateEmail: { type: String, required: true },
    message: { type: String },
    cv: { type: fileSchema, required: true },
    documents: { type: [fileSchema], default: [] },
    status: {
      type: String,
      enum: ['pending-review', 'scheduled', 'accepted', 'rejected'],
      default: 'pending-review',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Application', applicationSchema)
