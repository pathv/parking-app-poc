'use strict';

var express = require('express');
var app = express();
var config = require('./core/config');

var initRoutes = require('./routes');

initRoutes(app);

var port = config.port;

app.listen(port, function() {
    console.log("Listening on " + port);
});