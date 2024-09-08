const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  is_verified: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
