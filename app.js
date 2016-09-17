var express = require('express');
var app = express();
var fs = require('fs');
var pg = require('pg');


var trump_count = -1;
var hillary_count = -1;

var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);
//client.connect();

var PORT = process.env.PORT || 6969;
var HOST = '0.0.0.0';

app.get('/', function (req, res) {
  client.query('INSERT INTO score_db(trump) VALUES($1)', 123);

  var query = client.query('SELECT * FROM score_db');
  query.on('row', function(result) {
    console.log(result);
    
    if (!result){
      return res.send('No data found');
    }
    else{
      res.send('<p>Trump: ' + trump_count + '\n\nHillary: '+hillary_count+'</p>');
    }
  });
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
