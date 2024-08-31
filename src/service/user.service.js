require("dotenv").config();
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = require("../config/email.transporter");

const signupService = async (data) => {
  try {
    const { email, password } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let rs = await User.create({
      email,
      password: hashedPassword,
    });
    return rs;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
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

const forgotPasswordService = async (data) => {
  try {
    const { email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const otp = crypto.randomBytes(3).toString("hex");
    user.otp = otp;
    await user.save();
    const mailOptions = {
      from: "nguyenducphu200321@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
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
      throw new Error("User not found");
    }
    if (user.otp !== otp) {
      throw new Error("OTP is incorrect");
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

module.exports = {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
};
