const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  discountCode: {
    type: String,
    required: true,
    unique: [true, "Mã giảm giá đã tồn tại"],
  },
  discountPercentage: { type: Number, required: true },
  expiredAt: { type: Date },
  usageLimit: {
    type: Number,
    default: null,
  },
  usersUsed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  type: {
    type: String,
    enum: ["SHIPPING", "PRODUCT"],
  },
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
