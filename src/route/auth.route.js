const express = require("express");
const { createUserValidator } = require("../validator/user.validator");
const {
  postSignupUser,
  postLoginUser,
  postSendOTP,
  postResetPassword,
  postVerifiedUser,
  postVerifyPassword,
} = require("../controller/auth.controller");
const routerAPI = express.Router();

routerAPI.post("/signup", createUserValidator, postSignupUser);
routerAPI.post("/login", postLoginUser);
routerAPI.post("/verified-user", postVerifiedUser);
routerAPI.post("/send-otp", postSendOTP);
routerAPI.post("/reset-password", postResetPassword);
routerAPI.post("/verify-password", postVerifyPassword);

module.exports = routerAPI;
