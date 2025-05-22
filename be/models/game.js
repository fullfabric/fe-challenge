const { last } = require("lodash");
const { GameIsFullError } = require("./game/errors");

class Game extends Model {
  constructor() {
    super();

    this.turns = [];
    this.attacker = null;
    this.defender = null;
    this.winner = null;
  }

  addPlayer(player) {
    if (this.attacker === null) {
      this.attacker = player;
    } else if (this.defender === null) {
      this.defender = player;
    } else {
      throw new GameIsFullError()
    }
  }

  currentRole(player) {
    if (this.attacker === player) {
      return "attacker";
    } else if (this.defender === player) {
      return "defender";
    }
  }

  currentTurn() {
    return last(this.turns);
  }

  isFinished() {
    return !!this.winner;
  }
}

module.exports = Game;