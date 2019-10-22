const Classes = require("../models/Classes");

module.exports = {
  async getClassNames(request, response) {
    const classNames = await Classes.getClassNames();
    return response.json(classNames);
  },
  async getAllClasses(request, response) {
    const saints = await Classes.getAllClasses();
    return response.json(saints);
  },
  async getClassSaints(request, response) {
    const data = await Classes.getClassSaints(request.params.class);

    if (data) {
      return response.json(data);
    } else {
      return response
        .status(404)
        .json({ message: `${request.params.class} not found` });
    }
  },
  async getSaint(request, response) {
    const saint = await Classes.getSaint(
      request.params.class,
      request.params.id
    );

    if (saint) {
      return response.json(saint);
    } else {
      return response
        .status(404)
        .json({ message: `${request.params.class} not found` });
    }
  }
};
