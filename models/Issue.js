const mongoose = require('mongoose')
const IssueSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: 'El parámetro name es obligatorio.',
  },
  description: String,
  date: {
    type: Date,
    default: Date.now // Gestionar Date con unix timestamp
  }
})

const Issue = mongoose.model('Issue', IssueSchema)

module.exports = Issue
