var express = require('express');
var app = express();
var fs = require('fs');
var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client.query('SELECT table_schema,table_name FROM HEROKU_POSTGRESQL_JADE;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});


var trump_count = -1;
var hillary_count = -1;

var PORT = process.env.PORT || 6969;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

app.get('/', function (req, res) {
  res.send('<p>Trump: ' + trump_count + '\n\nHillary: '+hillary_count+'</p>');
});

app.get('/gloryhole', function (req, res) {
  res.send(PORT);
});

app.get('/get', function (req, res) {
    res.send(trump_count+","+hillary_count);
});

app.get('/inc', function (req, res) {
    trump_count+=parseInt(req.query.trump);
    hillary_count+=parseInt(req.query.hillary);
    console.log(req.query.trump);
    res.send(trump_count+","+hillary_count);
});

app.listen(PORT, function () {
  console.log('Example app listening on port: ' +PORT);
  setInterval(pushScores, 60000);
});


function saveScores(){
    fs.writeFile("scores.save", trump_count+"\n"+hillary_count);
    console.log("Saved Scores");
};

function pushScores(){
    console.log("save scores here");
};
