const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')


const checkForm = {
  checkProduct: (req, res, next) => {
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
  },
  checkCategory: (req, res, next) => {
    const {
      name
    } = req.body
    const newCheck = [{
      name: 'Name',
      value: name,
      type: 'string'
    }]
    errorHandling(res, newCheck, () => {
      next()
    })
  },
  checkHistory: (req, res, next) => {
    const {
      invoice,
      idUser,
      orders,
      purchaseAmount,
      initialPrice,
      priceAmount,
      amount
    } = req.body
    const newCheck = [{
        name: 'Invoice',
        value: invoice,
        type: 'string'
      },
      {
        name: 'Cashier',
        value: idUser,
        type: 'number'
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
      },
      {
        name: 'Purchase amount',
        value: purchaseAmount,
        type: 'string'
      },
      {
        name: 'Initial price',
        value: initialPrice,
        type: 'string'
      },
      {
        name: 'Price amount',
        value: priceAmount,
        type: 'string'
      }
    ]
    errorHandling(res, newCheck, () => {
      next()
    })
  },
  checkSendInvoiceToEmail: (req, res, next) => {
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
        name: 'Email',
        value: email,
        type: 'string'
      },
      {
        name: 'Amount',
        value: amount,
        type: 'number'
      },
      {
        name: 'Purchase amount',
        value: purchaseAmount,
        type: 'string'
      },
      {
        name: 'Initial price',
        value: initialPrice,
        type: 'string'
      },
      {
        name: 'Price amount',
        value: priceAmount,
        type: 'string'
      }
    ]
    errorHandling(res, newCheck, () => {
      next()
    })
  },
  checkRegister: (req, res, next) => {
    const {
      name,
      email,
      gender,
      password,
      roleId,
      passwordVerification,
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
      } else if (roleId !== '2' && roleId !== '3') {
        return helpers.response(res, [], 400, null, null, ['Invalid role'])
      } else if (passwordVerification.length < 6) {
        return helpers.response(res, [], 400, null, null, [
          'Verification Password min 6 character',
        ])
      } else if (password !== passwordVerification) {
        return helpers.response(res, [], 400, null, null, [
          'Password not match with verification',
        ])
      } else {
        next()

      }
    })
  },
  checkLogin: (req, res, next) => {
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
      next()
    })
  },
  checkUpdateUser: (req, res, next) => {
    const {
      name,
      email,
      oldEmail,
      gender,
      roleId,
      status
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
      } else if (roleId !== '1' && roleId !== '2' && roleId !== '3') {
        return helpers.response(res, [], 400, null, null, ['Invalid role'])
      } else if (gender !== 'm' && gender !== 'f') {
        return helpers.response(res, [], 400, null, null, ['Invalid gender'])
      } else if (status !== '0' && status !== '1') {
        return helpers.response(res, [], 400, null, null, ['Invalid status'])
      } else {
        next()
      }
    })
  },
  checkAddUser: (req, res, next) => {
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
      } else if (roleId !== '1' && roleId !== '2' && roleId !== '3') {
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
        next()
      }
    })
  },
  checkChangePassword: (req, res, next) => {
    const {
      oldPassword,
      newPassword,
      verifyNewPassword
    } = req.body
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
    errorHandling(res, newCheck, async () => {
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
        next()
      }
    })
  },
  checkSetting: (req, res, next) => {
    const {
      appName,
      isOpen,
      dayOne,
      dayTwo,
      clockOne,
      clockTwo,
      address
    } = req.body
    const newCheck = [{
        name: 'App Name',
        value: appName,
        type: 'string',
      },
      {
        name: 'Setting Day One',
        value: dayOne,
        type: 'string',
      },
      {
        name: 'Setting Day Two',
        value: dayTwo,
        type: 'string',
      },
      {
        name: 'Setting Clock One',
        value: clockOne,
        type: 'string',
      },
      {
        name: 'Setting Clock Two',
        value: clockTwo,
        type: 'string',
      },
      {
        name: 'Address',
        value: address,
        type: 'string',
      },
    ]
    errorHandling(res, newCheck, () => {
      next()
    })
  },

}

module.exports = checkForm