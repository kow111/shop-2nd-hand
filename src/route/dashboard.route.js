const express = require("express");
const {
  getRevenueChart,
  getDashboardStats,
  getOrderStatusDistribution,
  getRevenueChartByMonth,
  getSellerCategory,
} = require("../controller/dashboard.controller");
const { auth, requireAdmin } = require("../middleware/auth");
const routerAPI = express.Router();

routerAPI.get("/revenue-chart", auth, requireAdmin, getRevenueChart);
routerAPI.get(
  "/revenue-chart-by-month",
  auth,
  requireAdmin,
  getRevenueChartByMonth
);
routerAPI.get("/stats", auth, requireAdmin, getDashboardStats);
routerAPI.get(
  "/order-status-distribution",
  auth,
  requireAdmin,
  getOrderStatusDistribution
);
routerAPI.get("/seller-category", auth, requireAdmin, getSellerCategory);

module.exports = routerAPI;
