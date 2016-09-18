var express = require('express');
var app = express();
var fs = require('fs');
var pg = require('pg');


var trump_count = 0;
var hillary_count = 0;

var connectionString = process.env.SCORE_DB_URL;
var client = new pg.Client(connectionString);
client.connect();

var PORT = process.env.PORT || 6969;
var HOST = '0.0.0.0';

app.get('/', function (req, res) {

  var query = client.query('SELECT * FROM scores');
  query.on('row', function(result) {
    console.log("Result: " + JSON.stringify(result));
    
    if (!result){
      return res.send('No data found');
    }
  });

  res.send('<p>Trump: ' + trump_count + '\n\nHillary: '+hillary_count+'</p>');
});

app.get('/gloryhole', function (req, res) {
  res.send(PORT);
});

app.get('/get', function (req, res) {
    res.send(trump_count+","+hillary_count);
});

app.get('/inc', function (req, res) {

    var to_add_t, to_add_h = 0;
    if (!req.query.trump){
        to_add_t = parseInt(req.query.trump);
    }

    trump_count+=to_add_t;
    
    if (!req.query.hillary){
        to_add_h = parseInt(req.query.hillary);
    }
    
    hillary_count+=to_add_h;

    client.query('INSERT INTO scores(trump,hillary) VALUES($1,$2)', [to_add_t,to_add_h]);

    res.send(trump_count+","+hillary_count);
});

app.listen(PORT, function () {
  console.log('Example app listening on port: ' +PORT);
  saveScores();
  setInterval(saveScores, 60000);
});


function saveScores(){
    fs.writeFile("scores.save", trump_count+"\n"+hillary_count);

  var _t = 0;
  var _h = 0;

  var query = client.query('SELECT * FROM scores');
  query.on('row', function(result) {
    console.log("Result: " + JSON.stringify(result));
    if (result.trump != undefined){
        _t += parseInt(result.trump);
        console.log("adding _t: " + _t);
    } else {
        console.log("Found null entry for trump");
    }
    if (result.hillary != undefined){
        _h += parseInt(result.hillary);
    } else {
        console.log("Found null entry for hillary");
    }
    if (!result){
      return res.send('No data found');
    }
  });

  trump_count = _t;
  hillary_count = _h;

  query = client.query('DELETE * FROM scores;');

  query = client.query('INSERT INTO scores(trump,hillary) VALUES($1,$2)',[trump_count,hillary_count]);
  
  console.log("Saved Scores: " + [trump_count, hillary_count]);
};

function pushScores(){
    console.log("save scores here");
};
