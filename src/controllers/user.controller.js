const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')
const fs = require('fs')

const user = {
  getAllUser: (req, res) => {
    const id = req.userId
    if (!id) return helpers.response(res, [], 400, null, null, ['Id not found'])
    const order = req.query.order || 'DESC'
    userModels
      .getAllUser(id, order)
      .then((response) => {
        const newResponse = response
        helpers
          .redisInstance()
          .setex('getAllUsers', 60 * 60 * 12, JSON.stringify(newResponse))
        helpers.response(res, newResponse, 200, helpers.status.found, [])
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  getAllMember: (req, res) => {
    userModels
      .geAllMember()
      .then((response) => {
        const newResponse = response
        helpers
          .redisInstance()
          .setex('getAllMember', 60 * 60 * 12, JSON.stringify(newResponse))
        helpers.response(res, newResponse, 200, helpers.status.found, [])
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  getUserById: (req, res) => {
    const id = req.params.id
    userModels
      .getUserById(id)
      .then((response) => {
        const newRes = response[0]
        delete newRes.password
        helpers
          .redisInstance()
          .setex('getDetailUser', 60 * 60 * 12, JSON.stringify(newRes))
        helpers.response(res, newRes, 200, helpers.status.found, [])
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  updateProfile: (req, res) => {
    const { name, oldImage } = req.body
    const id = req.params.id
    let image
    if (req.file) {
      image = req.file.path
    }
    if (req.uploadErrorMessage) {
      return helpers.response(res, [], 400, null, null, [
        req.uploadErrorMessage,
      ])
    }
    const newCheck = [
      {
        name: 'Name',
        value: name,
        type: 'string',
      },
    ]

    errorHandling(res, newCheck, async () => {
      let finalImage
      if (image) {
        if (oldImage === '' || oldImage === 'null' || oldImage === null) {
          finalImage = `${process.env.BASE_URL}/${image}`
        } else {
          finalImage = `${process.env.BASE_URL}/${image}`
          const pathDelete = oldImage.replace(process.env.BASE_URL, '.')
          fs.unlinkSync(pathDelete, (error) => {
            if (error) throw error
          })
        }
      } else {
        finalImage = oldImage
      }
      const newUser = {
        name,
        image: finalImage,
      }
      userModels
        .updateUser(newUser, id)
        .then((response) => {
          helpers.redisInstance().del('getDetailUser')
          userModels
            .getUserById(id)
            .then((responseUser) => {
              const resultUser = responseUser[0]
              delete resultUser.password
              helpers.response(
                res,
                resultUser,
                res.statusCode,
                helpers.status.update,
                null,
              )
            })
            .catch((err) => {
              helpers.response(res, [], err.statusCode, null, null, err)
            })
        })
        .catch((error) => {
          helpers.response(
            res,
            [],
            error.statusCode,
            null,
            null,
            error.errno === 1452 ? ['Role not found'] : error,
          )
        })
    })
  },
  updateUser: async (req, res) => {
    const { name, email, oldImage, gender, roleId, status } = req.body

    const id = req.params.id
    let image
    if (req.file) image = req.file.path
    if (req.uploadErrorMessage)
      return helpers.response(res, [], 400, null, null, [
        req.uploadErrorMessage,
      ])

    let finalImage
    if (image) {
      if (oldImage === '' || oldImage === 'null' || oldImage === null) {
        finalImage = `${process.env.BASE_URL}/${image}`
      } else {
        finalImage = `${process.env.BASE_URL}/${image}`
        const pathDelete = oldImage.replace(process.env.BASE_URL, '.')
        fs.unlinkSync(pathDelete, (error) => {
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
      status,
    }
    userModels
      .updateUser(newUser, id)
      .then((response) => {
        helpers.redisInstance().del('getAllUsers')
        if (roleId === '3') helpers.redisInstance().del('getAllMember')
        userModels
          .getUserById(id)
          .then((responseUser) => {
            const resultUser = responseUser[0]
            delete resultUser.password
            helpers.response(
              res,
              resultUser,
              res.statusCode,
              helpers.status.update,
              null,
            )
          })
          .catch((err) => {
            helpers.response(res, [], err.statusCode, null, null, err)
          })
      })
      .catch((error) => {
        helpers.response(
          res,
          [],
          error.statusCode,
          null,
          null,
          error.errno === 1452 ? ['Role not found'] : error,
        )
      })
  },
  deleteUser: (req, res) => {
    const id = req.params.id
    userModels
      .deleteUser(id)
      .then((response) => {
        const resultUser = response
        resultUser.userId = Number(id)
        helpers.redisInstance().del('getAllUsers')
        helpers.redisInstance().del('getAllMember')
        helpers.response(
          res,
          resultUser,
          res.statusCode,
          helpers.status.delete,
          null,
        )
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  addUser: (req, res) => {
    const { name, email, gender, roleId, status, password } = req.body

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const newUser = {
          name,
          email,
          gender,
          password: hash,
          roleId,
          status,
        }
        userModels
          .register(newUser)
          .then((response) => {
            helpers.redisInstance().del('getAllUsers')
            if (roleId === '3') helpers.redisInstance().del('getAllMember')

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
  },
  changePassword: (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { id } = req.params

    userModels
      .getUserById(id)
      .then((response) => {
        const newResponse = response[0]
        bcrypt.compare(oldPassword, newResponse.password, function (
          err,
          result,
        ) {
          if (result) {
            if (oldPassword === newPassword) {
              return helpers.response(res, [], 400, null, null, [
                'New password must different with old password',
              ])
            } else {
              bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(newPassword, salt, function (err, hash) {
                  const passwordUpdate = {
                    password: hash,
                  }
                  userModels
                    .updateUser(passwordUpdate, id)
                    .then((resUser) => {
                      helpers.response(
                        res,
                        resUser,
                        200,
                        'Password successfully updated',
                        null,
                      )
                    })
                    .catch((err) => {
                      helpers.response(res, [], err.statusCode, null, null, err)
                    })
                })
              })
            }
          } else {
            helpers.response(res, [], 404, null, null, ['Old password wrong'])
          }
        })
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
}

module.exports = user
