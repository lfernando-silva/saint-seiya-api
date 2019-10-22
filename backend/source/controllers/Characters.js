const Characters = require("../models/Characters");

module.exports = {
  async getCharacters(request, response) {
    const characters = await Characters.getCharacters();
    return response.json(characters);
  },
  async getCharacter(request, response) {
    const character = await Characters.getCharacter(request.params.id);
    return character
      ? response.json(character)
      : response.status(404).json({ message: "Character not found" });
  },
  async getCuriosities(request, response) {
    const curiosities = await Characters.getCuriosities();
    return response.json(curiosities);
  }
};
