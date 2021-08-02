import * as tf from '@tensorflow/tfjs'

(async ()=>{
    
    const model = await tf.loadLayersModel('http://127.0.0.1:8080/model/model.json');
    
    console.log("s");
    
})()