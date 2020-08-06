const connection = require('../config/db.config')
const helpers = require('../helpers/helpers')

const history = {
  getAllHistory: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM histories', (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          const objError = {
            ...error,
            statusCode: helpers.errors.checkStatusCode(error.errno)
          }
          reject(objError)
        }
      })
    })
  },
  insertHistory: (newHistory) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO histories SET ?', newHistory, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          const objError = {
            ...error,
            statusCode: helpers.errors.checkStatusCode(error.errno)
          }
          reject(objError)
        }
      })
    })
  },
  deleteHistory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM histories WHERE id = ?', id, (error, result) => {
        if (!error) {
          if (result.affectedRows === 0) {
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
  },
  getHistoryById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM histories WHERE id = ?', id, (error, result) => {
        if (!error) {
          if (result.length <= 0) {
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
}

module.exports = history
