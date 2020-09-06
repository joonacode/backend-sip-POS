const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')

const checkForm = {
  checkInsertProduct: (req, res, next) => {
    const {
      name,
      price,
      idCategory
    } = req.body

    const newCheck = [{
        name: 'Name',
        value: name,
        type: 'string'
      },
      {
        name: 'Price',
        value: price,
        type: 'number'
      },
      {
        name: 'Category',
        value: idCategory,
        type: 'number'
      }
    ]
    errorHandling(res, newCheck, () => {
      next()
    })
  }
}

module.exports = checkForm