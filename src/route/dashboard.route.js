const express = require("express");
const {
  getRevenueChart,
  getDashboardStats,
  getOrderStatusDistribution,
  getRevenueChartByMonth,
} = require("../controller/dashboard.controller");
const routerAPI = express.Router();

routerAPI.get("/revenue-chart", getRevenueChart);
routerAPI.get("/revenue-chart-by-month", getRevenueChartByMonth);
routerAPI.get("/stats", getDashboardStats);
routerAPI.get("/order-status-distribution", getOrderStatusDistribution);

module.exports = routerAPI;
