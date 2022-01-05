import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
// Create the classifier.
export const getKNNClassifier = () => knnClassifier.create();

export const getMobileNetModule = () => mobilenetModule;