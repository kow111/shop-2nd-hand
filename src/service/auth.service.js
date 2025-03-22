require("dotenv").config();
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../config/email.transporter");

const signupService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email đã tồn tài");
    }
    if (password.length < 6) {
      throw new Error("Mật khẩu ít nhất 6 ký tự");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let rs = await User.create({
      email,
      password: hashedPassword,
      image:
        "https://firebasestorage.googleapis.com/v0/b/shop-2nd-hand.appspot.com/o/default-image.png?alt=media",
    });
    return rs;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email }).populate("branch");
    if (!user) {
      throw new Error("Email chưa đăng ký");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu không đúng");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, is_admin: user.is_admin, branch: user.branch ? user.branch : null },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Thời gian hết hạn của token
      }
    );
    return { user, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

const verifiedUserService = async (data) => {
  try {
    const { email, otp } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    if (user.otp !== otp) {
      throw new Error("OTP is incorrect");
    }
    user.is_verified = true;
    user.otp = null;
    await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendOTPService = async (data) => {
  try {
    const { email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    const otp = crypto.randomBytes(3).toString("hex");
    user.otp = otp;
    await user.save();
    const mailOptions = {
      from: "nguyenducphu200321@gmail.com",
      to: user.email,
      subject: `Your OTP for SecondHandShop`,
      text: `Your OTP is: ${otp}. `,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      throw new Error(err.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetPasswordService = async (data) => {
  try {
    const { email, otp, newPassword } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    if (user.otp !== otp) {
      throw new Error("OTP không đúng");
    }
    if (newPassword.length < 6) {
      throw new Error("Mật khẩu ít nhất 6 ký tự");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otp = null;
    await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyPasswordService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email }).select("password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mât khẩu không đúng");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  signupService,
  loginService,
  sendOTPService,
  resetPasswordService,
  verifiedUserService,
  verifyPasswordService,
};
