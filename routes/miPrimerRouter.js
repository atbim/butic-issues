const express = require('express')
const miPrimerController = require('../controllers/miPrimerController')

const router = express.Router()

router
  .route('/')
  .get(miPrimerController.miPrimeraFuncion)
  .post(miPrimerController.miSegundaFuncion)

router
  .route('/:id')
  .get(miPrimerController.miTerceraFunction)

router
  .route('/:id/status')
  .get(miPrimerController.miCuartaFuncion)

module.exports = router
