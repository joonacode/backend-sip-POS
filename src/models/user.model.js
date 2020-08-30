const connection = require('../config/db.config')
const queryHelper = require('../helpers/query')

const user = {
  getAllUser: (id, order) => {
    return queryHelper(`SELECT users.id, users.name, email, gender, roleId, image, status, createdAt, updatedAt, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.id != ${id} ORDER BY id ${order}`)
  },
  getUserById: (id) => {
    return queryHelper(`SELECT users.*, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.id = ${id}`)
  },
  updateUser: (dataUser, id) => {
    return queryHelper('UPDATE users SET ? WHERE id = ?', [dataUser, id])
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM histories WHERE idUser = ?', id, (error, result) => {
        if (!error) {
          if (result.length > 0) {
            const objError = {
              code: 'ERR_HAS_BEEN_USED',
              statusCode: 400,
              sqlMessage: 'This user is related to history, please disable the account for an alternative'
            }
            reject(objError)
          } else {
            resolve(queryHelper('DELETE FROM users WHERE id = ?', id))
          }
        } else {
          const objError = {
            ...error,
            statusCode: 500
          }
          reject(objError)
        }
      })
    })
  },
  register: (newUser) => {
    return queryHelper('INSERT INTO users SET ?', newUser)
  },
  login: (email) => {
    return queryHelper('SELECT users.*, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.email = ?', email)
  },
  checkEmailExist: (email) => {
    return queryHelper('SELECT COUNT(*) AS totalFound FROM users WHERE email = ?', email)
  }
}
module.exports = user