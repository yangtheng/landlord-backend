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
  let roomIsEmpty = false;
  rooms = rooms.map(room => {
    if (room.roomId === roomId) {
      if (!room.users.filter(roomUser => socketId !== roomUser.socketId).length) roomIsEmpty = true;
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
  if (roomIsEmpty) rooms = rooms.filter(room => room.roomId !== roomId);
};

const disconnect = socketId => {
  let roomId;
  let roomIsEmpty = false;
  rooms = rooms.map(room => {
    if (room.users.findIndex(user => user.socketId === socketId) === -1) {
      return room;
    }
    roomId = room.roomId;
    if (!room.users.filter(roomUser => socketId !== roomUser.socketId).length) roomIsEmpty = true;
    return {
      ...room,
      ...{
        users: room.users.filter(roomUser => socketId !== roomUser.socketId),
      },
    };
  });
  if (roomIsEmpty) rooms = rooms.filter(room => room.roomId !== roomId);
  return roomId;
};

const getRoom = roomId => rooms.filter(room => room.roomId === roomId)[0] || [];

const getRooms = () => rooms;

const setLeftovers = (cards, roomId) => {
  rooms = rooms.map(room => {
    if (room.roomId !== roomId) return room;
    return {
      ...room,
      leftovers: cards,
    }
  })
}

const getLeftovers = roomId => rooms.filter(room => room.roomId === roomId)[0].leftovers;

module.exports = { createRoom, joinRoom, leaveRoom, disconnect, getRoom, getRooms, setLeftovers, getLeftovers };
