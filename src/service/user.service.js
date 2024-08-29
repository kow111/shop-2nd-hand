require("dotenv").config();
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

module.exports = { signupService, loginService };
