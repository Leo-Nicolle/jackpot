const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const webpackConfig = require('./webpack.config');

const butcher = require('./server/butcher');

const compiler = webpack(webpackConfig);

const app = express();
const server = http.Server(app);
const io = socketio(server);

const PORT = 3001;
app.use(middleware(compiler, {
  // webpack-dev-middleware options
}));

server.listen(PORT, () => console.log(`Example app listening on port${PORT}`));

const arduino = {};


function sendButch(socket) {
  return readFromStream.machin
    .then(images => butcher.buth(images))
    .then(data => socket.emit('butch', data))
    .catch(err => socket.emit('error', err));
}

function init(socket) {
  arduino.on('request-butch', () => sendButch(socket));
}

io.on('connection', init);
