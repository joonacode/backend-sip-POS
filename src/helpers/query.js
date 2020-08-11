const connection = require('../config/db.config')
const helpers = require('./helpers')

module.exports = (query, queryData = null, paramResult = null) => {
  return new Promise((resolve, reject) => {
    connection.query(query, queryData, (error, result) => {
      if (!error) {
        if (result.length <= 0 || result.affectedRows === 0) {
          const objError = helpers.errors.notFound
          reject(objError)
        } else {
          resolve(result)
        }
      } else {
        const objError = {
          ...error,
          statusCode: helpers.errors.checkStatusCode(error.errno)
        }
        reject(objError)
      }
    })
  })
}
