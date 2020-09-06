const settingModels = require('../models/setting.model')
const helpers = require('../helpers/helpers')
const setting = {
  getSetting: (req, res) => {
    settingModels.getSetting()
      .then(response => {
        const resultSetting = response[0]
        helpers.redisInstance().setex('getSetting', 60 * 60 * 12, JSON.stringify(resultSetting))
        helpers.response(res, resultSetting, res.statusCode, helpers.status.found, null)
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  },
  updateSetting: (req, res) => {
    const {
      appName,
      isOpen,
      isOpenMessage,
      dayOne,
      dayTwo,
      clockOne,
      clockTwo,
      address,
      showRole
    } = req.body
    const newUpdateData = {
      appName,
      isOpen,
      isOpenMessage,
      dayOne,
      dayTwo,
      clockOne,
      clockTwo,
      address,
      showRole
    }
    settingModels.updateSetting(newUpdateData)
      .then(response => {
        helpers.redisInstance().del('getSetting')
        settingModels.getSetting()
          .then(responseSetting => {
            const newRes = responseSetting[0]
            helpers.response(res, newRes, res.statusCode, helpers.status.update, null)
          }).catch(err => {
            helpers.response(res, [], err.statusCode, null, null, err)
          })
      }).catch(err => {
        helpers.response(res, [], err.statusCode, null, null, err)
      })
  }
}

module.exports = setting