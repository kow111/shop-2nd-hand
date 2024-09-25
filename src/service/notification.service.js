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
module.exports = {
  sendNotificationService,
};
