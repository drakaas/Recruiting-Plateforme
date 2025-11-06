const mongoose = require('mongoose')

const RecruiterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String },
    lastName: { type: String },
    contactNumber: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Recruiter', RecruiterSchema)






