'use strict';
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const port = process.env.port || 3000;
const bodyParser = require('body-parser');
const routes = require('./app/routes');
const configPP = require('./config/passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

configPP(passport);

mongoose.connect(process.env.MLABURI);

const app = express();

app.set('view engine', 'ejs');

app.use(session({ secret: 'muhahaha!' }));
app.use(passport.initialize());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(passport.session());
app.use(bodyParser());
app.use(cookieParser());

routes(app, passport);

app.listen(port);
console.log(`The magic happens on port ${port}`);

