const Debuts = require("../models/Debuts");

module.exports = {
  async getDebuts(request, response) {
    const debuts = await Debuts.getDebuts();
    return response.json(debuts);
  },
  async getDebut(request, response) {
    const debut = await Debuts.getDebut(request.params.id);
    return debut
      ? response.json(debut)
      : response.status(404).json({ message: "Debut not found" });
  }
};