const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number },
  },
  { _id: false }
)

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    level: String,
    organization: String,
    date: String,
    description: String,
    skills: [String],
  },
  { _id: false }
)

const LinksSchema = new mongoose.Schema(
  {
    github: String,
    linkedin: String,
    others: [String],
  },
  { _id: false }
)

const ProfileSchema = new mongoose.Schema(
  {
    civility: { type: String, enum: ['mr', 'mrs', 'other'], default: 'other' },
    firstName: String,
    lastName: String,
    city: String,
    postalCode: String,
    phone: String,
    languages: { type: Map, of: String },
    skills: [String],
    links: LinksSchema,
    projects: [ProjectSchema],
  },
  { _id: false }
)

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'recruiter'], default: 'candidate', index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profile: ProfileSchema,
    documents: [DocumentSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)


