const express = require("express");
const {
  postCreateCategory,
  getAllCategory,
  putUpdateCategory,
} = require("../controller/category.controller");

const routerAPI = express.Router();

routerAPI.post("/", postCreateCategory);
routerAPI.get("/", getAllCategory);
routerAPI.put("/:id", putUpdateCategory);

module.exports = routerAPI;
