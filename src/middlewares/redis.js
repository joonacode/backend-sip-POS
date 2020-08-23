const redis = require('redis')
const client = redis.createClient(process.env.PORT_REDIS)
const helpers = require('../helpers/helpers')

module.exports = {
  cacheAllProducts: (req, res, next) => {
    client.get('getAllProducts', (err, data) => {
      if (err) throw err
      const dataArray = JSON.parse(data)
      if (data !== null) {
        helpers.response(res, dataArray[1], 200, helpers.status.found, dataArray[0])
      } else {
        next()
      }
    })
  },
  cacheAllCategories: (req, res, next) => {
    client.get('getAllCategories', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  },
  cacheAllHistories: (req, res, next) => {
    client.get('getAllHistories', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  },
  cacheAllUsers: (req, res, next) => {
    client.get('getAllUsers', (err, data) => {
      console.log(data)
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  }
}