const mongoose = require("mongoose");
const Cart = require("./cart.model");

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
  image: { type: String, default: "" },
  is_verified: { type: Boolean, default: false },
  role: { type: String, enum: ["USER", "ADMIN", "MANAGER"], default: "USER" },
  is_active: { type: Boolean, default: true },
  otp: { type: String, default: null },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
  branch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
});

userSchema.post("save", async function (user) {
  const rs = await Cart.findOne({ user: user._id });
  if (rs) return;
  await Cart.create({ user: user._id, items: [] });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
