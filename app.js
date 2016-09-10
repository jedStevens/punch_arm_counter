var express = require('express');
var app = express();

var trump_count = 2796
var hillary_count = 7899

var PORT = process.env.PORT
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

const publicIp = require('public-ip');
var ip_addr = ''
 
publicIp.v4().then(ip => {
    console.log(ip);
    //=> '46.5.21.123' 
    ip_addr = ip;
});
 
publicIp.v6().then(ip => {
    console.log(ip);
    //=> 'fe80::200:f8ff:fe21:67cf' 
});

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

});

server.bind(PORT, '0.0.0.0');



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


