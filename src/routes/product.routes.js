const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')

router
  .get('/', productController.getAllProduct)
  .post('/', productController.insertProduct)
  .patch('/:id', productController.updateProduct)
  .delete('/:id', productController.deleteProduct)
  .get('/:id', productController.getProductById)

module.exports = router
