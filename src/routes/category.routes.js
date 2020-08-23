const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const auth = require('../middlewares/auth')
const redis = require('../middlewares/redis')

router
  .get('/', auth, redis.cacheAllCategories, categoryController.getAllCategory)
  .post('/', auth, categoryController.insertCategory)
  .patch('/:id', auth, categoryController.updateCategory)
  .delete('/:id', auth, categoryController.deleteCategory)
  .get('/:id', auth, categoryController.getCategoryById)

module.exports = router