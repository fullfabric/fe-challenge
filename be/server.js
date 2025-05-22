require('./models')

const app = require('./')
const sequelize = require('./sequelize')

module.exports = (async () => {
  await sequelize.sync()

  console.log('Database synced')

  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
})()
