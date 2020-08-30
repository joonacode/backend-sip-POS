const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router
  .post('/refresh-token', authController.refreshToken)
  .post('/register', authController.register)
  .post('/login', authController.login)

module.exports = router