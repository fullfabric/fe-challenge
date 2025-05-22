const { DataTypes, Model } = require('sequelize')
const sequelize = require('../sequelize')

class Player extends Model {
  constructor(name, { initialHealth = 20 } = {}) {
    super()
  }

  isAlive() {
    return this.health > 0
  }

  takeDamage(damage) {
    this.health -= damage
  }
}

Player.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    }
  },
  { sequelize, modelName: 'Player' }
)

module.exports = Player
