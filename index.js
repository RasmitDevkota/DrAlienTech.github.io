var express = require('express');
var socket = require('soc')

var app = express();
var server = app.listen(4000, function () {
    console.log('port 4000');
});

app.use(express.static('public'));