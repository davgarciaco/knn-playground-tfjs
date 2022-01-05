"use strict";
exports.__esModule = true;
exports.Party = void 0;
var Party = /** @class */ (function () {
    function Party(type, date) {
        this.date = new Date();
        this.guests = 100;
        this.type = '';
        this.type = type;
        date ? this.date = date : null;
        this.guests = Math.floor(Math.random() * this.guests);
    }
    return Party;
}());
exports.Party = Party;
