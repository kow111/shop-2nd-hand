const express = require("express");
const { auth } = require("../middleware/auth");
const {
  postCreateOrder,
  putCancelOrder,
  putChangeOrderStatus,
} = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.post("/", auth, postCreateOrder);
routerAPI.put("/cancel-order/:orderId", auth, putCancelOrder);
routerAPI.put("/:orderId/status", auth, putChangeOrderStatus);

module.exports = routerAPI;
