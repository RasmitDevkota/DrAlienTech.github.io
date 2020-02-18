var express = require('express');

var app = express();
var server = app.listen(4000, function () {
    console.log('port 4000');
});

app.use(express.static('public'))