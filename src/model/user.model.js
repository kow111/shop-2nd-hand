const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
  is_admin: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  address: { type: String },
  otp: { type: String },
  is_verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
