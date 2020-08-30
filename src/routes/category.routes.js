const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const {
  verifyToken,
  isAdmin,
  isCashierOrAdmin
} = require('../middlewares/auth')
const {
  cacheAllCategories
} = require('../middlewares/redis')

router
  .get('/', verifyToken, isCashierOrAdmin, cacheAllCategories, categoryController.getAllCategory)
  .post('/', verifyToken, isAdmin, categoryController.insertCategory)
  .patch('/:id', verifyToken, isAdmin, categoryController.updateCategory)
  .delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory)
  .get('/:id', verifyToken, isCashierOrAdmin, categoryController.getCategoryById)

module.exports = router