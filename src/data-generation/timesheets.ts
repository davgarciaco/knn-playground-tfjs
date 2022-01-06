import * as fs from 'fs';
import { Timesheet } from '../dto/timesheet.dto';
import { Employee } from '../dto/employee.dto';

const DEPARTMENTS = ['ACCOUNTING', 'ENGINEERING', 'HR', 'SALES'];
const IDs = new Array(30).fill(0).map( (id, index) => index);
const EMPLOYEES = IDs.map(id => {
    return new Employee(id, DEPARTMENTS[Math.floor(Math.random()*DEPARTMENTS.length)]);
})
const workWeekLength = 5;
const WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

var newData: Array<Timesheet> = new Array<Timesheet>();
const randomTime = (min, max) => { 
    return Math.floor(Math.random() * (max - min) + min);
} 
for (let i = 0; i < EMPLOYEES.length; i++) {
    let _employee = EMPLOYEES[i];
    WEEK.forEach( day => {
        let start = randomTime(6, 10); //6AM to 9AM
        let end = randomTime(14, 18); //2PM to 5PM
        let _timeSheet = new Timesheet(_employee, start, end, day);
        newData.push(_timeSheet);
    })
}

console.table(newData);
const PATH = './generated-data/'
fs.writeFileSync(PATH + "Timesheets.json", JSON.stringify(newData, null, 3));
console.log("DONE")
process.exit();