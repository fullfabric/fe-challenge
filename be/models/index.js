const Game = require('./game')
const Player = require('./player')
const Turn = require('./turn')

Game.hasMany(Player, { as: 'players', foreignKey: 'gameId' })
Player.belongsTo(Game, { as: 'game' })

Game.belongsTo(Player, { as: 'winner', foreignKey: 'winnerId' })

Game.hasMany(Turn, { as: 'turns', foreignKey: 'gameId' })
Turn.belongsTo(Game, { as: 'game' })

Turn.belongsTo(Player, { as: 'attacker', foreignKey: 'attackerId' })
Turn.belongsTo(Player, { as: 'defender', foreignKey: 'defenderId' })

module.exports = {
  Game,
  Player,
  Turn
}
