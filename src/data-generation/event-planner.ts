export const generateDates = (year: number, month: number): Date => {
    return new Date(year, month,
        Math.floor(Math.random()*30), 
        Math.floor(Math.random()*24),
        Math.floor(Math.random()*59), 
        0);
}

export const EVENT_TYPES = ['BIRTHDAY', 'WEDDING', 'DIVORCE', 'RETIREMENT'];

export const generateEventTypes = () => {
    let index = Math.floor(EVENT_TYPES.length * Math.random())
    return EVENT_TYPES[index];
}