const { DataTypes, Model } = require('sequelize')

const Game = require('./game')
const Player = require('./player')
const sequelize = require('../sequelize')

class Turn extends Model {
  attack() {
    if (this.attack) throw new Error('Attack already made')
    this.attack = Math.floor(Math.random() * 6) + 1
  }

  defend() {
    if (this.defend) throw new Error('Defend already made')
    this.defend = Math.floor(Math.random() * 6) + 1
  }
}

Turn.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    gameId: {
      type: DataTypes.UUID,
      references: {
        model: Game,
        key: 'id'
      }
    },
    attackerId: {
      type: DataTypes.UUID,
      references: {
        model: Player,
        key: 'id'
      }
    },
    defenderId: {
      type: DataTypes.UUID,
      references: {
        model: Player,
        key: 'id'
      }
    },
    attackRoll: DataTypes.INTEGER,
    defenseRoll: DataTypes.INTEGER
  },
  { sequelize, modelName: 'Turn' }
)

module.exports = Turn
