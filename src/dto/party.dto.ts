export class Party {
    date = new Date();
    guests: number = 100;
    type = '';
    constructor(type, date?: Date) {
        this.type = type;
        date ? this.date = date : null;
        this.guests = Math.floor(Math.random()*this.guests);
    }
}