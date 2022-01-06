"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timesheet = void 0;
var Timesheet = /** @class */ (function () {
    function Timesheet(employee, start, end, day) {
        this.EMPLOYEE = employee;
        this.START = start;
        this.END = end;
        this.DAY = day;
    }
    Object.defineProperty(Timesheet.prototype, "employeeID", {
        get: function () {
            return this.EMPLOYEE.ID;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timesheet.prototype, "department", {
        get: function () {
            return this.EMPLOYEE.DEPARTMENT;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timesheet.prototype, "hours", {
        get: function () {
            return this.END - this.START;
        },
        enumerable: false,
        configurable: true
    });
    return Timesheet;
}());
exports.Timesheet = Timesheet;
