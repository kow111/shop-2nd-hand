const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  discountName: { type: String, required: true },
  discountCode: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  expiredAt: { type: Date },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
