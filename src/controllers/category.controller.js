const categoryModels = require('../models/category.model')
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const product = {
  getAllCategory: (req, res) => {
    const order = req.query.order
    categoryModels.getAllCategory(order)
      .then(response => {
        const resultCategory = response
        helpers.redisInstance().setex('getAllCategories', 60 * 60 * 12, JSON.stringify(resultCategory))
        helpers.response(res, resultCategory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  insertCategory: (req, res) => {
    const {
      name
    } = req.body
    const newCheck = [{
      name: 'Name',
      value: name,
      type: 'string'
    }]

    errorHandling(res, newCheck, () => {
      const newCategory = {
        name
      }
      categoryModels.insertCategory(newCategory)
        .then(response => {
          helpers.redisInstance().del('getAllCategories')

          categoryModels.getCategoryById(response.insertId)
            .then(responseCategory => {
              const resultCategory = responseCategory
              helpers.response(res, resultCategory, res.statusCode, helpers.status.insert, null)
            }).catch(err => {
              helpers.response(res, [], err.statusCode, null, null, err)
            })
        }).catch(err => {
          helpers.response(res, [], err.statusCode, null, null, err)
        })
    })
  },
  updateCategory: (req, res) => {
    const {
      name
    } = req.body
    const newCheck = [{
      name: 'Name',
      value: name,
      type: 'string'
    }]
    errorHandling(res, newCheck, () => {
      const newCategory = {
        name,
        updatedAt: new Date()
      }
      const id = req.params.id
      categoryModels.updateCategory(newCategory, id)
        .then(response => {
          helpers.redisInstance().del('getAllCategories')

          categoryModels.getCategoryById(id)
            .then(responseCategory => {
              const resultCategory = responseCategory
              helpers.response(res, resultCategory, res.statusCode, helpers.status.update, null)
            }).catch(err => {
              helpers.response(res, [], err.statusCode, null, null, err)
            })
        }).catch(err => {
          helpers.response(res, [], err.statusCode, null, null, err)
        })
    })
  },
  deleteCategory: (req, res) => {
    const id = req.params.id
    categoryModels.deleteCategory(id)
      .then(response => {
        const resultCategory = response
        helpers.redisInstance().del('getAllCategories')
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