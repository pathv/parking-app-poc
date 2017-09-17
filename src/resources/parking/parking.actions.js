'use strict';

var helper = require('./parking.helper.js');

module.exports = {
    v1: {
        getParkingResults: getParkingResults
    }
};

function getParkingResults(req, res, next) {
    var parkingResponse = {};

    var swid = req.query.swid;

    var carCoordinates = [parseFloat(req.query.latitude), parseFloat(req.query.longitude)];

    var parkingResponse = helper.getCarPosition(carCoordinates);

    res.send(200, parkingResponse);
    return next();

}
