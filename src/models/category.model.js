const connection = require('../config/db.config')
const helpers = require('../helpers/helpers')

const category = {
  getAllCategory: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM categories', (error, result) => {
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
  insertCategory: (newProduct) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO categories SET ?', newProduct, (error, result) => {
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
  updateCategory: (newCategory, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE categorie SET ? WHERE id = ?', [newCategory, id], (error, result) => {
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
  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM categories WHERE id = ?', id, (error, result) => {
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
  getCategoryById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM categories WHERE id = ?', id, (error, result) => {
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

module.exports = category
