var express = require('express');
var app = express();
var fs = require('fs');
var pg = require('pg');

var config = {
  user: 'jed_a7076913', //env var: PGUSER
  database: 'a7076913_scores', //env var: PGDATABASE
  password: process.env.PGPASSWORD, //env var: PGPASSWORD
  host: process.env.DATABASE_URL || "1.2.3.4", // Server hosting the postgres database
  port: process.env.PGPORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

pool.connect(function (err, client, done){
    if (err) {
        console.log(err);
        throw err;
    }
    
    client.query('SELECT * from scores', function(err, res){
        done();
        if (err){
            console.log(err);
            throw err;
        }
        
        console.log(res.rows[0]);
    });
});

pool.on('error', function(err, client){
    console.error('idle client error', err.message, err.stack)
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
