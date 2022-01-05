import * as tf from '@tensorflow/tfjs';
import { tidy } from '@tensorflow/tfjs';
export var convertDataToTensors = function (data, inputKey, labelKey) {
    var tensors = tf.tidy(function () {
        tf.util.shuffle(data);
        //conversion
        var inputs = data.map(function (d) { return d[inputKey]; });
        var labels = data.map(function (d) { return d[labelKey]; });
        var inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        var labelTensor = tf.tensor(labels, [labels.length, 1]);
        //Min-max ranges
        var inputMax = inputTensor.max();
        var inputMin = inputTensor.min();
        var labelMax = labelTensor.max();
        var labelMin = labelTensor.min();
        var normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        var normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax: inputMax,
            inputMin: inputMin,
            labelMax: labelMax,
            labelMin: labelMin,
        };
    });
    return tidy;
};
//# sourceMappingURL=tensor.conversion.js.map