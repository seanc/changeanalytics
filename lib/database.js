const config = require('./config')
module.exports = require('thinky')(config.database)
