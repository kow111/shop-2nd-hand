const express = require("express");
const {
  getAllColor,
  postCreateColor,
  putUpdateColor,
} = require("../controller/color.controller");

const routerAPI = express.Router();

routerAPI.get("/", getAllColor);
routerAPI.post("/", postCreateColor);
routerAPI.put("/:colorId", putUpdateColor);

module.exports = routerAPI;
