const categoryModels = require('../models/category.model')
const helpers = require('../helpers/helpers')

const product = {
  getAllCategory: (req, res) => {
    categoryModels.getAllCategory()
      .then(response => {
        const resultCategory = response
        helpers.response(res, resultCategory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  insertCategory: (req, res) => {
    const { name } = req.body
    const newCategory = { name }
    categoryModels.insertCategory(newCategory)
      .then(response => {
        const resultCategory = response
        helpers.response(res, resultCategory, res.statusCode, helpers.status.insert, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  updateCategory: (req, res) => {
    const { name } = req.body
    const newCategory = { name, updatedAt: new Date() }
    const id = req.params.id
    categoryModels.updateCategory(newCategory, id)
      .then(response => {
        const resultCategory = response
        helpers.response(res, resultCategory, res.statusCode, helpers.status.update, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  deleteCategory: (req, res) => {
    const id = req.params.id
    categoryModels.deleteCategory(id)
      .then(response => {
        const resultCategory = response
        helpers.response(res, resultCategory, res.statusCode, helpers.status.delete, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  getCategoryById: (req, res) => {
    const id = req.params.id
    categoryModels.getCategoryById(id)
      .then(response => {
        const resultCategory = response
        helpers.response(res, resultCategory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  }
}

module.exports = product
