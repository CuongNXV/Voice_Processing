const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('formidable');

let optionDetect = (req, res) => {
    res.render('optionDetect');
};



exports.optionDetect = optionDetect;