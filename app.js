var express = require('express');
var app = express();
var Client = require('ftp');

var trump_count = 420;
var hillary_count = 666;

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


  var c = new Client();
  c.on('ready', function() {
    c.get('/public_html/cornhole/scores.save', function(err, stream) {
      if (err){
        console.log(err);
        throw err;
      }
      stream.once('close', function() { c.end(); });
      stream.pipe(fs.createWriteStream('scores.save'));
    });
  });
  // connect to localhost:21 as anonymous
  c.connect({host: "blacksocks.me", user : "a7076913", password : "Python95"});
});


var fs = require('fs');
fs.readFile("scores.save", function(err, data) {
    if(err) {
        throw err;
    }
    data = String(data);
    
    var parse_t = "";
    var parse_h = "";

    for (var i = 0; i < data.length; i++){
        if ( i >= data.indexOf('\n')){
            parse_h = parse_h + data.charAt(i);
        } else {
            parse_t = parse_t + data.charAt(i);
        }
    }
    
    trump_hits = parseInt(parse_t);
    hillary_hits = parseInt(parse_h);
    console.log("Total punches read: " + data);
}); 

function saveScores(){
    fs.writeFile("scores.save", trump_count+"\n"+hillary_count);
    console.log("Saved Scores");
    setInterval(saveScores, 30000);
};

function pushScores(){
  var Client = require('ftp');
  console.log("Pushing scores");
  var c = new Client();
  c.on('ready', function() {
    c.put('scores.save', '/public_html/cornhole/scores.save', function(err) {
      if (err){
        console.log("Error with pushing scores to safety");
        throw err;
      };
      c.end();
      setInterval(pushScores, 60000);
      console.log("Pushed Scores to safety");
    });
  });
  c.connect({host: "blacksocks.me", user : "a7076913", password : "Python95"});
};
