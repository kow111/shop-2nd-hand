const express = require("express");
const {
  postCreateProduct,
  getProduct,
  getProductById,
  putUpdateProduct,
} = require("../controller/product.controller");
const { createProductValidator } = require("../validator/product.validator");

const routerAPI = express.Router();

routerAPI.get("/", getProduct);
routerAPI.get("/:id", getProductById);
routerAPI.post("/", createProductValidator, postCreateProduct);
routerAPI.put("/:id", putUpdateProduct);
routerAPI.delete("/");

module.exports = routerAPI;
