const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    importance: { type: String, enum: ['Importante', 'Souhaitée'], default: 'Importante' },
  },
  { _id: false }
)

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number },
    stage: { type: String },
    feedback: { type: String },
    status: { type: String, enum: ['pending', 'invited', 'recommended', 'recruited', 'refused'], default: 'pending' },
  },
  { _id: false }
)

const OfferSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true, index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    title: { type: String, required: true },
    department: { type: String },
    status: { type: String, enum: ['Disponible', 'Fermée'], default: 'Disponible' },
    publishedAt: { type: Date },
    location: { type: String },
    contractType: { type: String },
    contractDuration: { type: String },
    salary: { type: String },
    remote: { type: String },
    experience: { type: String },
    education: { type: String },
    mission: { type: String },
    keywords: [{ type: String }],
    skills: [SkillSchema],
    candidates: [CandidateSchema],
  },
  { timestamps: true }
)

OfferSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Offer', OfferSchema)




