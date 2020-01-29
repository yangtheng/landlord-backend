const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const uuid = require('uuid/v1');

const { createRoom, joinRoom, leaveRoom, disconnect, getRoom, getRooms } = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connect', (socket) => {
  console.log(`${socket.id} connected`);
  socket.on('createRoom', user => {
    const roomId = uuid();
    socket.join(roomId);
    createRoom(roomId, socket.id, user);
    console.log(`room ${roomId} created`);
    io.emit('reduxActionReceived', {
      type: 'roomInfo/REC_CREATE_ROOM',
      rooms: getRooms(),
    });
  })

  socket.on('joinRoom', ({ user, roomId }) => {
    socket.join(roomId);
    joinRoom(roomId, socket.id, user)
    console.log(`${socket.id} connected to ${roomId}`);
    io.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_JOIN',
      users: getRoom().users,
    });
  });

  socket.on('leaveRoom', ({ user, roomId }) => {
    socket.leave(roomId);
    leaveRoom(roomId, socket.id)
    console.log(`${socket.id} left ${roomId}`);
    socket.broadcast.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_LEAVE',
      users: getRoom().users,
    });
  });

  socket.on('disconnect', () => {
    const roomId = disconnect(socket.id)
    console.log(`${socket.id} disconnected`);
    socket.broadcast.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_LEAVE',
      users: getRoom().users,
    });
  })

  socket.on('reduxActionSent', (action) => {
    console.log('received Action');
    io.to(action.roomId).emit('reduxActionReceived', action);
  });
});

server.listen(process.env.PORT || 5000, () => console.log('server has started'));
