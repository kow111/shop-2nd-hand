const express = require("express");
const {
  postCreateProduct,
  getProduct,
  getProductById,
  putUpdateProduct,
} = require("../controller/product.controller");
const { createProductValidator } = require("../validator/product.validator");
const { auth, requireAdmin } = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/", getProduct);
routerAPI.get("/:id", getProductById);
routerAPI.post("/", createProductValidator, postCreateProduct);
routerAPI.put("/:id", auth, requireAdmin, putUpdateProduct);
routerAPI.delete("/");

module.exports = routerAPI;
