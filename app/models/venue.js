'use strict';
const mongoose = require('mongoose');

let venueSchema = mongoose.Schema({
    going: [],
    venueid: String
});

module.exports = mongoose.model('Venue', venueSchema);