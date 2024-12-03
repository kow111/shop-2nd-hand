const express = require("express");
const { auth } = require("../middleware/auth");
const {
  getNotifications,
  readNotification,
} = require("../controller/notification.controller");

const routerAPI = express.Router();

routerAPI.get("/", auth, getNotifications);
routerAPI.put("/read/:notificationId", auth, readNotification);

module.exports = routerAPI;
