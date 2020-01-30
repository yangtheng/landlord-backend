const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const cors = require('cors');
const uuid = require('uuid/v1');

const { createRoom, joinRoom, leaveRoom, disconnect, getRoom, getRooms } = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on('connect', (socket) => {
  console.log(`${socket.id} connected`);

  socket.emit('reduxActionReceived', {
    type: 'roomInfo/REC_GET_ROOMS',
    rooms: getRooms(),
  });

  socket.on('createRoom', user => {
    const roomId = uuid();
    socket.join(roomId);
    createRoom(roomId, socket.id, user);
    console.log(`room ${roomId} created`);
    socket.emit('reduxActionReceived', {
      type: 'roomInfo/REC_CREATOR_JOIN',
      roomId,
      user,
      users: getRoom(roomId).users,
    });
    io.emit('reduxActionReceived', {
      type: 'roomInfo/REC_GET_ROOMS',
      rooms: getRooms(),
    });
  })

  socket.on('joinRoom', ({ user, roomId }) => {
    socket.join(roomId);
    joinRoom(roomId, socket.id, user)
    console.log(`${socket.id} connected to ${roomId}`);
    io.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_JOIN',
      users: getRoom(roomId).users,
    });
    io.emit('reduxActionReceived', {
      type: 'roomInfo/REC_GET_ROOMS',
      rooms: getRooms(),
    });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    leaveRoom(roomId, socket.id)
    console.log(`${socket.id} left ${roomId}`);
    socket.broadcast.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_LEAVE',
      users: getRoom(roomId).users,
    });
    io.emit('reduxActionReceived', {
      type: 'roomInfo/REC_GET_ROOMS',
      rooms: getRooms(),
    });
  });

  socket.on('disconnect', () => {
    const roomId = disconnect(socket.id)
    console.log(`${socket.id} disconnected`);
    socket.broadcast.to(roomId).emit('reduxActionReceived', {
      type: 'roomInfo/REC_USER_LEAVE',
      users: getRoom(roomId).users,
    });
    io.emit('reduxActionReceived', {
      type: 'roomInfo/REC_GET_ROOMS',
      rooms: getRooms(),
    });
  })

  socket.on('reduxActionSent', (action) => {
    console.log('received Action');
    io.to(action.roomId).emit('reduxActionReceived', action);
  });
});

server.listen(process.env.PORT || 5000, () => console.log('server has started'));
