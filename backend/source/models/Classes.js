const { classes, constellations, evilStars, saints } = require("../data");

const getSaints = classParam =>
  saints.filter(s => classParam === s.class.toLowerCase().replace(" ", "-"));

module.exports = {
  async getClassNames() {
    return classes;
  },
  async getAllClasses() {
    return saints;
  },
  async getClassSaints(classParam) {
    if (classParam === "constellations") {
      const modernConstellations = constellations.slice(0, 88);
      const otherConstellations = constellations.slice(88);
      return { modernConstellations, otherConstellations };
    }

    if (classParam === "evil-stars") {
      const modernConstellations = evilStars.slice(0, 108);
      const otherConstellations = evilStars.slice(108);
      return { modernConstellations, otherConstellations };
    }

    return getSaints(classParam);
  },
  async getSaint(classParam, classId) {
    if (classParam.includes("constellation")) {
      const [constellation] = constellations.filter(c => c.id === classId);
      return constellation;
    }

    if (classParam.includes("constellation")) {
      const [evilStar] = evilStars.filter(c => c.id === classId);
      return evilStar;
    }

    const [saint] = getSaints(classParam).filter(c => c.id === classId);
    return saint;
  }
};
