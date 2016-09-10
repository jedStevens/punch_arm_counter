var express = require('express');
var app = express();

var trump_count = 2796
var hillary_count = 7899

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/inct', function (req, res) {
  trump_count += 1;
  res.send('Hello World!');
});
app.get('/inch', function (req, res) {
  hillary_count += 1;
  res.send('Hello World!');
});
app.get('/get', function (req, res) {
  res.send([trump_count, hillary_count]);
});
app.get('/gett', function (req, res) {
  res.send(trump_count);
});
app.get('/geth', function (req, res) {
  res.send(hillary_count);
});

app.listen($PORT, function () {
  console.log('Example app listening on port', $PORT);
});

