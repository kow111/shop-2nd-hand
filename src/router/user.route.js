const express = require("express");
const { createUserValidator } = require("../validator/user.validator");
const {
  postSignupUser,
  postLoginUser,
} = require("../controller/user.controller");
const routerAPI = express.Router();

routerAPI.post("/signup", createUserValidator, postSignupUser);
routerAPI.post("/login", postLoginUser);

module.exports = routerAPI;
