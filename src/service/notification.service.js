const Notification = require("../model/notification.model");
const { getSocket } = require("../config/socket");

const sendNotificationService = async (data) => {
  const { user, order, message } = data;
  try {
    let rs = await Notification.create({
      user,
      order,
      message,
    });
    const io = getSocket();
    io.emit("notification", rs);
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

module.exports = {
  sendNotificationService,
  getNotificationService,
};
