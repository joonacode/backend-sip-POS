const express = require('express')

const routeProduct = require('./product.routes')
const routeHistory = require('./category.routes')
const routeCategory = require('./history.routes')
const routeUser = require('./user.routes')
const router = express.Router()

router
  .use('/products', routeProduct)
  .use('/categories', routeHistory)
  .use('/histories', routeCategory)
  .use('/users', routeUser)

module.exports = router
