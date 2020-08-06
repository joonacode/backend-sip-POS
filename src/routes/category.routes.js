const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')

router
  .get('/', categoryController.getAllCategory)
  .post('/', categoryController.insertCategory)
  .patch('/:id', categoryController.updateCategory)
  .delete('/:id', categoryController.deleteCategory)
  .get('/:id', categoryController.getCategoryById)

module.exports = router
