class GameIsFullError extends Error {
  constructor() {
    super('The game is full (all players have been added)')
    this.name = 'GameIsFullError'
  }
}

module.exports = {
  GameIsFullError
}
