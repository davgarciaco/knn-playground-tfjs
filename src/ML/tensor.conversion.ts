import * as tf from '@tensorflow/tfjs';
import { tidy } from '@tensorflow/tfjs';

export const convertDataToTensors = (data: Array<any>, inputKey: string, labelKey: string): any => {
let tensors = tf.tidy( () => {
    tf.util.shuffle(data);

    //conversion
    const inputs = data.map(d => d[inputKey]);
    const labels = data.map(d => d[labelKey]);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor(labels, [labels.length, 1]);

    //Min-max ranges
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();

    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
  return tidy;
}