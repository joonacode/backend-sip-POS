const express = require('express')
const router = express.Router()
const historyController = require('../controllers/history.controller')
const {
  verifyToken,
  isAdmin,
  isCashierOrAdmin
} = require('../middlewares/auth')
const {
  cacheAllHistories
} = require('../middlewares/redis')

router
  .get('/', verifyToken, isCashierOrAdmin, cacheAllHistories, historyController.getAllHistory)
  .post('/', verifyToken, isCashierOrAdmin, historyController.insertHistory)
  .patch('/:id', verifyToken, isAdmin, historyController.updateHistory)
  .delete('/:id', verifyToken, isAdmin, historyController.deleteHistory)
  .get('/:id', verifyToken, isCashierOrAdmin, historyController.getHistoryById)

module.exports = router
