const express = require("express");
const { auth } = require("../middleware/auth");
const {
  putUpdateUser,
  getUserByIdUser,
} = require("../controller/user.controller");

const routerAPI = express.Router();

routerAPI.put("/update", auth, putUpdateUser);
routerAPI.get("/info", auth, getUserByIdUser);

module.exports = routerAPI;
