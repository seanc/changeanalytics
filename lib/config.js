const config = require('rc')('change', {
  token: '',
  prefix: 'name ',
  database: {
    host: 'localhost',
    port: 28015,
    db: 'changeanalytics'
  }
})

module.exports = config
