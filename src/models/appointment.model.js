'use strict'

const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    date: Date,                                                 //populate
    animal: {type: mongoose.Schema.ObjectId, ref:'Animal'},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    status: String

});

module.exports = mongoose.model('Appointment', appointmentSchema);