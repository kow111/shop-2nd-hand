const {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} = require("../service/user.service");
const { validationResult } = require("express-validator");

const postSignupUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ DT: null, EM: errorMessages[0] });
  }
  try {
    const { email, password } = req.body;
    let data = {
      email,
      password,
    };
    let rs = await signupService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Create user successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let data = {
      email,
      password,
    };
    let rs = await loginService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Login successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let data = {
      email,
    };
    await forgotPasswordService(data);
    return res.status(200).json({
      DT: null,
      EM: "OTP sent",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    let data = {
      email,
      otp,
      newPassword,
    };
    await resetPasswordService(data);
    return res.status(200).json({
      DT: null,
      EM: "Reset password successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  postSignupUser,
  postLoginUser,
  postForgotPassword,
  postResetPassword,
};
