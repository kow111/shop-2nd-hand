const express = require("express");
const {
  getRevenueChart,
  getDashboardStats,
} = require("../controller/dashboard.controller");
const routerAPI = express.Router();

routerAPI.get("/revenue-chart", getRevenueChart);
routerAPI.get("/stats", getDashboardStats);

module.exports = routerAPI;
