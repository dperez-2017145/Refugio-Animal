'use strict'

const animalController = require('../controllers/animal.controller');
const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.get('/testAnimal', animalController.testAnimal);
api.post('/saveAnimal', [mdAuth.ensureAuth, mdAuth.isAdmin], animalController.saveAnimal);
api.get('/getAnimals', mdAuth.ensureAuth, animalController.getAnimals);
api.get('/getAnimal/:id', mdAuth.ensureAuth, animalController.getAnimal);
api.post('/searchAnimal', mdAuth.ensureAuth, animalController.searchAnimal);
api.put('/updateAnimal/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], animalController.updateAnimal);
api.delete('/deleteAnimal/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], animalController.deleteAnimal);

module.exports = api;