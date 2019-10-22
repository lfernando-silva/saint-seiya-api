const { characters, curiosities } = require("../data");

module.exports = {
  async getCharacters() {
    return characters;
  },
  async getCharacter(id) {
    const [character] = characters.filter(c => c.id === id);
    return character;
  },
  async getCuriosities() {
    return curiosities;
  }
};
