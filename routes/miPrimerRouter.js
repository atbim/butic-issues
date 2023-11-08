const express = require('express')
const miPrimerController = require('../controllers/miPrimerController')

const router = express.Router()

router
  .route('/')
  .get(miPrimerController.miPrimerEndpoint)
  .post(miPrimerController.miSegundoEndpoint)

module.exports = router
