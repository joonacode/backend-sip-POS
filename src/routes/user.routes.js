const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const uploadFile = require('../middlewares/multer')

const {
  cacheAllUsers
} = require('../middlewares/redis')
const {
  verifyToken,
  isAdmin,
  isCashierOrAdmin
} = require('../middlewares/auth')

router
  .get('/', verifyToken, isAdmin, cacheAllUsers, userController.getAllUser)
  .post('/register', userController.register)
  .post('/login', userController.login)
  .patch('/:id', verifyToken, isCashierOrAdmin, uploadFile, userController.updateUser)
  .delete('/:id', verifyToken, isAdmin, userController.deleteUser)
  .get('/:id', verifyToken, isCashierOrAdmin, userController.getUserById)

module.exports = router