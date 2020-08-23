const queryHelper = require('../helpers/query')
const product = {

  getTotal: () => {
    return queryHelper('SELECT COUNT(*) AS total FROM products')
  },
  getTotalSearch: (query) => {
    return queryHelper('SELECT * FROM products WHERE name LIKE ?', `%${query}%`)
  },
  getAllProduct: (limit, offset, search, order, sorting) => {
    if (!order) {
      order = 'id'
    }
    const query = `SELECT products.*, categories.name as categoryName FROM products JOIN categories on products.idCategory = categories.id ${search ? `WHERE products.name LIKE '%${search}%'` : ''} ORDER BY ${order} ${sorting} LIMIT ${limit} OFFSET ${offset}`
    return queryHelper(query)
  },
  insertProduct: (newProduct) => {
    return queryHelper('INSERT INTO products SET ?', newProduct)
  },
  updateProduct: (newProduct, id) => {
    return queryHelper('UPDATE products SET ? WHERE id = ?', [newProduct, id])
  },
  deleteProduct: (id) => {
    return queryHelper('DELETE FROM products WHERE id = ?', id)
  },
  getProductById: (id) => {
    return queryHelper('SELECT products.*, categories.name as categoryName FROM products JOIN categories on products.idCategory = categories.id WHERE products.id = ?', id)
  }
}

module.exports = product