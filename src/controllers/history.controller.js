const historyModels = require('../models/history.model')
const helpers = require('../helpers/helpers')

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
  getMyHistory: (req, res) => {
    const order = req.query.order
    const id = req.params.id
    historyModels.getMyHistory(order, id)
      .then(response => {
        const resultHistory = response
        helpers.redisInstance().setex('getMyHistories', 60 * 60 * 12, JSON.stringify(resultHistory))
        helpers.response(res, resultHistory, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  insertHistory: (req, res) => {
    const {
      invoice,
      idUser,
      isMember,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    } = req.body

    const newHistory = {
      invoice,
      idUser,
      isMember: isMember ? isMember : 0,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    }
    historyModels.insertHistory(newHistory)
      .then(response => {
        const resultHistory = response
        helpers.redisInstance().del('getAllHistories')
        helpers.redisInstance().del('getMyHistories')
        historyModels.getHistoryById(resultHistory.insertId)
          .then(response => {
            const resultHistory = response[0]
            helpers.response(res, resultHistory, res.statusCode, helpers.status.insert, null)
          }).catch(err => {
            helpers.response(res, [], err.statusCode, null, null, err)
          })
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err.errno === 1452 ? ['Cashier not found'] : err)
      })
  },
  updateHistory: (req, res) => {
    const {
      invoice,
      idUser,
      isMember,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    } = req.body

    const newHistory = {
      invoice,
      idUser,
      isMember: isMember ? isMember : 0,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    }
    const id = req.params.id
    historyModels.updateHistory(newHistory, id)
      .then(response => {
        helpers.redisInstance().del('getAllHistories')
        helpers.redisInstance().del('getMyHistories')
        historyModels.getHistoryById(id)
          .then(response => {
            const resultHistory = response[0]
            helpers.response(res, resultHistory, res.statusCode, helpers.status.update, null)
          }).catch(err => {
            helpers.response(res, [], err.statusCode, null, null, err)
          })
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err.errno === 1452 ? ['Cashier not found'] : err)
      })
  },
  deleteHistory: (req, res) => {
    const id = req.params.id
    historyModels.deleteHistory(id)
      .then(response => {
        const resultHistory = response
        helpers.redisInstance().del('getAllHistories')
        helpers.redisInstance().del('getMyHistories')
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
  },
  sendEmailMember: (req, res) => {
    const {
      invoice,
      cashier,
      email,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    } = req.body

    const arrOrders = orders.split(', ')
    const arrpurchaseAmount = purchaseAmount.split(', ')
    const arrInitialPrice = initialPrice.split(', ')
    const arrPriceAmount = priceAmount.split(', ')
    const newObjOrders = []
    arrOrders.map((order, i) => {
      newObjOrders.push({
        name: order,
        purchaseAmount: arrpurchaseAmount[i],
        initialPrice: arrInitialPrice[i],
        priceAmount: arrPriceAmount[i]
      })
    })
    const emailinfo = {
      from: 'joonacode@gmail.com',
      to: email,
      subject: `Receipt Sip POS #${invoice}`,
      html: `
        <p><strong>Invoice</strong>: #${invoice}</p>
        <p><strong>Cashier</strong>: ${cashier}</p>
        <p><strong>Detail Orders</strong>:</p>
        <table>
          <thead>
            <th>#</th>
            <th>Name</th>
            <th>Initial Price</th>
            <th>Qty</th>
            <th>Total Price</th>
          </thead>
          <tbody>
          ${newObjOrders.map((order, i) => 
            `<tr v-for="(detailOrder, i) in row.item.detailOrders" :key="i">
              <td>${i + 1}</td>
              <td>${order.name}</td>
              <td>Rp. ${helpers.formatNumber(order.initialPrice)}</td>
              <td>${order.purchaseAmount}</td>
              <td>Rp. ${helpers.formatNumber(order.priceAmount)}</td>
            </tr>`
          ).join('')}
            <tr>
              <td colspan="4">Total Payment</td>
              <td>Rp. ${helpers.formatNumber(amount)}</td>
            </tr>
          </tbody>
        </table>
        `,
    }
    helpers.transporter(emailinfo, () => {
      helpers.response(
        res,
        ['Transacation success'],
        200,
        'Email successfully send',
        null,
      )
    })

  },
}

module.exports = history