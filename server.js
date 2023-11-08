const express = require('express')
require('dotenv').config()
const { PORT } = require('./config.js')
const miPrimerRouter = require('./routes/miPrimerRouter.js')

let app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.static('wwwroot'))
app.use(require('./routes/auth.js'))
app.use(require('./routes/models.js'))

app.use('/api/endpoint', miPrimerRouter)

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}...`)
})
