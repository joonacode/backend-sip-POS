const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')
var jwt = require('jsonwebtoken')

let tokenList = {}
const auth = {
  register: (req, res) => {
    const {
      name,
      email,
      gender,
      password,
      passwordVerification
    } = req.body

    const newCheck = [{
        name: 'Name',
        value: name,
        type: 'string',
      },
      {
        name: 'Gender',
        value: gender,
        type: 'string',
      },
      {
        name: 'Email',
        value: email,
        type: 'string',
      },
      {
        name: 'Password',
        value: password,
        type: 'string',
      },
      {
        name: 'Password verification',
        value: passwordVerification,
        type: 'string',
      },
    ]

    errorHandling(res, newCheck, async () => {
      let isEmailExist
      try {
        const resEmail = await userModels.checkEmailExist(email)
        isEmailExist = resEmail[0].totalFound
      } catch (error) {
        helpers.response(res, [], error.statusCode, null, null, error)
      }
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email,
      )
      if (!checkEmail) {
        return helpers.response(res, [], 400, null, null, ['Invalid email'])
      } else if (isEmailExist > 0) {
        return helpers.response(res, [], 400, null, null, [
          'Email already exist',
        ])
      } else if (gender !== 'm' && gender !== 'f') {
        return helpers.response(res, [], 400, null, null, ['Invalid gender'])
      } else if (password.length < 6) {
        return helpers.response(res, [], 400, null, null, [
          'Password min 6 character',
        ])
      } else if (passwordVerification.length < 6) {
        return helpers.response(res, [], 400, null, null, [
          'Verification Password min 6 character',
        ])
      } else if (password !== passwordVerification) {
        return helpers.response(res, [], 400, null, null, [
          'Password not match with verification',
        ])
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const newUser = {
              name,
              email,
              gender,
              password: hash,
              roleId: 2,
              status: 1,
            }
            userModels
              .register(newUser)
              .then((response) => {
                helpers.redisInstance().del('getAllUsers')

                userModels
                  .getUserById(response.insertId)
                  .then((responseUser) => {
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
              .catch((error) => {
                helpers.response(res, [], error.statusCode, null, null, error)
              })
          })
        })
      }
    })
  },
  login: (req, res) => {
    const {
      email,
      password
    } = req.body
    const newCheck = [{
        name: 'Email',
        value: email,
        type: 'string',
      },
      {
        name: 'Password',
        value: password,
        type: 'string',
      },
    ]
    errorHandling(res, newCheck, () => {
      userModels
        .login(email)
        .then((response) => {
          const user = response[0]
          if (user.status !== 1) {
            return helpers.response(res, [], 404, null, null, [
              'Your account is disabled',
            ])
          }
          bcrypt.compare(password, user.password, function (
            err,
            result,
          ) {
            if (result) {
              helpers.redisInstance().del('getDetailUser')
              const newResponse = {
                id: user.id,
                roleId: user.roleId
              }
              var token = jwt.sign({
                  data: newResponse,
                },
                process.env.PRIVATE_KEY, {
                  expiresIn: '3h',
                },
              )
              const refreshToken = jwt.sign({
                  data: newResponse,
                },
                process.env.PRIVATE_KEY_REFRESH_TOKEN, {
                  expiresIn: '1d',
                },
              )
              newResponse.refreshToken = refreshToken
              newResponse.token = token
              tokenList[refreshToken] = newResponse

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
    })
  },
  refreshToken: (req, res) => {
    const {
      refreshToken,
      id,
      roleId
    } = req.body

    if (refreshToken && refreshToken in tokenList) {
      const newDataJwt = {
        id,
        roleId
      }
      const token = jwt.sign({
          data: newDataJwt,
        },
        process.env.PRIVATE_KEY, {
          expiresIn: '3h',
        },
      )
      const refreshToken = jwt.sign({
          data: newDataJwt,
        },
        process.env.PRIVATE_KEY_REFRESH_TOKEN, {
          expiresIn: '1d',
        },
      )
      const response = {
        ...newDataJwt,
        refreshToken,
        token,
      }
      tokenList[refreshToken] = response

      helpers.response(res, response, res.statusCode, 'Token Update', null)
    } else {
      res.status(404).send('Invalid request')
    }
  },
}

module.exports = auth