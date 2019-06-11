const express = require('express');
const router = express.Router();
const index = require('../Http/controller/indexController.js');
const recordAudio = require('../Http/controller/recordController.js');
const optionDetect = require('../Http/controller/optionController.js');
router.get('/upfile', index.index);

router.post('/uploadfile', index.uploadFile);
router.get('/record', recordAudio.recordAudio);
router.get('/', optionDetect.optionDetect);
router.post('/loadRecord', recordAudio.fileAudioRecord);
module.exports = router;