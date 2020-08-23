const queryHelper = require('../helpers/query')
const connection = require('../config/db.config')

const category = {
  getAllCategory: (order) => {
    return queryHelper(`SELECT * FROM categories ORDER BY id ${order ? order : 'desc'}`)
  },
  insertCategory: (newProduct) => {
    return queryHelper('INSERT INTO categories SET ?', newProduct)
  },
  updateCategory: (newCategory, id) => {
    return queryHelper('UPDATE categories SET ? WHERE id = ?', [newCategory, id])
  },
  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM products WHERE idCategory = ?', id, (error, result) => {
        if (!error) {
          if (result.length > 0) {
            const objError = {
              code: 'ERR_HAS_BEEN_USED',
              statusCode: 400,
              sqlMessage: 'Category is being used by the product'
            }
            reject(objError)
          } else {
            resolve(queryHelper('DELETE FROM categories WHERE id = ?', id))
          }
        } else {
          const objError = {
            ...error,
            statusCode: 500
          }
          reject(objError)
        }
      })
    })
  },
  getCategoryById: (id) => {
    return queryHelper('SELECT * FROM categories WHERE id = ?', id)
  }
}

module.exports = category