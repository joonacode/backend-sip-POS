const connection = require('../config/db.config')
const helpers = require('../helpers/helpers')
let total
const getTotal = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT COUNT(*) AS total FROM products', (err, result) => {
      if (!err) {
        resolve(result[0].total)
      }
    })
  })
}

const getTotalSearch = (query) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM products WHERE name LIKE ?', `%${query}%`, (err, result) => {
      if (!err) {
        resolve(result.length)
      }
    })
  })
}

getTotal().then(res => {
  total = res
})

const product = {
  getAllProduct: (limit, offset, search, order, sorting) => {
    let query
    let queryData
    if (search) {
      query = 'SELECT * FROM products WHERE name LIKE ? LIMIT ? OFFSET ?'
      queryData = [`%${search}%`, limit, offset]
      getTotalSearch(search).then(res => {
        total = res
      })
    } else {
      if (!order) {
        order = 'id'
      }
      query = `SELECT products.*, categories.name as categoryName FROM products JOIN categories on products.idCategory = categories.id ORDER BY ${order} ${sorting} LIMIT ${limit} OFFSET ${offset}`
    }

    return new Promise((resolve, reject) => {
      connection.query(query, queryData, (error, result) => {
        if (!error) {
          if (result.length <= 0) {
            const objError = helpers.errors.notFound
            reject(objError)
          } else {
            const newResult = {
              count: result.length,
              total: total,
              data: result
            }
            resolve(newResult)
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

  insertProduct: (newProduct) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO products SET ?', newProduct, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          const objError = {
            ...error,
            statusCode: 400
          }
          reject(objError)
        }
      })
    })
  },

  updateProduct: (newProduct, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE products SET ? WHERE id = ?', [newProduct, id], (error, result) => {
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
            statusCode: 400
          }
          reject(objError)
        }
      })
    })
  },

  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
        if (!error) {
          if (result.affectedRows === 0) {
            const objError = helpers.errors.notFound
            reject(objError)
          } else {
            resolve(result)
          }
        } else {
          reject(error)
        }
      })
    })
  },

  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM products WHERE id = ?', id, (error, result) => {
        if (!error) {
          if (result.length <= 0) {
            const objError = helpers.errors.notFound
            reject(objError)
          } else {
            resolve(result)
          }
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = product
