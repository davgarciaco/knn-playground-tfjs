import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
// Create the classifier.
export var getKNNClassifier = function () { return knnClassifier.create(); };
export var getMobileNetModule = function () { return mobilenetModule; };
//# sourceMappingURL=knn.js.map