const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const redis = require('../middlewares/redis')
const auth = require('../middlewares/auth')

router
  .get('/', auth.verifyToken, auth.isAdmin, redis.cacheAllUsers, userController.getAllUser)
  .post('/register', userController.register)
  .post('/login', userController.login)
  .patch('/:id', auth.verifyToken, auth.isCashierOrAdmin, userController.updateUser)
  .delete('/:id', auth.verifyToken, auth.isAdmin, userController.deleteUser)
  .get('/:id', auth.verifyToken, auth.isCashierOrAdmin, userController.getUserById)

module.exports = router