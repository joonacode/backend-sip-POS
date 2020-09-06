const queryHelper = require('../helpers/query')

const category = {
  getSetting: () => {
    return queryHelper('SELECT * FROM settings WHERE id = 1')
  },
  updateSetting: (newSetting) => {
    return queryHelper('UPDATE settings SET ? WHERE id = 1', newSetting)
  }
}

module.exports = category