const {
  signupService,
  loginService,
  verifiedUserService,
  resetPasswordService,
  sendOTPService,
  verifyPasswordService,
} = require("../service/auth.service");
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
      EM: "Tạo tài khoản thành công",
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
      EM: "Đăng nhập thành công",
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
      EM: "Xác thực tài khoản thành công",
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
      EM: "Đã gửi OTP",
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
      EM: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postVerifyPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    let data = {
      email,
      password,
    };
    await verifyPasswordService(data);
    return res.status(200).json({
      DT: null,
      EM: "Mật khẩu hợp lệ",
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
  postVerifyPassword,
};
