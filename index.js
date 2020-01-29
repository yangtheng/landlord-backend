const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const uuid = require('uuid/v1');

const { createRoom } = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connect', (socket) => {

  socket.on('createRoom', user => {
    const roomId = uuid()
    createRoom(roomId, socket.id, user);
    console.log(`room ${roomId} created`);
    // io.emit()
  })

  socket.on('joinRoom', ({ user, roomId }) => {
    socket.join(roomId);
    console.log(`${socket.id} connected to ${roomId}`);
  });

  socket.on('leaveRoom', ({ user, roomId }) => {
    socket.leave(roomId);
    console.log(`${socket.id} left ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  })

  socket.on('reduxActionSent', (action) => {
    console.log('received Action');
    io.to(action.roomId).emit('reduxActionReceived', action);
  });
});

server.listen(process.env.PORT || 5000, () => console.log('server has started'));
