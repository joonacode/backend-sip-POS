const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const redis = require('../middlewares/redis')

router
  .get('/', redis.cacheAllUsers, userController.getAllUser)
  .post('/register', userController.register)
  .post('/login', userController.login)
  .get('/:id', userController.getUserById)

module.exports = router