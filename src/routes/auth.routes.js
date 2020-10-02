const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const {
  checkRegister,
  checkLogin,
  checkForgotPassword,
  checkResetPassword
} = require('../middlewares/formErrorHandling')

router
  .post('/register', checkRegister, authController.register)
  .post('/login', checkLogin, authController.login)
  .post('/forgot-password', checkForgotPassword, authController.forgotPassword)
  .post('/verify-account', authController.verifyAccount)
  .post('/verify-token-password', authController.verifyTokenPassword)
  .post('/reset-password', checkResetPassword, authController.resetPassword)
module.exports = router