import * as tf from '@tensorflow/tfjs';
import { min } from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Party } from './dto/party.dto';
import { EVENT_TYPES } from './data-generation/event-planner';
import { getKNNClassifier, getMobileNetModule } from './ML/knn';
const data: Array<Party> = require('../generated-data/Party.json');
console.table(data);
const birthdayValues = data.filter(d => d.type == EVENT_TYPES[0]).map(d => ({
    x: d.guests,
    y: new Date(d.date).getHours()
}));
const weddingValues = data.filter(d => d.type == EVENT_TYPES[1]).map(d => ({
    x: d.guests,
    y: new Date(d.date).getHours()
}));
const divorceValues = data.filter(d => d.type == EVENT_TYPES[2]).map(d => ({
    x: d.guests,
    y: new Date(d.date).getHours()
}));
const retirementValues = data.filter(d => d.type == EVENT_TYPES[3]).map(d => ({
    x: d.guests,
    y: new Date(d.date).getHours()
}));
//Create Scatter Plot
const init = async () => {
    tfvis.render.table({ name: 'Data', tab: 'Data' }, {
        headers: ['Time', 'Guests', 'Type'],
        values: data.map((d: Party) => [d.date, d.guests, d.type])
    })
}
/* UNUSED
// const createModel: any = () => {
//     const model = tf.sequential();

//     // Add a single input layer
//     model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

//     // Add an output layer
//     model.add(tf.layers.dense({ units: 1, useBias: true }));

//     return model;
// }

// const MODEL = createModel();

// tfvis.show.modelSummary({ name: 'Model Summary' }, MODEL);
*/
tfvis.show.valuesDistribution({ name: 'Distribution: Hours' }, tf.tensor1d(data.map((d: Party) => {
    let { date } = d;
    let time = new Date(date).getHours() ? new Date(date).getHours() : null;
    return time;
})));
tfvis.render.scatterplot({ name: 'Event Data', 'tab': 'ScatterPlot' }, {
    values: [birthdayValues, weddingValues, divorceValues, retirementValues],
    series: [EVENT_TYPES[0], EVENT_TYPES[1], EVENT_TYPES[2], EVENT_TYPES[3]]
},
    {
        xLabel: 'Guests',
        yLabel: 'Time (Hrs)'
    });
init();

const knnClassifier = getKNNClassifier();
/* BDAY DATA */
var birthdayData: Array<Array<number>> = data.filter((d: Party) => d.type == EVENT_TYPES[0]).map((d: Party) => [new Date(d.date).getHours(), d.guests]);
var bdayExample: tf.Tensor<any> = tf.tensor2d(birthdayData);
/* WEDDING DATA */
var weddingData: Array<Array<number>> = data.filter((d: Party) => d.type == EVENT_TYPES[1]).map((d: Party) => [new Date(d.date).getHours(), d.guests]);
var weddingExample: tf.Tensor<any> = tf.tensor2d(weddingData);
/* WEDDING DATA */
var divorceData: Array<Array<number>> = data.filter((d: Party) => d.type == EVENT_TYPES[2]).map((d: Party) => [new Date(d.date).getHours(), d.guests]);
var divorceExample: tf.Tensor<any> = tf.tensor2d(divorceData);
/* WEDDING DATA */
var retirementData: Array<Array<number>> = data.filter((d: Party) => d.type == EVENT_TYPES[3]).map((d: Party) => [new Date(d.date).getHours(), d.guests]);
var retirementExample: tf.Tensor<any> = tf.tensor2d(retirementData);
//Training 
// knnClassifier.addExample(bdayExample, EVENT_TYPES[0]);
// knnClassifier.addExample(weddingExample, EVENT_TYPES[1]);
knnClassifier.setClassifierDataset(
    {
        ['BIRTHDAY']: bdayExample,
        ['WEDDING']: weddingExample,
        ['DIVORCE']: divorceExample,
        ['RETIREMENT']: retirementExample
    }
);
//Predictions


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