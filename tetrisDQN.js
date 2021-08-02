import * as tf from '@tensorflow/tfjs';


async function loadModel() {
    let model = await tf.loadLayersModel('http://127.0.0.1:8080/model/model.json');
    return model;
}

// 建立并编译模型.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

// 生成一些用于训练的数据.
const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

// 用 fit() 训练模型.
await model.fit(xs, ys, {epochs: 1000});

// 用 predict() 推理.
model.predict(tf.tensor2d([[5]], [1, 1])).print(); 