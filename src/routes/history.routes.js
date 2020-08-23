const express = require('express')
const router = express.Router()
const historyController = require('../controllers/history.controller')
const auth = require('../middlewares/auth')
const redis = require('../middlewares/redis')

router
  .get('/', auth, redis.cacheAllHistories, historyController.getAllHistory)
  .post('/', auth, historyController.insertHistory)
  .patch('/:id', auth, historyController.updateHistory)
  .delete('/:id', auth, historyController.deleteHistory)
  .get('/:id', auth, historyController.getHistoryById)

module.exports = router