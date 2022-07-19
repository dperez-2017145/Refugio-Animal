'use strict'

const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    name: String,
    description: String,
    age: Number,
    type: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Animal', animalSchema);