'use strict';

// Example app from:
// https: //scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
//
// MongoDB interaction with Mongoose:
// http://mongoosejs.com/docs/guide.html


// set up ======================================================================
var express = require('express');

// create our app w/ express
var app = express();

// log requests to the console (express4)
var morgan = require('morgan');

// pull information from HTML POST (express4)
var bodyParser = require('body-parser');

// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');


// configuration ===============================================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to mongoDB (credentials in config/db.js)
mongoose.connect(db.url);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride());

// routes ======================================================================

require('./app/routes')(app); // configure our routes

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

// expose app
exports = module.exports = app;
