const express = require("express");
const { auth } = require("../middleware/auth");
const { getNotifications } = require("../controller/notification.controller");

const routerAPI = express.Router();

routerAPI.get("/", auth, getNotifications);

module.exports = routerAPI;
