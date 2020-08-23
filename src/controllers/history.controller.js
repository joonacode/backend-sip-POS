const historyModels = require('../models/history.model')
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')

const history = {
  getAllHistory: (req, res) => {
    const order = req.query.order
    historyModels.getAllHistory(order)
      .then(response => {
        const resultHistory = response
        helpers.redisInstance().setex('getAllHistories', 60 * 60 * 12, JSON.stringify(resultHistory))
        helpers.response(res, resultHistory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  insertHistory: (req, res) => {
    const {
      invoice,
      cashier,
      orders,
      amount
    } = req.body
    const newCheck = [{
        name: 'Invoice',
        value: invoice,
        type: 'string'
      },
      {
        name: 'Cashier',
        value: cashier,
        type: 'string'
      },
      {
        name: 'Orders',
        value: orders,
        type: 'string'
      },
      {
        name: 'Amount',
        value: amount,
        type: 'number'
      }
    ]
    errorHandling(res, newCheck, () => {
      const newHistory = {
        invoice,
        cashier,
        orders,
        amount
      }
      historyModels.insertHistory(newHistory)
        .then(response => {
          const resultHistory = response
          helpers.redisInstance().del('getAllHistories')
          helpers.response(res, resultHistory, res.statusCode, helpers.status.insert, null)
        }).catch(err => {
          helpers.response(res, [], err.statusCode, null, null, err)
        })
    })
  },
  updateHistory: (req, res) => {
    const {
      invoice,
      cashier,
      orders,
      amount
    } = req.body
    const newCheck = [{
        name: 'Invoice',
        value: invoice,
        type: 'string'
      },
      {
        name: 'Cashier',
        value: cashier,
        type: 'string'
      },
      {
        name: 'Orders',
        value: orders,
        type: 'string'
      },
      {
        name: 'Amount',
        value: amount,
        type: 'number'
      }
    ]

    errorHandling(res, newCheck, () => {
      const newHistory = {
        invoice,
        cashier,
        orders,
        amount
      }
      const id = req.params.id
      historyModels.updateHistory(newHistory, id)
        .then(response => {
          const resultHistory = response
          helpers.redisInstance().del('getAllHistories')
          helpers.response(res, resultHistory, res.statusCode, helpers.status.update, null)
        }).catch(err => {
          helpers.response(res, [], err.statusCode, null, null, err)
        })
    })
  },
  deleteHistory: (req, res) => {
    const id = req.params.id
    historyModels.deleteHistory(id)
      .then(response => {
        const resultHistory = response
        helpers.redisInstance().del('getAllHistories')
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