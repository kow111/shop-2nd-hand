const Notification = require("../model/notification.model");

const sendNotificationService = async (data) => {
  const { user, order, message } = data;
  try {
    let rs = await Notification.create({
      user,
      order,
      message,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getNotificationService = async (userId) => {
  try {
    let rs = await Notification.find({ user: userId });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendNotificationService,
  getNotificationService,
};
