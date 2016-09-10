var express = require('express');
var app = express();

var trump_count = 2796
var hillary_count = 7899

var PORT = process.env.PORT
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    var message_str = String(message)

    if (message == "PING"){
        console.log("Ping from: " + remote.address + ':' + remote.port);
        server.send("PING", remote.port, remote.address);
        return;
    }
    
});

server.bind(PORT, HOST);



/*
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

app.listen(port, function () {
  console.log('Example app listening on port', port);
});

*/


