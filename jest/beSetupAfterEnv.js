require('../be/models')
const sequelize = require('../be/sequelize')

beforeAll(async () => {
  try {
    await sequelize.sync()
  } catch (err) {
    console.error(err)
    throw err
  }
})

afterAll(async () => {
  await sequelize.close()
})
