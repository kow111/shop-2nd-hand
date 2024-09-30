const express = require("express");
const { auth } = require("../middleware/auth");
const {
  postCreateOrder,
  putCancelOrder,
  putChangeOrderStatus,
  getOrderByUser,
  getOrderById,
} = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.get("/", auth, getOrderByUser);
routerAPI.post("/", auth, postCreateOrder);
routerAPI.put("/cancel-order/:orderId", auth, putCancelOrder);
routerAPI.put("/:orderId/status", auth, putChangeOrderStatus);
routerAPI.get("/:orderId", auth, getOrderById);

module.exports = routerAPI;
