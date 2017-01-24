const database = require('../lib/database')
const { type } = database

const Change = module.exports = database.createModel('change', {
  id: type.string(),
  guild: type.string(),
  nickname: type.string(),
  username: type.string(),
  from: type.string(),
  createdAt: type.date().default(database.r.now())
})
