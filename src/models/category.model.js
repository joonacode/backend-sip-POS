const queryHelper = require('../helpers/query')

const category = {
  getAllCategory: () => {
    return queryHelper('SELECT * FROM categories')
  },
  insertCategory: (newProduct) => {
    return queryHelper('INSERT INTO categories SET ?', newProduct)
  },
  updateCategory: (newCategory, id) => {
    return queryHelper('UPDATE categories SET ? WHERE id = ?', [newCategory, id])
  },
  deleteCategory: (id) => {
    return queryHelper('DELETE FROM categories WHERE id = ?', id)
  },
  getCategoryById: (id) => {
    return queryHelper('SELECT * FROM categories WHERE id = ?', id)
  }
}

module.exports = category
