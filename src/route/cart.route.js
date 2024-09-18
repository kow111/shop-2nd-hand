const express = require("express");
const { auth } = require("../middleware/auth");
const { getCartItem } = require("../controller/cart.controller");

const routerAPI = express.Router();

routerAPI.get("/", auth, getCartItem);

module.exports = routerAPI;
