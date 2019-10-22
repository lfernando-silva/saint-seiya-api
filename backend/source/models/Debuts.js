const { debuts } = require("../data");

module.exports = {
  async getDebuts() {
    return debuts;
  },
  async getDebut(id) {
    const [debut] = debuts.filter(c => c.id === id);
    return debut;
  }
};
