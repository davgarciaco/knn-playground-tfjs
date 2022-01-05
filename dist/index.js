var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { EVENT_TYPES } from './data-generation/event-planner';
import { getKNNClassifier } from './ML/knn';
var data = require('../generated-data/Party.json');
console.table(data);
var birthdayValues = data.filter(function (d) { return d.type == EVENT_TYPES[0]; }).map(function (d) { return ({
    x: d.guests,
    y: new Date(d.date).getHours()
}); });
var weddingValues = data.filter(function (d) { return d.type == EVENT_TYPES[1]; }).map(function (d) { return ({
    x: d.guests,
    y: new Date(d.date).getHours()
}); });
//Create Scatter Plot
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        tfvis.render.table({ name: 'Data', tab: 'Data' }, {
            headers: ['Time', 'Guests', 'Type'],
            values: data.map(function (d) { return [d.date, d.guests, d.type]; })
        });
        return [2 /*return*/];
    });
}); };
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
tfvis.show.valuesDistribution({ name: 'Distribution: Hours' }, tf.tensor1d(data.map(function (d) {
    var date = d.date;
    var time = new Date(date).getHours() ? new Date(date).getHours() : null;
    return time;
})));
tfvis.render.scatterplot({ name: 'Event Data', 'tab': 'ScatterPlot' }, {
    values: [birthdayValues, weddingValues],
    series: [EVENT_TYPES[0], EVENT_TYPES[1]]
}, {
    xLabel: 'Guests',
    yLabel: 'Time (Hrs)'
});
init();
var knnClassifier = getKNNClassifier();
/* BDAY DATA */
var birthdayData = data.filter(function (d) { return d.type == EVENT_TYPES[0]; }).map(function (d) { return [new Date(d.date).getHours(), d.guests]; });
var bdayExample = tf.tensor2d(birthdayData);
/* WEDDING DATA */
var weddingData = data.filter(function (d) { return d.type == EVENT_TYPES[1]; }).map(function (d) { return [new Date(d.date).getHours(), d.guests]; });
var weddingExample = tf.tensor2d(weddingData);
//Training 
// knnClassifier.addExample(bdayExample, EVENT_TYPES[0]);
// knnClassifier.addExample(weddingExample, EVENT_TYPES[1]);
knnClassifier.setClassifierDataset((_a = {}, _a['BIRTHDAY'] = bdayExample, _a));
//Predictions
knnClassifier.predictClass(tf.tensor2d([[5, 4]]), 2).then(function (d) {
    console.log("RESULTS", d);
});
//# sourceMappingURL=index.js.map