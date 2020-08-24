const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const auth = require('../middlewares/auth')
const redis = require('../middlewares/redis')

router
  .get('/', auth.verifyToken, auth.isCashierOrAdmin, redis.cacheAllCategories, categoryController.getAllCategory)
  .post('/', auth.verifyToken, auth.isAdmin, categoryController.insertCategory)
  .patch('/:id', auth.verifyToken, auth.isAdmin, categoryController.updateCategory)
  .delete('/:id', auth.verifyToken, auth.isAdmin, categoryController.deleteCategory)
  .get('/:id', auth.verifyToken, auth.isCashierOrAdmin, categoryController.getCategoryById)

module.exports = router