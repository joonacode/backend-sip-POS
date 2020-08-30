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
  getUserById: (req, res) => {
    const id = req.params.id
    userModels
      .getUserById(id)
      .then((response) => {
        const newRes = response[0]
        delete newRes.password
        helpers.redisInstance().setex('getDetailUser', 60 * 60 * 12, JSON.stringify(newRes))
        helpers.response(res, newRes, 200, helpers.status.found, [])
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  updateProfile: (req, res) => {
    const {
      name,
      oldImage
    } = req.body
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
    const newCheck = [{
      name: 'Name',
      value: name,
      type: 'string',
    }]

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
  updateUser: (req, res) => {
    const {
      name,
      email,
      oldEmail,
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
      return helpers.response(res, [], 400, null, null, [
        req.uploadErrorMessage,
      ])
    }
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
        name: 'Role',
        value: roleId,
        type: 'number',
      },
    ]

    errorHandling(res, newCheck, async () => {

      let isEmailExist
      if (oldEmail === email) {
        isEmailExist = 0
      } else {
        try {
          const resEmail = await userModels.checkEmailExist(email)
          isEmailExist = resEmail[0].totalFound
        } catch (error) {
          helpers.response(res, [], error.statusCode, null, null, error)
        }
      }


      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email,
      )
      if (!checkEmail) {
        return helpers.response(res, [], 400, null, null, ['Invalid email'])
      } else if (isEmailExist > 0) {
        return helpers.response(res, [], 400, null, null, ['Email exist'])
      } else if (gender !== 'm' && gender !== 'f') {
        return helpers.response(res, [], 400, null, null, ['Invalid gender'])
      } else if (status !== '0' && status !== '1') {
        return helpers.response(res, [], 400, null, null, ['Invalid status'])
      } else {
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
      }
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
    const {
      name,
      email,
      gender,
      roleId,
      status,
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
        name: 'Role',
        value: roleId,
        type: 'string',
      },
      {
        name: 'Status',
        value: status,
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
      } else if (status !== '0' && status !== '1') {
        return helpers.response(res, [], 400, null, null, ['Invalid status'])
      } else if (roleId !== '1' && roleId !== '2') {
        return helpers.response(res, [], 400, null, null, ['Invalid role'])
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
              roleId,
              status
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
  changePassword: (req, res) => {
    const {
      oldPassword,
      newPassword,
      verifyNewPassword
    } = req.body
    const {
      id
    } = req.params
    const newCheck = [{
        name: 'Old password',
        value: oldPassword,
        type: 'string',
      },
      {
        name: 'New password',
        value: newPassword,
        type: 'string',
      },
      {
        name: 'Verify new password',
        value: verifyNewPassword,
        type: 'string',
      },
    ]
    errorHandling(res, newCheck, () => {
      if (newPassword.length < 6) {
        return helpers.response(res, [], 400, null, null, [
          'New password min 6 character',
        ])
      } else if (verifyNewPassword.length < 6) {
        return helpers.response(res, [], 400, null, null, [
          'Verification new password min 6 character',
        ])
      } else if (newPassword !== verifyNewPassword) {
        return helpers.response(res, [], 400, null, null, [
          'New password not match with verification',
        ])
      } else {
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
                        password: hash
                      }
                      userModels.updateUser(passwordUpdate, id).then(resUser => {
                        helpers.response(
                          res,
                          resUser,
                          200,
                          'Password successfully updated',
                          null,
                        )
                      }).catch(err => {
                        helpers.response(res, [], err.statusCode, null, null, err)
                      })
                    });
                  });
                }
              } else {
                helpers.response(res, [], 404, null, null, [
                  'Old password wrong',
                ])
              }
            })
          })
          .catch((err) => {
            helpers.response(res, [], err.statusCode, null, null, err)
          })
      }
    })
  }
}

module.exports = user