const { DataTypes, Model } = require('sequelize')
const sequelize = require('../sequelize')

class Player extends Model {
  isAlive() {
    return this.hp > 0
  }

  takeDamage(damage) {
    this.hp -= damage
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
