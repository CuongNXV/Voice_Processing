const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('formidable');
const ffmpeg =  require('ffmpeg');
const Mp32Wav = require('mp3-to-wav');
const detectAudio = require('./indexController.js');

let recordAudio = (req, res) => {
    res.render('recordAudio');
};
let fileAudioRecord = (req,res) => {
    let form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + "/train_model/data/stringAudio/" + file.name;
        try {
            let process = new ffmpeg(__dirname + "/train_model/data/stringAudio/blob");
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(__dirname + "/train_model/data/mp3/audio.mp3", function (err, file) {
                    if(err)
                    {
                        res.json({
                            success: false,
                            error: err.msg
                        })
                    }
                    else
                    {
                        const mp3towav = new Mp32Wav(__dirname + "/train_model/data/mp3/audio.mp3",__dirname + "/train_model/uploads").exec();
                        let filename = "audio.wav";
                        detectAudio.detectAudio(filename).then(r => {
                            res.json({
                                sucesss: true,
                                file: r
                            });
                            console.log(r);
                        })  .catch(e => {
                            console.log(e);
                            res.json({
                                sucesss: false,
                                error: e
                            })
                        })
                    }
                })
            })
        }
        catch(e)
        {
            res.json({
                success: false,
                err_code: e.code,
                err_msg: e.msg
            })
        }
    });

};
exports.recordAudio = recordAudio;
exports.fileAudioRecord = fileAudioRecord;