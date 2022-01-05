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
//Create Scatter Plot
const init = async () => {
    tfvis.render.table({name: 'Data', tab: 'Data'}, {
        headers: ['Time','Guests' , 'Type'],
        values: data.map( (d: Party) => [d.date, d.guests,d.type])
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
tfvis.show.valuesDistribution({ name: 'Distribution: Hours' }, tf.tensor1d(data.map( (d: Party) => {
    let { date } = d;
    let time = new Date(date).getHours() ? new Date(date).getHours() : null;
    return time;
})));
tfvis.render.scatterplot({name: 'Event Data', 'tab': 'ScatterPlot'}, {
    values: [birthdayValues, weddingValues],
    series: [EVENT_TYPES[0], EVENT_TYPES[1]]
},
{
    xLabel: 'Guests',
    yLabel: 'Time (Hrs)'
});
init();

const knnClassifier = getKNNClassifier();
/* BDAY DATA */
var birthdayData: Array<Array<number>> = data.filter( (d: Party) => d.type == EVENT_TYPES[0]).map( (d: Party) => [ new Date(d.date).getHours(), d.guests]);
var bdayExample: tf.Tensor<any> = tf.tensor2d(birthdayData);
/* WEDDING DATA */
var weddingData: Array<Array<number>> = data.filter( (d: Party) => d.type == EVENT_TYPES[1]).map( (d: Party) => [ new Date(d.date).getHours(), d.guests]);
var weddingExample: tf.Tensor<any> = tf.tensor2d(weddingData);
//Training 
// knnClassifier.addExample(bdayExample, EVENT_TYPES[0]);
// knnClassifier.addExample(weddingExample, EVENT_TYPES[1]);
knnClassifier.setClassifierDataset(
    {['BIRTHDAY']: bdayExample,
['WEDDING']: weddingExample}
)
//Predictions


const getPrediction = () => {
    //@ts-ignore
    let hours: string = document.getElementById('hours').value;
    //@ts-ignore
    let guests: string = document.getElementById('guests').value;
    if(hours != null && guests != null){
        let intHours = parseInt(hours);
        let intGuests = parseInt(guests);
       let results = knnClassifier.predictClass(tf.tensor2d([[intGuests,intHours]]), 2);

        results.then(res => {
            let { label } = res;
            console.log("RESULTS: ", res);
            let { confidences } = res;
            let percentage = confidences[label] * 100;
            document.getElementById('prediction-results').innerHTML = `RESULTS: ${label} with ${percentage}% confidence`;
        });
    }
    else{
        document.getElementById('prediction-results').innerHTML = `RESULTS: Failed Inputs ${hours ?? 'null'} hours and ${guests ?? null} guests `;
    }
}

global.getPrediction = getPrediction;