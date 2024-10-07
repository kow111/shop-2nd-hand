const express = require("express");
const { auth, requireAdmin } = require("../middleware/auth");
const {
  postCreateOrder,
  putCancelOrder,
  putChangeOrderStatus,
  getOrderByUser,
  getOrderById,
  getProductUserPurchased,
  getOrderByAdmin,
} = require("../controller/order.controller");
const routerAPI = express.Router();

routerAPI.get("/", auth, getOrderByUser);
routerAPI.get("/product-purchased", auth, getProductUserPurchased);
routerAPI.get("/admin", auth, requireAdmin, getOrderByAdmin);
routerAPI.get("/:orderId", auth, getOrderById);
routerAPI.post("/", auth, postCreateOrder);
routerAPI.put("/cancel-order/:orderId", auth, putCancelOrder);
routerAPI.put("/:orderId/status", auth, putChangeOrderStatus);

module.exports = routerAPI;
