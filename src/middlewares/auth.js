const jwt = require('jsonwebtoken')
const helpers = require('../helpers/helpers')

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) return helpers.response(res, [], 403, null, null, 'No token provided')
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
    if (err) return helpers.response(res, [], 401, null, null, 'Token invalid')
    req.userId = decoded.data.id
    req.roleId = decoded.data.roleId
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (req.roleId === 1) {
    next()
    return
  }
  return helpers.response(res, [], 403, null, null, 'Only admins can access')
}

const isCashierOrAdmin = (req, res, next) => {
  if (req.roleId === 2 || req.roleId === 1) {
    next()
    return
  }
  return helpers.response(res, [], 403, null, null, 'Only admin and cashier can access')
}

const auth = {
  verifyToken,
  isAdmin,
  isCashierOrAdmin
}

module.exports = auth
