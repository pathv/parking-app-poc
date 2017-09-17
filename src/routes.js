'use strict';

var parking = require('./resources/parking/parking.actions');
var config = require('./core/config');

module.exports = function initRoutes(app) {

    var parkingBasePath = config.basePath;

    app.get(parkingBasePath + '/parking', parking.v1.getParkingResults);

    app.get(parkingBasePath + '/health-check', function(req, res) {
        res.send("OK");
    });

};