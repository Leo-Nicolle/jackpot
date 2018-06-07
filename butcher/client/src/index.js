import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('news', (data) => {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
