const express = require("express");
const { auth } = require("../middleware/auth");
const {
  postCreateOrder,
  putCancelOrder,
  putChangeOrderStatus,
  getOrderByUser,
} = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.get("/", auth, getOrderByUser);
routerAPI.post("/", auth, postCreateOrder);
routerAPI.put("/cancel-order/:orderId", auth, putCancelOrder);
routerAPI.put("/:orderId/status", auth, putChangeOrderStatus);

module.exports = routerAPI;
