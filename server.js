'use strict';

const express = require('express');

const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

var app = express();

//var app = express();
//var http = require('http').Server(app);
//var server = app.listen(process.env.PORT);
//var io = require('socket.io').listen(server);

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.get('/transmitter', function (request, response) {
    response.render('pages/transmitter');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('buslocation', function (busLocationData) {
      io.emit('buslocation', busLocationData);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
