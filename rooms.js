let rooms = [];

const createRoom = (roomId, socketId, user) => {
  const roomObject = {
    roomId,
    users: [{
      socketId,
      user,
    }]
  };

  rooms = [
    ...rooms,
    roomObject,
  ];

  console.log(rooms);
};

const joinRoom = (roomId, socketId, user) => {
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      if (room.users.length >= 3) return room
      return {
        ...room,
        ...{
          users: [
            ...room.users,
            {
              socketId,
              user,
            },
          ],
        },
      };
    } else {
      return room;
    }
  });
};

const leaveRoom = (roomId, socketId) => {
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      return {
        ...room,
        ...{
          users: room.users.filter(roomUser => socketId !== roomUser.socketId),
        },
      };
    } else {
      return room;
    }
  });
};

const disconnect = socketId => {
  let roomId;
  rooms = rooms.map(room => {
    if (room.users.indexOf(user => user.socketId === socketId) === -1) {
      return room;
    }
    roomId = room.roomId;
    return {
      ...room,
      ...{
        users: room.users.filter(roomUser => socketId !== roomUser.socketId),
      },
    };
  });
  return roomId;
};

const getRoom = roomId => rooms.filter(room => room.roomId === roomId)[0] || [];

const getRooms = () => rooms;

module.exports = { createRoom, joinRoom, leaveRoom, disconnect, getRoom, getRooms };
