const Order = require("../model/order.model");

const getRevenueChartService = async (fromDate, toDate) => {
  try {
    let dates = [];
    let revenues = [];
    if (!fromDate || !toDate) {
      throw new Error("fromDate and toDate are required");
    }
    let orders = await Order.find({
      status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
      createdAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    });
    orders.forEach((order) => {
      let date = order.createdAt.toISOString().split("T")[0];
      let index = dates.indexOf(date);
      if (index === -1) {
        dates.push(date);
        revenues.push(order.totalAmount);
      } else {
        revenues[index] += order.totalAmount;
      }
    });
    return {
      dates,
      revenues,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getRevenueChartService,
};
