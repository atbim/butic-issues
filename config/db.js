const mongoose = require('mongoose')
require('dotenv').config()

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

const connectDb = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
    })
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDb
