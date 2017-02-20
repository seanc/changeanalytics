const config = require('./config')
module.exports = require('rethinkdbdash')(config.database)
