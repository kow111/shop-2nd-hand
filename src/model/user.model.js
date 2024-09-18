const mongoose = require("mongoose");
const Cart = require("./cart.model");

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
  is_verified: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  address: { type: String, default: "" },
  otp: { type: String, default: null },
});

userSchema.post("save", async function (user) {
  await Cart.create({ user: user._id, items: [] });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
