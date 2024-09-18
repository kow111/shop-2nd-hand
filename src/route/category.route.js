const express = require("express");
const {
  postCreateCategory,
  getAllCategory,
} = require("../controller/category.controller");

const routerAPI = express.Router();

routerAPI.post("/", postCreateCategory);
routerAPI.get("/", getAllCategory);

module.exports = routerAPI;
