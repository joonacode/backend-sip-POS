const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const {
  checkRegister,
  checkLogin,
} = require('../middlewares/formErrorHandling')

router
  .post('/refresh-token', authController.refreshToken)
  .post('/register', checkRegister, authController.register)
  .post('/login', checkLogin, authController.login)
  .post('/verify-account', authController.verifyAccount)

module.exports = router