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
    type: Number,
    default: Date.now,
  },
  dbIds: [
    {
      type: Number,
    },
  ],
  status: {
    type: String,
    enum: ['Leve', 'Moderado', 'Grave'],
    default: 'Leve'
  },
})

const Issue = mongoose.model('Issue', IssueSchema)

module.exports = Issue
