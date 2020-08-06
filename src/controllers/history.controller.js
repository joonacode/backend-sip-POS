const historyModels = require('../models/history.model')
const helpers = require('../helpers/helpers')

const history = {
  getAllHistory: (req, res) => {
    historyModels.getAllHistory()
      .then(response => {
        const resultHistory = response
        helpers.response(res, resultHistory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  insertHistory: (req, res) => {
    const { invoice, cashier, orders, amount } = req.body
    const newHistory = { invoice, cashier, orders, amount }
    historyModels.insertHistory(newHistory)
      .then(response => {
        const resultHistory = response
        helpers.response(res, resultHistory, res.statusCode, helpers.status.insert, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  deleteHistory: (req, res) => {
    const id = req.params.id
    historyModels.deleteHistory(id)
      .then(response => {
        const resultHistory = response
        helpers.response(res, resultHistory, res.statusCode, helpers.status.delete, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  getHistoryById: (req, res) => {
    const id = req.params.id
    historyModels.getHistoryById(id)
      .then(response => {
        const resultHistory = response
        helpers.response(res, resultHistory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  }
}

module.exports = history
