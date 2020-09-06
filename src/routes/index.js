const express = require('express')

const routeProduct = require('./product.routes')
const routeHistory = require('./category.routes')
const routeCategory = require('./history.routes')
const routeUser = require('./user.routes')
const routeAuth = require('./auth.routes')
const routeSetting = require('./setting.routes')
const router = express.Router()

router
  .use('/products', routeProduct)
  .use('/categories', routeHistory)
  .use('/histories', routeCategory)
  .use('/users', routeUser)
  .use('/auth', routeAuth)
  .use('/setting', routeSetting)

module.exports = router