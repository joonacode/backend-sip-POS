const express = require('express')
const router = express.Router()
const historyController = require('../controllers/history.controller')
const auth = require('../middlewares/auth')
const redis = require('../middlewares/redis')

router
  .get('/', auth.verifyToken, auth.isCashierOrAdmin, redis.cacheAllHistories, historyController.getAllHistory)
  .post('/', auth.verifyToken, auth.isCashierOrAdmin, historyController.insertHistory)
  .patch('/:id', auth.verifyToken, auth.isAdmin, historyController.updateHistory)
  .delete('/:id', auth.verifyToken, auth.isAdmin, historyController.deleteHistory)
  .get('/:id', auth.verifyToken, auth.isCashierOrAdmin, historyController.getHistoryById)

module.exports = router