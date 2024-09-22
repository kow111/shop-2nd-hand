const express = require("express");
const { auth } = require("../middleware/auth");
const { postCreateOrder } = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.post("/", auth, postCreateOrder);

module.exports = routerAPI;
