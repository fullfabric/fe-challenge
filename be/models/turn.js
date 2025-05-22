class Turn extends Model {
  constructor() {
    super();

    this.attacker = null;
    this.defender = null;
    this.attack = null;
    this.defend = null;
  }

  attack() {
    if (this.attack) throw new Error("Attack already made");
    this.attack = Math.floor(Math.random() * 6) + 1;
  }

  defend() {
    if (this.defend) throw new Error("Defend already made");
    this.defend = Math.floor(Math.random() * 6) + 1;
  }
}

module.exports = Turn;