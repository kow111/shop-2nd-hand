const {
  signupService,
  loginService,
  verifiedUserService,
  resetPasswordService,
  sendOTPService,
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

const postVerifiedUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let data = {
      email,
      otp,
    };
    await verifiedUserService(data);
    return res.status(200).json({
      DT: null,
      EM: "Verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let data = {
      email,
    };
    await sendOTPService(data);
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
  postSendOTP,
  postResetPassword,
  postVerifiedUser,
};
