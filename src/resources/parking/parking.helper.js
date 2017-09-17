'use strict';

var dao = require('./parking.dao');
var _ = require('lodash');
var NOT_FOUND_MSG = 'Not Found';

module.exports = {
    getCarPosition: getCarPosition
};

function getCarPosition(carCoordinates) {
    var parkingAreaName = getParkingAreaName(carCoordinates);

    var characterAreaName = getCharacterAreaName(parkingAreaName, carCoordinates);

    var rowNumber = getRowNumber(parkingAreaName, characterAreaName, carCoordinates);

    var result = {
        'parkingAreaName': parkingAreaName,
        'characterAreaName': characterAreaName,
        'rowNumber': rowNumber
    };

    return result;
}

function getParkingAreaName(carCoordinates) {
    var parkingAreas = dao.fetchParkingAreas();

    for (var i = 0; i < parkingAreas.length; i++) {
        if (isPointInside(carCoordinates, parkingAreas[i].coordinates)) {
            return parkingAreas[i].parkingAreaName;
        }
    }

    return NOT_FOUND_MSG;
}

function getCharacterAreaName(parkingAreaName, carCoordinates) {
    if (parkingAreaName !== NOT_FOUND_MSG) {
        var characterAreas = dao.fetchCharacterAreas(parkingAreaName);

        for (var i = 0; i < characterAreas.length; i++) {
            if (isPointInside(carCoordinates, characterAreas[i].coordinates)) {
                return characterAreas[i].characterAreaName;
            }
        }
    }
    return NOT_FOUND_MSG;
}

function getRowNumber(parkingAreaName, characterAreaName, carCoordinates) {
    if (parkingAreaName !== NOT_FOUND_MSG && characterAreaName !== NOT_FOUND_MSG) {
        var rows = dao.fetchRows(parkingAreaName, characterAreaName);

        for (var i = 0; i < rows.length; i++) {
            if (isPointInside(carCoordinates, rows[i].coordinates)) {
                return rows[i].rowNumber;
            }
        }

        return findNearestPolygon(carCoordinates, rows).rowNumber;
    }

    return NOT_FOUND_MSG;
}

function isPointInside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}

function findNearestPolygon(carCoordinates, polygons) {
    var minDistance = 0;
    var polygonTracker;
    for (var i = 0; i < polygons.length; i++) {

        var distance = getShortestDistanceFromPolygon(carCoordinates, polygons[i].coordinates);
        if (i == 0) {
            minDistance = distance;
            polygonTracker = i;
        } else if (distance < minDistance) {
            minDistance = distance;
            polygonTracker = i;
        }
    }
    return polygons[polygonTracker];
}

function getShortestDistanceFromPolygon(carCoordinates, polygon) {
    var distanceArr = [];
    for (var i = 0; i < polygon.length - 1; i++) {
        var lineStartCoordinates = polygon[i];
        var lineEndCoordinates = polygon[i + 1];
        var distance = getShortestDistanceFromLine(carCoordinates, lineStartCoordinates, lineEndCoordinates);

        distanceArr.push(distance)
    }
    return _.min(distanceArr);
}

function getShortestDistanceFromLine(carCoordinates, lineStartCoordinates, lineEndCoordinates) {
    var point = {x: carCoordinates[0], y: carCoordinates[1]};
    var lineStart = {x: lineStartCoordinates[0], y: lineStartCoordinates[1]};
    var lineEnd = {x: lineEndCoordinates[0], y: lineEndCoordinates[1]};

    var d = distToSegment(point, lineStart, lineEnd);

    return d;

    function distToSegment(p, v, w) {
        return Math.sqrt(distToSegmentSquared(p, v, w));
    }

    function distToSegmentSquared(p, v, w) {
        var l2 = dist2(v, w);

        if (l2 == 0) return dist2(p, v);

        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

        if (t < 0) return dist2(p, v);
        if (t > 1) return dist2(p, w);

        return dist2(p, {x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y)});
    }

    function dist2(v, w) {
        return sqr(v.x - w.x) + sqr(v.y - w.y);
    }

    function sqr(x) {
        return x * x;
    }
}
