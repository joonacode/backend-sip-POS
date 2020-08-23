const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const auth = require('../middlewares/auth')
const uploadFile = require('../middlewares/multer')
const redis = require('../middlewares/redis')

router
  .get('/', auth, productController.getAllProduct)
  .post('/', auth, uploadFile, productController.insertProduct)
  .patch('/:id', auth, productController.updateProduct)
  .delete('/:id', auth, productController.deleteProduct)
  .get('/:id', auth, productController.getProductById)

module.exports = router