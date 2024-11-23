const Queue = require("bull");
const {
  changeOrderStatusService,
  isOrderCanceled,
} = require("../service/order.service");
const redisConfig = require("../config/redis.config");

const orderStatusQueue = new Queue("orderStatusQueue", {
  redis: redisConfig,
});

orderStatusQueue.process(async (job) => {
  const { orderId } = job.data;
  const isCancel = await isOrderCanceled(orderId);
  if (isCancel) {
    console.log(`Order ${orderId} is canceled, skipping confirmation.`);
    return;
  }
  await changeOrderStatusService(orderId, "CONFIRMED");
  console.log(`Order ${orderId} status changed to CONFIRMED.`);
});

const addChangeOrderStatusJob = (jobData) => {
  orderStatusQueue.add(jobData, { delay: 0.3 * 60 * 1000 });
};

module.exports = {
  addChangeOrderStatusJob,
};
