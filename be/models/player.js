const Model = require("./model");

class Player extends Model {
  constructor(name, { initialHealth = 20 } = {}) {
    super();

    this.name = name;
    this.health = initialHealth;
  }

  isAlive() {
    return this.health > 0;
  }

  takeDamage(damage) {
    this.health -= damage;
  }
}

module.exports = Player;