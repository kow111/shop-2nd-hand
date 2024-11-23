const express = require("express");
const { getRevenueChart } = require("../controller/dashboard.controller");
const routerAPI = express.Router();

routerAPI.get("/revenue-chart", getRevenueChart);

module.exports = routerAPI;
