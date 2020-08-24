const connection = require('../config/db.config')
const queryHelper = require('../helpers/query')

const user = {
  getAllUser: (id, order) => {
    return queryHelper(`SELECT users.id, users.name, email, gender, roleId, image, status, createdAt, updatedAt, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.id != ${id} ORDER BY id ${order}`)
  },
  getUserById: (id) => {
    return queryHelper(`SELECT users.id, users.name, email, gender, roleId, image, status, createdAt, updatedAt, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.id = ${id}`)
  },
  updateUser: (dataUser, id) => {
    return queryHelper(`UPDATE users SET ? WHERE id = ?`, [dataUser, id])
  },
  deleteUser: (id) => {
    return queryHelper(`DELETE FROM users WHERE id = ?`, id)
  },
  register: (newUser) => {
    return queryHelper('INSERT INTO users SET ?', newUser)
  },
  login: (email) => {
    return queryHelper('SELECT * FROM users WHERE email = ?', email)
  },
  checkEmailExist: (email) => {
    return queryHelper('SELECT COUNT(*) AS totalFound FROM users WHERE email = ?', email)
  }
}
module.exports = user