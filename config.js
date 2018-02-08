module.exports ={
  PORT: {
    test: 3090,
    development: 3000,
    production: process.env.PORT
  },
  DB_URI: process.env.DB_URI || require('./config.secret').DB[process.env.NODE_ENV]
}