"use strict";
exports.__esModule = true;
exports.generateEventTypes = exports.EVENT_TYPES = exports.generateDates = void 0;
var generateDates = function (year, month) {
    return new Date(year, month, Math.floor(Math.random() * 30), Math.floor(Math.random() * 24), Math.floor(Math.random() * 59), 0);
};
exports.generateDates = generateDates;
exports.EVENT_TYPES = ['BIRTHDAY', 'WEDDING', 'DIVORCE', 'RETIREMENT'];
var generateEventTypes = function () {
    var index = Math.floor(exports.EVENT_TYPES.length * Math.random());
    return exports.EVENT_TYPES[index];
};
exports.generateEventTypes = generateEventTypes;
