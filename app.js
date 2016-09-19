var express = require('express');
var app = express();
var fs = require('fs');
var pg = require('pg');

var trump_count = 0;
var hillary_count = 0;

var trump_count_new = 0;
var hillary_count_new = 0;

var connectionString = process.env.SCORE_DB_URL;
var client = new pg.Client(connectionString);
client.connect();

var PORT = process.env.PORT || 6969;
var HOST = '0.0.0.0';

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

    var to_add_t = 0;
    if (req.query.trump != undefined){
        to_add_t = parseInt(req.query.trump);
    }
    trump_count_new+=to_add_t;
    
    var to_add_h = 0;
    if (!req.query.hillary != undefined){
        to_add_h = parseInt(req.query.hillary);
    }
    hillary_count_new+=to_add_h;

    client.query('INSERT INTO scores(trump,hillary) VALUES($1,$2)', [to_add_t, to_add_h]);

    res.send(trump_count+","+hillary_count);
});

app.listen(PORT, function () {
  console.log('Example app listening on port: ' +PORT);

  maintainDB();

  saveScores();
});


function saveScores(){
  query = client.query('INSERT INTO scores(trump,hillary) VALUES($1,$2)',[trump_count_new,hillary_count_new]);

  trump_count_new = 0;
  hillary_count_new = 0;

  query = client.query('SELECT SUM(trump) FROM scores');
  query.on('row', function(result) {
    console.log("Result TRUMP SUM: " + JSON.stringify(result));
    if (!result){
      return res.send('No data found');
    } else {
        trump_count = parseInt(result.sum)
    }
  });
  query = client.query('SELECT SUM(hillary) FROM scores');
  query.on('row', function(result) {
    console.log("Result HILLARY SUM: " + JSON.stringify(result));
    if (!result){
      return res.send('No data found');
    } else {
        hillary_count = parseInt(result.sum)
    }
  });


  console.log("Saved Scores: " + [trump_count, hillary_count]);

  setInterval(saveScores, 60000);
};

function maintainDB(){

  query = client.query('SELECT SUM(trump) FROM scores');
  query.on('row', function(result) {
    console.log("Result TRUMP SUM: " + JSON.stringify(result));
    if (!result){
      return res.send('No data found');
    } else {
        trump_count = parseInt(result.sum)
    }
  });

  query = client.query('SELECT SUM(hillary) FROM scores');
  query.on('row', function(result) {
    console.log("Result HILLARY SUM: " + JSON.stringify(result));
    if (!result){
      return res.send('No data found');
    } else {
        hillary_count = parseInt(result.sum)
    }
  });

  query.on('drain', function(result){
    query = client.query('TRUNCATE TABLE scores;');
    query = client.query('INSERT INTO scores(trump, hillary) VALUES($1,$2);', [trump_count, hillary_count]);
  });

  setInterval(maintainDB, 60000);
};
