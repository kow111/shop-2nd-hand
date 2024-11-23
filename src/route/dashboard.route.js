const express = require("express");
const {
  getRevenueChart,
  getDashboardStats,
  getOrderStatusDistribution,
} = require("../controller/dashboard.controller");
const routerAPI = express.Router();

routerAPI.get("/revenue-chart", getRevenueChart);
routerAPI.get("/stats", getDashboardStats);
routerAPI.get("/order-status-distribution", getOrderStatusDistribution);

module.exports = routerAPI;
