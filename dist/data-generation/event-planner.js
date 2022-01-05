export var generateDates = function (year, month) {
    return new Date(year, month, Math.floor(Math.random() * 30), Math.floor(Math.random() * 24), Math.floor(Math.random() * 59), 0);
};
export var EVENT_TYPES = ['BIRTHDAY', 'WEDDING', 'DIVORCE', 'RETIREMENT'];
export var generateEventTypes = function () {
    var index = Math.floor(EVENT_TYPES.length * Math.random());
    return EVENT_TYPES[index];
};
//# sourceMappingURL=event-planner.js.map