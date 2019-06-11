const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');

let index = (req, res) => {
    res.render('index');
}
;
let detectAudio = (filename) => {
    return new Promise((resolve, reject) => {
        let pyProgram = spawn('python3', [path.join(__dirname + '/train_model/predict_audio.py'), filename]);
        pyProgram.stdout.on('data', data => {
            let tmp = new Buffer(String.fromCharCode.apply(null, data));
            let tmp2 = tmp.toString();
            resolve(tmp2);
        });

        pyProgram.stderr.on('data', data => {
            let tmp = String.fromCharCode.apply(null, data);
            let tmp2 = tmp.toString();
            reject(tmp2);
        });

    })
};

let uploadFile = (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/train_model/uploads/' + file.name;
    });

    let filename = ""

    form.on('file', function (name, file){
        filename = file.name;
        detectAudio(filename).then(r => {
            res.json({
                sucesss: true,
                message: r
            })
        })  .catch(e => {
            res.json({
                sucesss: false,
                message: e
            })
        })
    });


};

exports.uploadFile = uploadFile;
exports.index = index;
exports.detectAudio = detectAudio;