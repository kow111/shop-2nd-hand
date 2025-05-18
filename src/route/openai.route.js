const express = require("express");
const { getDescription } = require("../controller/openai.controller");
const routerAPI = express.Router();

routerAPI.post("/generate-description", getDescription);

module.exports = routerAPI;
