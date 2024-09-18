const express = require("express");
const {
  postCreateProduct,
  getProduct,
  getProductById,
} = require("../controller/product.controller");
const { createProductValidator } = require("../validator/product.validator");

const routerAPI = express.Router();

routerAPI.get("/", getProduct);
routerAPI.get("/:id", getProductById);
routerAPI.post("/", createProductValidator, postCreateProduct);
routerAPI.put("/");
routerAPI.delete("/");

module.exports = routerAPI;
