require('./models')

const app = require('./')
const sequelize = require('./sequelize')

module.exports = (async () => {
  await sequelize.sync()

  console.log('Database synced')

  app.listen(8080, () => {
    console.log('Serving API on http://localhost:8080')
  })
})()
