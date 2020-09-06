const redis = require('redis')
const client = redis.createClient(process.env.PORT_REDIS)
const helpers = require('../helpers/helpers')

module.exports = {
  cacheAllProducts: (req, res, next) => {
    client.get('getAllProducts', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
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
  cacheMyHistories: (req, res, next) => {
    client.get('getMyHistories', (err, data) => {
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
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  },
  cacheAllMember: (req, res, next) => {
    client.get('getAllMember', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  },

  cacheDetailUser: (req, res, next) => {
    client.get('getDetailUser', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  },

  cacheSetting: (req, res, next) => {
    client.get('getSetting', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  }
}