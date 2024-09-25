const Queue = require("bull");
const { sendNotificationService } = require("./notification.service");

const notificationQueue = new Queue("notificationQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
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
  notificationQueue,
};
