'use strict';

var geofencingData = require('./geofencingData');
var _ = require('lodash');

module.exports = {
    fetchParkingAreas: fetchParkingAreas,
    fetchCharacterAreas: fetchCharacterAreas,
    fetchRows: fetchRows
};

function fetchParkingAreas() {
    var parkingAreas = geofencingData.parkingAreas;
    return parkingAreas;
}

function fetchCharacterAreas(parkingAreaName) {
    var charachterAreas = _.filter(geofencingData.characterAreas, {'parkingAreaName': parkingAreaName});
    return charachterAreas;
}

function fetchRows(parkingAreaName, characterAreaName) {
    var rows = _.filter(geofencingData.rows, {
        'parkingAreaName': parkingAreaName,
        'characterAreaName': characterAreaName
    });
    return rows;
}
