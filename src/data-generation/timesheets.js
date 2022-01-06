"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var timesheet_dto_1 = require("../dto/timesheet.dto");
var employee_dto_1 = require("../dto/employee.dto");
var DEPARTMENTS = ['ACCOUNTING', 'ENGINEERING', 'HR', 'SALES'];
var IDs = new Array(30).fill(0).map(function (id, index) { return index; });
var EMPLOYEES = IDs.map(function (id) {
    return new employee_dto_1.Employee(id, DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)]);
});
var workWeekLength = 5;
var WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
var newData = new Array();
var randomTime = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
var _loop_1 = function (i) {
    var _employee = EMPLOYEES[i];
    WEEK.forEach(function (day) {
        var start = randomTime(6, 10); //6AM to 9AM
        var end = randomTime(14, 18); //2PM to 5PM
        var _timeSheet = new timesheet_dto_1.Timesheet(_employee, start, end, day);
        newData.push(_timeSheet);
    });
};
for (var i = 0; i < EMPLOYEES.length; i++) {
    _loop_1(i);
}
console.table(newData);
var PATH = './generated-data/';
fs.writeFileSync(PATH + "Timesheets.json", JSON.stringify(newData, null, 3));
console.log("DONE");
process.exit();
