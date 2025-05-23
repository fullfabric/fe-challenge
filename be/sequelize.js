const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('sqlite::memory:', { logging: false }) // Example for sqlite

// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "path/to/database.sqlite",
// });

module.exports = sequelize
