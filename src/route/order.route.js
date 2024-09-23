const express = require("express");
const { auth } = require("../middleware/auth");
const {
  postCreateOrder,
  putCancelOrder,
} = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.post("/", auth, postCreateOrder);
routerAPI.put("/cancel-order/:orderId", auth, putCancelOrder);

module.exports = routerAPI;
