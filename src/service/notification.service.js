const Notification = require("../model/notification.model");
const { getSocket, userSocketMap } = require("../config/socket");

const sendNotificationService = async (data) => {
  const { user, order, message } = data;
  try {
    let rs = await Notification.create({
      user,
      order,
      message,
    });
    console.log(`Notification sent to user ${user}`);
    const io = getSocket();
    const targetSocketId = userSocketMap[user];
    if (targetSocketId) {
      io.to(targetSocketId).emit("notification", rs);
    } else {
      console.log(`User with ID ${user} not connected`);
    }
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getNotificationService = async (userId) => {
  try {
    let rs = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const readNotificationService = async (notificationId) => {
  try {
    let rs = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendNotificationService,
  getNotificationService,
  readNotificationService,
};
