const { DataTypes, Model } = require('sequelize')

const sequelize = require('../sequelize')
class Game extends Model {
  isStarted() {
    return !!this.startedAt
  }

  isFinished() {
    return !!this.winnerId
  }
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    startedAt: DataTypes.DATE,
    dieSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6
    },
    startingHP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    }
  },
  { sequelize, modelName: 'Game' }
)

module.exports = Game
