var express = require('express');
var app = express();

var trump_count = 0;
var hillary_count = 0;

var PORT = process.env.PORT || 6969;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');


app.get('/', function (req, res) {
  res.send('<p>Trump: ' + trump_count + '\n\nHillary: '+hillary_count+'</p>');
});

app.listen(PORT, function () {
  console.log('Example app listening on port: ' +PORT);
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

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    setInterval(saveScores, 30000);
});

server.on('message', function (message, remote) {
    var message_str = String(message);

    if (message == "PING"){
        console.log("Ping from: " + remote.address + ':' + remote.port);
        server.send("ACCEPT"+PORT, remote.port, remote.address);
        return;
    }
    
    if (message == "GET"){
        server.send("UPDATE"+trump_count+","+hillary_count, remote.port, remote.address);
        return;
    }
    if (message == "T"){
        trump_count += 1;
        return;
    }
    if (message =="H"){
        hillary_count += 1;
        return;
    }
    
});

server.bind(PORT, '0.0.0.0');


