const {
  getNotificationService,
  readNotificationService,
} = require("../service/notification.service");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    let rs = await getNotificationService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Lấy thông báo thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const readNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    let rs = await readNotificationService(notificationId);
    return res.status(200).json({
      DT: rs,
      EM: "Đã đọc thông báo",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = { getNotifications, readNotification };
