const express = require("express");
const {
  postSignupUser,
  postLoginUser,
} = require("../controller/user.controller");
const routerAPI = express.Router();

routerAPI.post("/signup", postSignupUser);
routerAPI.post("/login", postLoginUser);

module.exports = routerAPI;
