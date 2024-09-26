const Queue = require("bull");
const { sendNotificationService } = require("../service/notification.service");
const redisConfig = require("../config/redis.config");

const notificationQueue = new Queue("notificationQueue", {
  redis: redisConfig,
});

notificationQueue.process(async (job) => {
  const { userId, orderId, newStatus } = job.data;

  sendNotificationService({
    user: userId,
    order: orderId,
    message: `Đơn hàng ${orderId} đã thay đổi trạng thái thành ${newStatus}`,
  });
});

const addNotificationJob = (jobData) => {
  notificationQueue.add(jobData);
};

module.exports = {
  addNotificationJob,
};
