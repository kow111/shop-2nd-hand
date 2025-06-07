const express = require("express");

const { getAllLog } = require("../controller/log.controller");
const { auth, requireAdmin } = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/", auth, requireAdmin, getAllLog);

module.exports = routerAPI;
