const express = require("express");
const {
  getDiscount,
  postCreateDiscount,
  getApplyDiscount,
} = require("../controller/discount.controller");
const { auth } = require("firebase-admin");
const { requireAdmin } = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/", auth, requireAdmin, getDiscount);
routerAPI.post("/", auth, requireAdmin, postCreateDiscount);
routerAPI.get("/apply", auth, getApplyDiscount);

module.exports = routerAPI;
