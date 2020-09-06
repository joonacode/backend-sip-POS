const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const {
  verifyToken,
  isAdmin,
  isMemberOrCashierOrAdmin,
  isCashierOrAdmin
} = require('../middlewares/auth')
const {
  checkProduct
} = require('../middlewares/formErrorHandling')
const uploadFile = require('../middlewares/multer')
const {
  cacheAllProducts
} = require('../middlewares/redis')

router
  .get('/', verifyToken, isMemberOrCashierOrAdmin, productController.getAllProduct)
  .get('/no-paging', verifyToken, isCashierOrAdmin, cacheAllProducts, productController.getAllProductNoPaging)
  .post('/', verifyToken, isAdmin, uploadFile, checkProduct, productController.insertProduct)
  .patch('/:id', verifyToken, isAdmin, uploadFile, checkProduct, productController.updateProduct)
  .delete('/:id', verifyToken, isAdmin, productController.deleteProduct)
  .get('/:id', verifyToken, isMemberOrCashierOrAdmin, productController.getProductById)

module.exports = router