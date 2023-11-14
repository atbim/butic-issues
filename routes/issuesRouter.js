const express = require('express')
const issuesController = require('../controllers/issuesController')

const router = express.Router()

router
  .route('/')
  .get(issuesController.getAllIssues)
  .post(issuesController.createIssue)

router.route('/status').get(issuesController.getDbIdsByStatus)

router
  .route('/:id')
  .get(issuesController.getOneIssue)
  .delete(issuesController.deleteOneIssue)
  .patch(issuesController.updateOneIssue)

module.exports = router
