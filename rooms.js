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

module.exports = { createRoom };
