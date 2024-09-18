const express = require("express");
const { auth } = require("../middleware/auth");
const {
  getCartItem,
  putUpdateCartItem,
} = require("../controller/cart.controller");

const routerAPI = express.Router();

routerAPI.get("/", auth, getCartItem);
routerAPI.put("/", auth, putUpdateCartItem);

module.exports = routerAPI;
