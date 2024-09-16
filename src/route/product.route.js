const express = require("express");
const {
  postCreateProduct,
  getProduct,
} = require("../controller/product.controller");
const { createProductValidator } = require("../validator/product.validator");

const routerAPI = express.Router();

routerAPI.get("/", getProduct);
routerAPI.post("/", createProductValidator, postCreateProduct);
routerAPI.put("/");
routerAPI.delete("/");

module.exports = routerAPI;
