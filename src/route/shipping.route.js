const express = require("express");
const { CalculateShipping } = require("../controller/shipping.controller");
const Router = express.Router();

Router.get("/calculate", CalculateShipping);

module.exports = Router;
