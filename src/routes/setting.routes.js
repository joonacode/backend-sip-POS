const express = require('express')
const router = express.Router()
const settingController = require('../controllers/setting.controller')
const {
  verifyToken,
  isCashierOrAdmin,
} = require('../middlewares/auth')
const {
  cacheSetting
} = require('../middlewares/redis')

const {
  checkSetting
} = require('../middlewares/formErrorHandling')

router
  .get('/', cacheSetting, settingController.getSetting)
  .patch('/', verifyToken, isCashierOrAdmin, checkSetting, settingController.updateSetting)

module.exports = router