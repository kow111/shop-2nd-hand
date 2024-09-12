const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
  is_verified: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  address: { type: String, default: "" },
  otp: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
