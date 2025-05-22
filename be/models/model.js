const { v4: uuidv4 } = require('uuid');

class Model {
  constructor() {
    this.id = uuidv4();
  }
}

module.exports = Model;