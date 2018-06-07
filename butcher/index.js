const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

const app = express();
const server = http.Server(app);
const io = socketio(server);

const PORT = 3001;
app.use(middleware(compiler, {
  // webpack-dev-middleware options
}));

server.listen(PORT, () => console.log(`Example app listening on port${PORT}`));


io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});
