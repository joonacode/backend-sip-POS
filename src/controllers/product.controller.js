const productModels = require('../models/product.model')
const helpers = require('../helpers/helpers')
const product = {
  getAllProduct: (req, res) => {
    const limit = Number(req.query.limit) || 9
    const page = !req.query.page ? 1 : req.query.page
    const offset = (page - 1) * limit
    const search = req.query.search || null

    const order = req.query.order
    const sorting = req.query.sorting || 'asc'
    productModels.getAllProduct(limit, offset, search, order, sorting)
      .then(response => {
        const resultProduct = response
        const links = helpers.links(limit, page, resultProduct.total, resultProduct.count)
        helpers.response(res, resultProduct.data, 200, helpers.status.found, links)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },

  insertProduct: (req, res) => {
    const {
      name,
      price,
      image,
      idCategory
    } = req.body
    const newProduct = {
      name,
      price,
      image,
      idCategory
    }
    productModels.insertProduct(newProduct)
      .then(response => {
        const resultProduct = response
        helpers.response(res, resultProduct, res.statusCode, helpers.status.insert, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },

  updateProduct: (req, res) => {
    const {
      name,
      price,
      image,
      idCategory
    } = req.body
    const newProduct = {
      name,
      price,
      image,
      idCategory,
      updatedAt: new Date()
    }
    const id = req.params.id
    productModels.updateProduct(newProduct, id)
      .then(response => {
        const resultProduct = response
        helpers.response(res, resultProduct, res.statusCode, helpers.status.update, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },

  deleteProduct: (req, res) => {
    const id = req.params.id
    productModels.deleteProduct(id)
      .then(response => {
        const resultProduct = response
        helpers.response(res, resultProduct, res.statusCode, helpers.status.delete, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },

  getProductById: (req, res) => {
    const id = req.params.id
    productModels.getProductById(id)
      .then(response => {
        const resultProduct = response
        helpers.response(res, resultProduct, res.statusCode, helpers.status.found)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  }
}

module.exports = product
