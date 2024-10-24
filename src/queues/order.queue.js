const Queue = require("bull");
const { changeOrderStatusService } = require("../service/order.service");
const redisConfig = require("../config/redis.config");

const orderStatusQueue = new Queue("orderStatusQueue", {
  redis: redisConfig,
});

orderStatusQueue.process(async (job) => {
  const { orderId } = job.data;
  await changeOrderStatusService(orderId, "CONFIRMED");
});

const addChangeOrderStatusJob = (jobData) => {
  orderStatusQueue.add(jobData, { delay: 0.3 * 60 * 1000 });
};

module.exports = {
  addChangeOrderStatusJob,
};
