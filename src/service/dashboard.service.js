const Order = require("../model/order.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");

const getRevenueChartService = async (fromDate, toDate) => {
  try {
    if (!fromDate || !toDate) {
      throw new Error("fromDate and toDate are required");
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    let dates = [];
    let revenues = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      revenues.push(0);
      currentDate.setDate(currentDate.getDate() + 1);
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
      if (index !== -1) {
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

const getOrderStatusDistributionService = async () => {
  try {
    let orderStatusDistribution = {
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
    };

    let orders = await Order.find({
      status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
    });

    orders.forEach((order) => {
      orderStatusDistribution[order.status] += 1;
    });

    return orderStatusDistribution;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDashboardStatsService = async () => {
  try {
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProducts = 0;
    let totalUsers = 0;

    let orders = await Order.find({
      status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
    });

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
    });

    totalOrders = orders.length;

    totalProducts = await Product.countDocuments();

    totalUsers = await User.countDocuments();

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getRevenueChartService,
  getDashboardStatsService,
  getOrderStatusDistributionService,
};
