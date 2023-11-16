const express = require('express')
require('dotenv').config()
const { PORT } = require('./config.js')
const connectDb = require('./config/db')
const miPrimerRouter = require('./routes/miPrimerRouter.js')
const issuesRouter = require('./routes/issuesRouter.js')

// Connect Database
connectDb();

let app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.static('wwwroot'))
app.use(require('./routes/auth.js'))
app.use(require('./routes/models.js'))

app.use('/api/endpoint', miPrimerRouter)
app.use('/api/issues', issuesRouter)

// Routing
app.get('/buckets', (req, res) => {
  res.sendFile(__dirname + '/wwwroot/buckets')
})

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}...`)
})
