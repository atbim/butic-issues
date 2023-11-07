const express = require('express')
require('dotenv').config()

let app = express()
app.use(express.static('wwwroot'))
app.use(require('./routes/auth.js'))
app.use(require('./routes/models.js'))
console.log('modificación ')
console.log('añadida otra linea')
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}...`)
})