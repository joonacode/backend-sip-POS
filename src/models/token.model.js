const queryHelper = require('../helpers/query')

const token = {
  sendToken: (token) => {
    return queryHelper('INSERT INTO token SET ?', token)
  },
  findToken: (token) => {
    return queryHelper('SELECT * FROM token WHERE token = ?', token)
  },
  activateAccount: (id) => {
    return queryHelper('UPDATE users SET status = 1 WHERE id = ?', id)
  },
  deleteToken: (token) => {
    return queryHelper('DELETE FROM token WHERE token = ?', token)
  }
}
module.exports = token