const express = require("express");
const { postCreateProduct } = require("../controller/product.controller");
const { createProductValidator } = require("../validator/product.validator");

const routerAPI = express.Router();

routerAPI.get("/");
routerAPI.post("/", createProductValidator, postCreateProduct);
routerAPI.put("/");
routerAPI.delete("/");

module.exports = routerAPI;
