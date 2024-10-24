// socket.js
const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

const getSocket = () => {
  if (!io) {
    throw new Error(
      "Socket not initialized. Please initialize the socket first."
    );
  }
  return io;
};

module.exports = { initSocket, getSocket };
