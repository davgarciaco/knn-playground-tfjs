import { start } from 'repl';
import { Employee } from './employee.dto';
export class Timesheet {
    EMPLOYEE: Employee;
    START: number;
    END: number;
    DAY: string;
    constructor(employee: Employee, start: number, end: number, day: string){
        this.EMPLOYEE = employee;
        this.START = start;
        this.END = end;
        this.DAY = day;
    }
    get employeeID(){
        return this.EMPLOYEE.ID;
    }
    get department(){
        return this.EMPLOYEE.DEPARTMENT;
    }
    get hours(): number {
        return this.END-this.START;
    }
}