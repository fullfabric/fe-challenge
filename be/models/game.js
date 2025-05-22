const { last } = require('lodash')
const { DataTypes, Model } = require('sequelize')

const Player = require('./player')
const { GameIsFullError } = require('./game/errors')

const sequelize = require('../sequelize')
class Game extends Model {
  addPlayer(player) {
    if (this.attacker === null) {
      this.attacker = player
    } else if (this.defender === null) {
      this.defender = player
    } else {
      throw new GameIsFullError()
    }
  }

  currentRole(player) {
    if (this.attacker === player) {
      return 'attacker'
    } else if (this.defender === player) {
      return 'defender'
    }
  }

  currentTurn() {
    return last(this.turns)
  }

  isFinished() {
    return !!this.winner
  }
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
    winnerId: {
      type: DataTypes.UUID,
      references: {
        model: Player,
        key: 'id'
      }
    }
  },
  { sequelize, modelName: 'Game' }
)

module.exports = Game
