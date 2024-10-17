const express = require("express");
const {
  getDiscount,
  postCreateDiscount,
  getApplyDiscount,
  getDiscountByCode,
  getDiscountUserDontHave,
} = require("../controller/discount.controller");
const { auth, requireAdmin } = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/code", auth, getDiscountByCode);
routerAPI.get("/", auth, requireAdmin, getDiscount);
routerAPI.post("/", auth, requireAdmin, postCreateDiscount);
routerAPI.get("/apply", auth, getApplyDiscount);
routerAPI.get("/get-discount-user", auth, getDiscountUserDontHave);

module.exports = routerAPI;
