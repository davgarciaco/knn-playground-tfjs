import * as tf from '@tensorflow/tfjs';
import { DataStorage, min } from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Party } from './dto/party.dto';
import { EVENT_TYPES } from './data-generation/event-planner';
import { getKNNClassifier, getMobileNetModule } from './ML/knn';
import { Timesheet } from './dto/timesheet.dto';

export const DEPARTMENTS = ['ACCOUNTING', 'ENGINEERING', 'HR', 'SALES'];
const workWeekLength = 5;
export const WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

const data: Array<Timesheet> = require('../generated-data/Timesheets.json');
console.table(data);
const accountingValues = data.filter((d: Timesheet) => {
    console.log(d);
    //TODO: Figure out why the getters aren't working 
    return d.EMPLOYEE.DEPARTMENT == DEPARTMENTS[0]
}).map(d => ({
    x: d.START,
    y: WEEK.indexOf(d.DAY)
}));
const engineeringValues = data.filter((d: Timesheet) => d.EMPLOYEE.DEPARTMENT == DEPARTMENTS[1]).map(d => ({
    x: d.START,
    y: WEEK.indexOf(d.DAY)
}));
const hrValues = data.filter((d: Timesheet) => d.EMPLOYEE.DEPARTMENT == DEPARTMENTS[2]).map(d => ({
    x: d.START,
    y: WEEK.indexOf(d.DAY)
}));
const salesValues = data.filter((d: Timesheet) => d.EMPLOYEE.DEPARTMENT == DEPARTMENTS[3]).map(d => ({
    x: d.START,
    y: WEEK.indexOf(d.DAY)
}));
//Create Scatter Plot
var dataByDepartment: Array<any> = [[],[],[],[]];
const knnClassifier = getKNNClassifier();

const init = async () => {
    tfvis.render.table({ name: 'Data', tab: 'Data' }, {
        headers: ['Department', 'Start', 'End'],
        values: data.map((d: Timesheet) => [d.EMPLOYEE.DEPARTMENT, d.START, d.END])
    });
    tfvis.show.valuesDistribution({ name: 'Distribution: Hours' }, tf.tensor2d(data.map((d: Timesheet) => {
        let { START, END } = d;
        return [START, END];
    })));
    tfvis.render.scatterplot({ name: 'Timesheet Data', 'tab': 'ScatterPlot' }, {
        values: [accountingValues, engineeringValues, hrValues, salesValues],
        series: [DEPARTMENTS[0], DEPARTMENTS[1], DEPARTMENTS[2], DEPARTMENTS[3]]
    },
        {
            xLabel: 'Start Times (Hr)',
            yLabel: 'Day (Mon-Fri)'
        });
    
    data.map( (d: Timesheet)  => {
        let dept = d.EMPLOYEE.DEPARTMENT;
        let index = DEPARTMENTS.indexOf(dept);
        let { START, END } = d;
        let WORKED = END - START;
        dataByDepartment[index].push([START, END, index, WORKED]);
    });
    console.log(dataByDepartment);
    //Get Averages 
    var Variances = [];
    var Averages = dataByDepartment.map(e => {
        let avgStart, avgEnd, avgDay, avgHours = 0;
        let varianceStart, varianceEnd, varianceHours = 0;
        let starts: Array<number> = e.map(i => i[0]);
        let ends = e.map(i => i[1]);
        let days = e.map(i => i[2]);
        let worked = e.map(i => i[3]);
        avgStart = starts.reduce( (a,b) => a+b)/starts.length;
        avgEnd = ends.reduce( (a,b) => a+b)/ends.length;
        avgDay = days.reduce( (a,b) => a+b)/days.length;
        avgHours = worked.reduce( (a,b) => a+b)/worked.length;
        //Variances
        varianceStart = e.map(i => (i[0] - avgStart)^2).reduce( (a,b) => a+b)/starts.length
        varianceEnd = e.map(i => (i[1] - avgEnd)^2).reduce( (a,b) => a+b)/ends.length
        varianceHours = e.map(i => (i[3] - avgHours)^2).reduce( (a,b) => a+b)/worked.length
        Variances.push([varianceStart, varianceEnd, varianceHours]);
        return [avgStart, avgEnd, avgHours];
    })
    tfvis.render.heatmap({name: 'Timesheet', tab: 'Heatmap'},
    {
        values: Averages,
        xTickLabels: DEPARTMENTS,
        yTickLabels: ['Start', 'End', 'Hours']
    });
    tfvis.render.heatmap({name: 'Timesheet (Variance)', tab: 'Heatmap'},
    {
        values: Variances,
        xTickLabels: DEPARTMENTS,
        yTickLabels: ['Start', 'End', 'Hours']
    });
    //databydept values => [START, END, index, WORKED]
    knnClassifier.setClassifierDataset( {
    [DEPARTMENTS[0]]: tf.tensor2d(dataByDepartment[0].map(d => [d[0], d[3]])),
    [DEPARTMENTS[1]]: tf.tensor2d(dataByDepartment[1].map(d => [d[0], d[3]])),
    [DEPARTMENTS[2]]: tf.tensor2d(dataByDepartment[2].map(d => [d[0], d[3]])),
    [DEPARTMENTS[3]]: tf.tensor2d(dataByDepartment[3].map(d => [d[0], d[3]]))
});
}

init();
const getPrediction = () => {
    //@ts-ignore
    let hours: string = document.getElementById('hours').value;
    //@ts-ignore
    let guests: string = document.getElementById('guests').value;
    //@ts-ignore
    let kValue: string = document.getElementById('kValue').value ?? 1;
    if (hours != null && guests != null) {
        let intHours = parseInt(hours);
        let intGuests = parseInt(guests);
        let intKValue = parseInt(kValue);
        let results = knnClassifier.predictClass(tf.tensor2d([[intGuests, intHours]]), intKValue);

        results.then(res => {
            console.log("RESULTS: ", res);
            let { confidences } = res;
            let confSpread = Object.keys(confidences);
            let resultStr = confSpread.map(conf => {
                let percentage = confidences[conf] * 100;
                return `${conf} with ${percentage}% confidence`;
            })
            document.getElementById('prediction-results').innerHTML = "RESULTS: \n" + resultStr.join('\n');
        });
    }
    else {
        document.getElementById('prediction-results').innerHTML = `RESULTS: Failed Inputs ${hours ?? 'null'} hours and ${guests ?? null} guests `;
    }
}

global.getPrediction = getPrediction;


global.timesheetInit = init;