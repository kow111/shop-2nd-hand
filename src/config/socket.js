const { Server } = require("socket.io");

let io;
let userSocketMap = {};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} registered with socket id: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Xóa user khỏi ánh xạ khi socket ngắt kết nối
      for (let userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
      console.log("User disconnected:", socket.id);
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

module.exports = { initSocket, getSocket, userSocketMap };
