"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var party_dto_1 = require("../dto/party.dto");
var event_planner_1 = require("../data-generation/event-planner");
var fs = require("fs");
var newData = new Array(300);
for (var i = 0; i < newData.length; i++) {
    newData[i] = new party_dto_1.Party((0, event_planner_1.generateEventTypes)(), (0, event_planner_1.generateDates)(2020, 2));
}
console.table(newData);
var PATH = './generated-data/';
fs.writeFileSync(PATH + "Party.json", JSON.stringify(newData, null, 3));
console.log("DONE");
process.exit();
