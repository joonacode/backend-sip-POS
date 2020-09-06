const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const uploadFile = require('../middlewares/multer')

const {
  cacheAllUsers,
  cacheAllMember
} = require('../middlewares/redis')
const {
  verifyToken,
  isAdmin,
  isCashierOrAdmin,
  isMemberOrCashierOrAdmin
} = require('../middlewares/auth')
const {
  checkUpdateUser,
  checkAddUser,
  checkChangePassword
} = require('../middlewares/formErrorHandling')

router
  .get('/', verifyToken, isAdmin, cacheAllUsers, userController.getAllUser)
  .get('/member', verifyToken, isCashierOrAdmin, cacheAllMember, userController.getAllMember)
  .post('/', verifyToken, isAdmin, checkAddUser, userController.addUser)
  .patch('/profile/:id', verifyToken, isMemberOrCashierOrAdmin, uploadFile, userController.updateProfile)
  .patch('/change-password/:id', verifyToken, isMemberOrCashierOrAdmin, checkChangePassword, userController.changePassword)
  .patch('/:id', verifyToken, isAdmin, uploadFile, checkUpdateUser, userController.updateUser)
  .delete('/:id', verifyToken, isAdmin, userController.deleteUser)
  .get('/:id', verifyToken, isMemberOrCashierOrAdmin, userController.getUserById)

module.exports = router