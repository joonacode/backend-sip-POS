const queryHelper = require('../helpers/query')

const history = {
  getAllHistory: () => {
    return queryHelper('SELECT * FROM histories')
  },
  insertHistory: (newHistory) => {
    return queryHelper('INSERT INTO histories SET ?', newHistory)
  },
  updateHistory: (newHistory, id) => {
    return queryHelper('UPDATE histories SET ? WHERE id = ?', [newHistory, id])
  },
  deleteHistory: (id) => {
    return queryHelper('DELETE FROM histories WHERE id = ?', id)
  },
  getHistoryById: (id) => {
    return queryHelper('SELECT * FROM histories WHERE id = ?', id)
  }
}

module.exports = history
