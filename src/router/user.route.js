const express = require("express");
const { createUserValidator } = require("../validator/user.validator");
const {
  postSignupUser,
  postLoginUser,
  postSendOTP,
  postResetPassword,
  postVerifiedUser,
} = require("../controller/user.controller");
const routerAPI = express.Router();

routerAPI.post("/signup", createUserValidator, postSignupUser);
routerAPI.post("/login", postLoginUser);
routerAPI.post("/verified-user", postVerifiedUser);
routerAPI.post("/send-otp", postSendOTP);
routerAPI.post("/reset-password", postResetPassword);

module.exports = routerAPI;
