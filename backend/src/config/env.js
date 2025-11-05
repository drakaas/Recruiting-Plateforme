const path = require('path')

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'dev',
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '..', '..', 'app.db'),
}

module.exports = ENV






