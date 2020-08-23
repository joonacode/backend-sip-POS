const jwt = require('jsonwebtoken')
const helpers = require('../helpers/helpers')

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
    if (err) return helpers.response(res, [], 403, null, null, 'invalid token')
    next()
  });
}

module.exports = auth