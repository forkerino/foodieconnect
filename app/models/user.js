'use strict';
const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    facebook : {
        name    : String,
        token 	: String,
        id      : String,
        pic 	: String,
    } 
});

module.exports = mongoose.model('User', userSchema);