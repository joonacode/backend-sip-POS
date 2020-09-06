const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const {
  verifyToken,
  isAdmin,
  isMemberOrCashierOrAdmin
} = require('../middlewares/auth')
const {
  cacheAllCategories
} = require('../middlewares/redis')
const {
  checkCategory
} = require('../middlewares/formErrorHandling')

router
  .get('/', verifyToken, isMemberOrCashierOrAdmin, cacheAllCategories, categoryController.getAllCategory)
  .post('/', verifyToken, isAdmin, checkCategory, categoryController.insertCategory)
  .patch('/:id', verifyToken, isAdmin, checkCategory, categoryController.updateCategory)
  .delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory)
  .get('/:id', verifyToken, isMemberOrCashierOrAdmin, categoryController.getCategoryById)

module.exports = router