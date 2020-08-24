const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const auth = require('../middlewares/auth')
const uploadFile = require('../middlewares/multer')

router
  .get('/', auth.verifyToken, auth.isCashierOrAdmin, productController.getAllProduct)
  .post('/', auth.verifyToken, auth.isAdmin, uploadFile, productController.insertProduct)
  .patch('/:id', auth.verifyToken, auth.isAdmin, uploadFile, productController.updateProduct)
  .delete('/:id', auth.verifyToken, auth.isAdmin, productController.deleteProduct)
  .get('/:id', auth.verifyToken, auth.isCashierOrAdmin, productController.getProductById)

module.exports = router