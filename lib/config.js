const config = require('rc')('change', {
  token: '',
  prefix: 'name ',
  database: {
    host: '149.56.0.44',
    port: 28015,
    db: 'changeanalytics'
  }
})

module.exports = config
