const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')
var jwt = require('jsonwebtoken')
const fs = require('fs')

const user = {

  getAllUser: (req, res) => {
    const id = req.userId
    if (!id) return helpers.response(res, [], 400, null, null, ['Id not found'])
    const order = req.query.order || 'DESC'
    userModels.getAllUser(id, order).then(response => {
      const newResponse = response
      helpers.redisInstance().setex('getAllUsers', 60 * 60 * 12, JSON.stringify(newResponse))
      helpers.response(res, newResponse, 200, helpers.status.found, [])
    }).catch(err => {
      helpers.response(res, [], err.statusCode, null, null, err)
    })
  },
  getUserById: (req, res) => {
    const id = req.params.id
    userModels.getUserById(id).then(response => {
      helpers.response(res, response, 200, helpers.status.found, [])
    }).catch(err => {
      helpers.response(res, [], err.statusCode, null, null, err)
    })
  },
  updateUser: (req, res) => {
    const {
      name,
      email,
      oldImage,
      gender,
      roleId,
      status
    } = req.body
    const id = req.params.id
    let image
    if (req.file) {
      image = req.file.path
    }
    if (req.uploadErrorMessage) {
      return helpers.response(res, [], 400, null, null, [req.uploadErrorMessage])
    }
    const newCheck = [{
        name: 'Name',
        value: name,
        type: 'string'
      },
      {
        name: 'Gender',
        value: gender,
        type: 'string'
      },
      {
        name: 'Role',
        value: roleId,
        type: 'number'
      }
    ]

    errorHandling(res, newCheck, async () => {
      const isEmailExist = 0
      // try {
      //   const resEmail = await userModels.checkEmailExist(email)
      //   isEmailExist = resEmail[0].totalFound
      // } catch (error) {
      //   helpers.response(res, [], error.statusCode, null, null, error)
      // }
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      if (!checkEmail) {
        return helpers.response(res, [], 400, null, null, ['Invalid email'])
      } else if (isEmailExist > 0) {
        return helpers.response(res, [], 400, null, null, ['Email exist'])
      } else if (gender !== 'm' && gender !== 'w') {
        return helpers.response(res, [], 400, null, null, ['Invalid gender'])
      } else if (status !== '0' && status !== '1') {
        return helpers.response(res, [], 400, null, null, ['Invalid status'])
      } else {
        let finalImage
        if (image) {
          if (oldImage === '') {
            finalImage = `${process.env.BASE_URL}/${image}`
          } else {
            finalImage = `${process.env.BASE_URL}/${image}`
            const pathDelete = oldImage.replace(process.env.BASE_URL, '.')
            fs.unlinkSync(pathDelete, error => {
              if (error) throw error
            })
          }

        } else {
          finalImage = oldImage
        }
        const newUser = {
          name,
          email,
          gender,
          image: finalImage,
          roleId,
          status
        }
        userModels.updateUser(newUser, id).then(response => {
          helpers.redisInstance().del('getAllUsers')
          userModels.getUserById(id)
            .then(responseUser => {
              const resultUser = responseUser
              helpers.response(res, resultUser, res.statusCode, helpers.status.update, null)
            }).catch(err => {
              helpers.response(res, [], err.statusCode, null, null, err)
            })
        }).catch(error => {
          helpers.response(res, [], error.statusCode, null, null, error.errno === 1452 ? ['Role not found'] : error)
        })
      }
    })
  },
  deleteUser: (req, res) => {
    const id = req.params.id
    userModels.deleteUser(id)
      .then(response => {
        const resultUser = response
        helpers.response(res, resultUser, res.statusCode, helpers.status.delete, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
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
        type: 'string'
      },
      {
        name: 'Gender',
        value: gender,
        type: 'string'
      },
      {
        name: 'Email',
        value: email,
        type: 'string'
      },
      {
        name: 'Password',
        value: password,
        type: 'string'
      },
      {
        name: 'Password verification',
        value: passwordVerification,
        type: 'string'
      }
    ]

    errorHandling(res, newCheck, async () => {
      let isEmailExist
      try {
        const resEmail = await userModels.checkEmailExist(email)
        isEmailExist = resEmail[0].totalFound
      } catch (error) {
        helpers.response(res, [], error.statusCode, null, null, error)
      }
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      if (!checkEmail) {
        return helpers.response(res, [], 400, null, null, ['Invalid email'])
      } else if (isEmailExist > 0) {
        return helpers.response(res, [], 400, null, null, ['Email already exist'])
      } else if (gender !== 'm' && gender !== 'w') {
        return helpers.response(res, [], 400, null, null, ['Invalid gender'])
      } else if (password.length < 6) {
        return helpers.response(res, [], 400, null, null, ['Password min 6 character'])
      } else if (passwordVerification.length < 6) {
        return helpers.response(res, [], 400, null, null, ['Verification Password min 6 character'])
      } else if (password !== passwordVerification) {
        return helpers.response(res, [], 400, null, null, ['Password not match with verification'])
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const newUser = {
              name,
              email,
              gender,
              password: hash,
              roleId: 2,
              status: 1
            }
            userModels.register(newUser).then(response => {
              helpers.redisInstance().del('getAllUsers')

              userModels.getUserById(response.insertId)
                .then(responseUser => {
                  const resultUser = responseUser
                  helpers.response(res, resultUser, res.statusCode, helpers.status.insert, null)
                }).catch(err => {
                  helpers.response(res, [], err.statusCode, null, null, err)
                })
            }).catch(error => {
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
        type: 'string'
      },
      {
        name: 'Password',
        value: password,
        type: 'string'
      }
    ]
    errorHandling(res, newCheck, () => {
      userModels.login(email).then(response => {
        const newResponse = response[0]
        if (newResponse.status !== 1) {
          return helpers.response(res, [], 404, null, null, ['Your account is disabled'])
        }
        bcrypt.compare(password, newResponse.password, function (err, result) {
          if (result) {
            delete newResponse.password
            delete newResponse.createdAt
            delete newResponse.updatedAt
            var token = jwt.sign({
              data: newResponse
            }, process.env.PRIVATE_KEY, {
              expiresIn: '1d'
            })
            newResponse.token = token
            helpers.response(res, newResponse, res.statusCode, 'Login success', null)
          } else {
            helpers.response(res, [], 404, null, null, ['Wrong email or password'])
          }
        })
      }).catch(error => {
        helpers.response(res, [], error.statusCode, null, null, ['Wrong email or password'])
      })
    })
  }
}

module.exports = user