const { DataTypes, Model } = require('sequelize')

const sequelize = require('../sequelize')
const { isNil } = require('lodash')
const { PlayerAlreadyPlayed, PlayerNotPartOfTurn } = require('./turn/errors')

class Turn extends Model {
  roll(playerId, dieSize) {
    if (this.attackerId === playerId) {
      if (!isNil(this.attackRoll)) throw new PlayerAlreadyPlayed(playerId)
      return (this.attackRoll = rollDie(dieSize))
    }

    if (this.defenderId === playerId) {
      if (!isNil(this.defenseRoll)) throw new PlayerAlreadyPlayed(playerId)
      return (this.defenseRoll = rollDie(dieSize))
    }

    throw new PlayerNotPartOfTurn(playerId, this.id)
  }

  isFinished() {
    return !isNil(this.attackRoll) && !isNil(this.defenseRoll)
  }
}

Turn.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    attackRoll: DataTypes.INTEGER,
    defenseRoll: DataTypes.INTEGER
  },
  { sequelize, modelName: 'Turn' }
)

module.exports = Turn

function rollDie(dieSize) {
  return Math.floor(Math.random() * dieSize) + 1
}
