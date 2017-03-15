'use strict';
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const port = process.env.port || 3000;

require('dotenv').config();

const app = express();


app.listen(port);
console.log(`The magic happens on port ${port}`);
