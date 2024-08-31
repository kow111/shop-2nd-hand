const express = require("express");
const { createUserValidator } = require("../validator/user.validator");
const {
  postSignupUser,
  postLoginUser,
  postForgotPassword,
  postResetPassword,
} = require("../controller/user.controller");
const routerAPI = express.Router();

routerAPI.post("/signup", createUserValidator, postSignupUser);
routerAPI.post("/login", postLoginUser);
routerAPI.post("/forgot-password", postForgotPassword);
routerAPI.post("/reset-password", postResetPassword);

module.exports = routerAPI;
