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

server.bind(PORT, '0.0.0.0');
