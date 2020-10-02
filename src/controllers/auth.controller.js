const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const userModels = require('../models/user.model')
const tokenModels = require('../models/token.model')
var jwt = require('jsonwebtoken')

const auth = {
  register: async (req, res) => {
    const {
      name,
      email,
      gender,
      password,
      roleId
    } = req.body

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const newUser = {
          name,
          email,
          gender,
          password: hash,
          roleId,
          status: 2,
        }
        userModels
          .register(newUser)
          .then((response) => {
            var token = jwt.sign({
                data: response.insertId,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '3h',
              },
            )

            helpers.redisInstance().del('getAllUsers')
            if (roleId === '3') helpers.redisInstance().del('getAllMember')

            const mailinfo = {
              from: 'joonacode@gmail.com',
              to: email,
              subject: 'Verify Email Sip POS',
              html: `<p>
                    Click this link to <strong>activate</strong> your account: <a href="${process.env.BASE_URL_FRONTEND}/verify-account?token=${token}" target="_blank">Activate</a>
                  </p>
                  <small>link expires in 3 hours</small>`,
            }
            helpers.transporter(mailinfo, () => {
              userModels
                .getUserById(response.insertId)
                .then((responseUser) => {
                  tokenModels
                    .sendToken({
                      token,
                      idUser: response.insertId,
                      type: 1
                    })
                    .then((resToken) => console.log('token ok'))
                  const resultUser = responseUser[0]
                  delete resultUser.password
                  helpers.response(
                    res,
                    resultUser,
                    res.statusCode,
                    helpers.status.insert,
                    null,
                  )
                })
                .catch((err) => {
                  helpers.response(res, [], err.statusCode, null, null, err)
                })
            })
          })
          .catch((error) => {
            helpers.response(res, [], 400, null, null, error)
          })
      })
    })
  },
  login: (req, res) => {
    const {
      email,
      password
    } = req.body
    userModels
      .login(email)
      .then((response) => {
        const user = response[0]
        if (user.status === 0) {
          return helpers.response(res, [], 404, null, null, [
            'Your account is disabled',
          ])
        } else if (user.status === 2) {
          return helpers.response(res, [], 404, null, null, [
            'Your account has not been activated, please check your email to activate',
          ])
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            helpers.redisInstance().del('getDetailUser')
            const newResponse = {
              id: user.id,
              roleId: user.roleId,
            }
            var token = jwt.sign({
                data: newResponse,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '5h',
              },
            )
            newResponse.token = token
            if (user.roleId === 3) helpers.redisInstance().del('getMyHistories')
            helpers.redisInstance().del('getAllUsers')
            helpers.response(
              res,
              newResponse,
              res.statusCode,
              'Login success',
              null,
            )
          } else {
            helpers.response(res, [], 404, null, null, [
              'Wrong email or password',
            ])
          }
        })
      })
      .catch((error) => {
        helpers.response(res, [], error.statusCode, null, null, [
          'Wrong email or password',
        ])
      })
  },

  verifyAccount: (req, res) => {
    const token = req.body.token
    if (!token) return helpers.response(res, [], 400, null, null, 'No token provided')
    tokenModels.findToken(token).then(response => {
      const {
        token,
        idUser,
        type
      } = response[0]
      if (type !== 1) return helpers.response(res, [], 400, null, null, 'Wrong token')
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, null, null, 'Token invalid')
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            userModels.deleteUser(idUser).then(deleteUsrResponse => console.log('usr deleted'))
            return helpers.response(res, [], 401, null, null, 'Token expired, please register again')
          } else {
            return helpers.response(res, [], 401, null, null, err)
          }
        } else {
          tokenModels.activateAccount(decoded.data).then(responseActivate => {
            helpers.response(
              res,
              responseActivate,
              res.statusCode,
              'Account successfully activate',
              null,
            )
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
          })
        }
      })
    }).catch(err => {
      helpers.response(res, [], 400, null, null, 'Token invalid')
    })
  },
  forgotPassword: (req, res) => {
    const {
      email
    } = req.body

    userModels
      .getUserByEmail(email)
      .then((responseUser) => {
        const resultUser = responseUser[0]
        tokenModels.checkTokenExist(resultUser.id, 2).then((resToken) => {
            helpers.response(res, [], 400, null, null, ['The link to change the password has been sent to your email'])
          })
          .catch((errToken) => {
            const token = jwt.sign({
                data: email,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '3h',
              },
            )

            const mailinfo = {
              from: 'joonacode@gmail.com',
              to: email,
              subject: 'Reset Password Sip POS',
              html: `
              <center>
              <h1>Request to Reset Your Account Password</h1>
              <p>The link below is only valid for 3 hours after this email has entered your Inbox. If you do not wish to change your account password, do not ignore this email.</p>
              <br>
              <a href="${process.env.URL_RESET_PASSWORD}/?token=${token}" target="_blank">Reset Password</a>
              </center>`,
            }
            helpers.transporter(mailinfo, () => {
              userModels
                .getUserByEmail(email)
                .then((responseUser) => {
                  const resultUser = responseUser[0]
                  delete resultUser.password
                  tokenModels
                    .sendToken({
                      token,
                      idUser: resultUser.id,
                      type: 2
                    })
                    .then((resToken) => console.log(`Token send to ${email}`))
                  helpers.response(
                    res,
                    [email],
                    res.statusCode,
                    'Token successfully sent',
                    null,
                  )
                })
                .catch((err) => {
                  helpers.response(res, [], err.statusCode, null, null, err)
                })
            })
          })
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  verifyTokenPassword: (req, res) => {
    const token = req.body.token
    if (!token) return helpers.response(res, [], 400, null, null, ['No token provided'])
    tokenModels.findToken(token).then(response => {
      const {
        token,
        idUser,
        type
      } = response[0]
      if (type !== 2) return helpers.response(res, [], 400, null, null, ['Wrong Token'])
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, null, null, ['Token invalid'])
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            return helpers.response(res, [], 401, null, null, ['Token expired, please request reset password again'])
          } else {
            return helpers.response(res, [], 401, null, null, err)
          }
        } else {

          helpers.response(
            res,
            ['ok'],
            200,
            'Request reset password ok',
            null,
          )
        }
      })
    }).catch(err => {
      helpers.response(res, [], 400, null, null, ['Token invalid'])
    })
  },
  resetPassword: (req, res) => {
    const {
      password,
      token
    } = req.body
    if (!token) return helpers.response(res, [], 400, null, null, ['No token provided'])
    tokenModels.findToken(token).then(response => {
      const {
        token,
        idUser,
        type
      } = response[0]
      if (type !== 2) return helpers.response(res, [], 400, null, null, ['Wrong Token'])
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, null, null, ['Token invalid'])
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            return helpers.response(res, [], 401, null, null, ['Token expired, please request reset password again'])
          } else {
            return helpers.response(res, [], 401, null, null, err)
          }
        } else {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              userModels.updateUser({
                  password: hash
                }, idUser)
                .then(responseUser => {
                  tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
                  helpers.response(res, ['ok'], 200, 'Password updated', null)
                }).catch(err => {
                  helpers.response(res, [], err.statusCode, null, null, err)
                })
            })
          })
        }
      })
    }).catch(err => {
      helpers.response(res, [], 400, null, null, ['Token invalid'])
    })

  },
}

module.exports = auth