const express = require('express')
const router = express.Router()
const historyController = require('../controllers/history.controller')

router
  .get('/', historyController.getAllHistory)
  .post('/', historyController.insertHistory)
  .patch('/:id', historyController.updateHistory)
  .delete('/:id', historyController.deleteHistory)
  .get('/:id', historyController.getHistoryById)

module.exports = router
