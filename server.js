'use strict';

var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;

    switch (path) {
        case '/':
            path = "/index.html";
        case '/transmitter.html':
            fs.readFile(__dirname + path, function (error, data) {
                if (error) {
                    response.writeHead(404);
                    response.write('File not found!');
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write('File not found!');
            response.end();
            break;
    }
});

//server.listen(8001);
server.listen(process.env.PORT);

var listener = io.listen(server);

listener.sockets.on('connection', function (socket) {
    socket.emit('message', { 'message': 'hello world' });

    socket.on('buslocation', function (busLocation) {
        socket.broadcast.emit('buslocationData', { 'lat': busLocation.lat, 'lng': busLocation.lng });
    });
});
