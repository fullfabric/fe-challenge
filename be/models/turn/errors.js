class PlayerAlreadyPlayed extends Error {
  constructor(playerId) {
    super(`Player ${playerId} has already played this turn`)
  }
}

class PlayerNotPartOfTurn extends Error {
  constructor(playerId, turnId) {
    super(`Player ${playerId} is not part of turn ${turnId}`)
  }
}

module.exports = { PlayerAlreadyPlayed, PlayerNotPartOfTurn }
