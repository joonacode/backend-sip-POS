const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const {
  verifyToken,
  isAdmin,
  isCashierOrAdmin
} = require('../middlewares/auth')
const uploadFile = require('../middlewares/multer')

router
  .get('/', verifyToken, isCashierOrAdmin, productController.getAllProduct)
  .post('/', verifyToken, isAdmin, uploadFile, productController.insertProduct)
  .patch('/:id', verifyToken, isAdmin, uploadFile, productController.updateProduct)
  .delete('/:id', verifyToken, isAdmin, productController.deleteProduct)
  .get('/:id', verifyToken, isCashierOrAdmin, productController.getProductById)

module.exports = router