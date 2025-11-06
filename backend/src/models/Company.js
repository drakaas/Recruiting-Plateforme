const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true },
    address: { type: String },
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Company', CompanySchema)






