'use strict'
const appoController = require('../controllers/appointment.controller');
const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.get('/testAppointment', appoController.testAppointment);
api.post('/createAppointment', mdAuth.ensureAuth, appoController.createAppointment);
api.get('/getAppointments', mdAuth.ensureAuth, appoController.getAppointments);
api.put('/updateAppointment/:id', mdAuth.ensureAuth, appoController.updateAppointment);
api.put('/updateStatusAppointment/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], appoController.updateStatus);

module.exports = api;   