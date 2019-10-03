const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const csv = require('csv-parser')

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/dist/`));

const PORT = process.env.PORT || 8080;

const content = {};

const genders = ['Male', 'Female'];
const bloodTypes = ['A', 'B', 'AB', 'O', 'Ikhor'];

const noSchemeImage = "https://firebasestorage.googleapis.com/v0/b/saint-seiya-api-accd5.appspot.com/o/others%2Fno-scheme.png?alt=media&token=fe50ebdc-d7d6-4238-81c4-c49a48c2c40a";

const fileNames = [
  "affiliations",
  "artists",
  "attackers",
  "attacks",
  "characters",
  "classes",
  "cloths",
  "debuts",
  "familyMembers",
  "kinships",
  "masters",
  "midias",
  "midias",
  "nationality",
  "places",
  "ranks",
  "representations",
  "saints"
];

const getData = fileName => {
  content[fileName] = [];

  fs.createReadStream(`data/${fileName}.csv`)
    .pipe(csv())
    .on('data', data => {
      content[fileName].push(data);
    });
}

fileNames.forEach(name => getData(name));

const buildSaint = saintId => {
    const saintObject = content.saints.find(saint => saint.id === saintId);
    const saint = Object.assign({}, saintObject);

    const characterId = saint.character;

    content.characters.forEach(character => {
        if (character.id === saint.character) {
            saint.character = character.name;
        }
    });

    content.cloths.forEach(cloth => {
        if (cloth.id === saint.cloth) {
            saint.cloth = cloth.name;
        }
    });

    content.classes.forEach(classInformations => {
        if (classInformations.id === saint.class) {
            saint.class = classInformations.name;
        }
    });

    content.ranks.forEach(rank => {
        if (rank.id === saint.rank) {
            saint.rank = rank.name;
        }
    });

    content.affiliations.forEach(affiliation => {
        if (affiliation.id === saint.affiliation) {
            saint.affiliation = affiliation.name;
        }
    });

    saint.scheme = saint.scheme || noSchemeImage;

    content.artists.find(artist => {
        if (saint.artist === artist.id) {
            saint.artist = artist.name;
        }
    });

    saint.attacks = [];
    content.attackers.forEach(attacker => {
        if (attacker.character === characterId) {
            const attack = content.attacks.find(attack => attack.id === attacker.attack);
            saint.attacks.push(attack.name);
        }
    });

    content.representations.forEach(representation => {
        if (representation.id === saint.representation) {
            saint.representation = representation.name;
        }
    });

    return saint;
}

const buildCloths = character => {
  const cloths = [];
  content.saints.forEach(saint => {
    if (saint.character === character.id) {
      const cloth = buildSaint(saint.id);

      delete cloth.character;

      cloths.push(cloth);
    }
  });
  return cloths;
}

const buildCharacter = characterObject => {
    const character = Object.assign({}, characterObject);

    character.gender = genders[character.gender];

    content.nationality.forEach(nationality => {
        if (nationality.num_code === character.nationality) {
            character.nationality = nationality.nationality;
        }

        if (nationality.num_code === character.training) {
            const place = content.places.find(place => place.id === character.place);
            character.training = place ? `${place.name}, ${nationality.en_short_name}` : nationality.en_short_name;
        }
    });

    delete character.place;

    character.master = [];
    character.apprentice = [];
    content.masters.forEach(master => {
        if (master.apprentice === character.id) {
            content.characters.forEach(masterInformations => {
                if (masterInformations.id === master.master) {
                    character.master.push(masterInformations.name);
                }
            });
        }

        if (master.master === character.id) {
            content.characters.forEach(apprentice => {
                if (apprentice.id === master.apprentice) {
                    character.apprentice.push(apprentice.name);
                }
            });
        }
    });

    character.attacks = [];
    content.attackers.forEach(attacker => {
        if (attacker.character === character.id) {
            const attack = content.attacks.find(attack => attack.id === attacker.attack);
            character.attacks.push(attack.name);
        }
    });

    character.height = character.height ? `${character.height}cm` : "";
    character.weight = character.weight ? `${character.weight}kg` : "";

    character.family = [];
    content.familyMembers.forEach(family => {
        if (family.character === character.id) {
            const member = content.characters.find(character => character.id === family.member);
            const kinship = content.kinships.find(kinship => kinship.id === family.memberKinship);
            character.family.push(`${member.name} (${kinship.name})`);
        }

        if (family.member === character.id) {
            const member = content.characters.find(character => character.id === family.character);
            const kinship = content.kinships.find(kinship => kinship.id === family.characterKinship);
            character.family.push(`${member.name} (${kinship.name})`);
        }
    });

    const bloodType = bloodTypes[character.blood];

    character.blood = bloodType ? bloodType : "";

    content.debuts.forEach(debut =>  {
        if (debut.id === character.debut) {
            content.midias.forEach(midia => {
                if (midia.id === debut.midia) {
                    character.debut = `${midia.name}: ${debut.name}`;
                }
            });
        }
    });

    character.cloth = buildCloths(character);

    character.image = character.cloth.length ? character.cloth[0].scheme : noSchemeImage;

    return character;
}

const buildResponse = (success, message, data = {}) => ({ success, message, data });

app.get('/debuts', (req, res) => {
  const debuts = content.debuts.map(debutObject => {
    const debut = Object.assign({}, debutObject);

    const midia = content.midias.find(midia => midia.id === debut.midia);

    debut.midia = midia.name;

    return debut;
  });

  res.status(200).json(buildResponse(true, 'Debuts founded', debuts));
});

app.get('/debuts/:id', (req, res) => {
  const debutObject = content.debuts.find(debut => debut.id === req.params.id);

  if (debutObject) {
    const debut = Object.assign({}, debutObject);

    const midia = content.midias.find(midia => midia.id === debut.midia);

    debut.midia = midia.name;

    const characters = content.characters.filter(character => character.debut === debut.id);

    const data = { debut, characters: characters.map(character => buildCharacter(character)) };

    res.status(200).json(buildResponse(true, 'Debut founded', data));
  } else {

    res.status(404).json(buildResponse(false, 'Debut not found'));
  }
});

app.get('/representations/:type', (req, res) => {
  const { type } = req.params;

  const representations = content.representations.filter(representation => {
    if (representation.id.includes(type)) {
      const saints = content.saints.filter(saint => representation.id === saint.representation);

      representation.saints = saints ? saints.map(saint => buildSaint(saint.id)) : [];

      return representation;
    }
  });

  const typeName = type.charAt(0).toUpperCase() + type.replace('-', ' ').substring(1);

  if (representations.length) {
    let data = {};

    if (type.includes('constellation')) {
      data = { modernConstellations: representations.slice(0, 88), otherConstellations: representations.slice(88) };
    } else if (type.includes('evil-star')) {
      data = { destinyStars: representations.slice(0, 108), otherCases: representations.slice(108) };
    } else {
      data = { representations };
    }

    res.status(200).json(buildResponse(true, `${typeName} founded`, data));
  } else {
    res.status(404).json(buildResponse(false, `${typeName} not found`));
  }
});

app.get('/representations/:type/:id', (req, res) => {
  const { type } = req.params;

  const id = `${req.params.type}-${req.params.id}`;

  const representation = content.representations.find(representation => representation.id === id);

  const typeName = type.charAt(0).toUpperCase() + type.replace('-', ' ').substring(1);

  if (representation) {
    const saints = content.saints.filter(saint => saint.representation === representation.id);

    const data = { representation, saints: saints.map(saint => buildSaint(saint.id)) };

    res.status(200).json(buildResponse(true, `Characters from ${typeName} founded`, data));
  } else {
    res.status(404).json(buildResponse(false, `${typeName} not found`));
  }
});

app.get('/characters', (req, res) => {
  const characters = content.characters.map(character => buildCharacter(character));

  res.status(200).json(buildResponse(true, 'Characters founded', characters));
});

app.get('/characters/:id', (req, res) => {
  const character = content.characters.find(character => character.id === req.params.id);

  if (character) {
    res.status(200).json(buildResponse(true, 'Character founded', { character: buildCharacter(character) }));
  } else {
    res.status(404).json(buildResponse(false, 'Character not found'));
  }
});

app.get('/classes', (req, res) => res.status(200).json(buildResponse(true, 'Classes founded', content.classes)));

app.get('/:class', (req, res) => {
  let cls = content.classes.find(cls => req.params.class === cls.name.toLowerCase().replace(' ', '-'));

  if (cls) {
    const saints = [];

    content.saints.forEach(saint => {
      if (saint.class === cls.id) {
        saints.push(buildSaint(saint.id));
      }
    });

    res.status(200).json(buildResponse(true, `${ cls.name } founded`, saints));
  } else {
    res.status(404).json(buildResponse(false, `${req.params.class} not found`));
  }
});

app.get('/:class/:id', (req, res) => {
  const cls = content.classes.find(cls => req.params.class === cls.name.toLowerCase().replace(' ', '-'));

  const saint = content.saints.find(saint => saint.class === cls.id && saint.id === req.params.id);

  if (saint) {
    res.status(200).json(buildResponse(true, `${cls.name} founded`, { saint: buildSaint(saint.id) }));
  } else {
    res.status(404).json(buildResponse(false, `${req.params.class} not found`));
  }
});

app.get('*', (req, res) => res.sendFile(path.join(`$/dist/$/index.html`)));

app.use((req, res, next) => res.status(404).json(buildResponse(false, `${req.url} not found`)));

app.use((err, req, res, next) => res.status(500).json(buildResponse(false, String(err))));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
