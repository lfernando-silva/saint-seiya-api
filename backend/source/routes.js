const express = require('express');

const DebutsController = require('./controllers/Debuts.js');
const CharactersController = require('./controllers/Characters.js');
const ClassesController = require('./controllers/Classes.js');

const routes = express.Router();

routes.get('/api/debuts', DebutsController.getDebuts);

routes.get('/api/debut/:id', DebutsController.getDebut);

routes.get('/api/characters', CharactersController.getCharacters);

routes.get('/api/character/:id', CharactersController.getCharacter);

routes.get('/api/curiosities', CharactersController.getCuriosities);

routes.get('/api/class-names', ClassesController.getClassNames);

routes.get('/api/all-classes', ClassesController.getAllClasses);

routes.get('/api/:class', ClassesController.getClassSaints);

routes.get('/api/:class/:id', ClassesController.getSaint);

module.exports = routes;
