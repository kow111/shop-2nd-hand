const express = require("express");
const { postCreateCategory } = require("../controller/category.controller");

const routerAPI = express.Router();

routerAPI.post("/", postCreateCategory);

module.exports = routerAPI;
