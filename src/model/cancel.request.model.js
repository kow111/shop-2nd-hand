const mongoose = require("mongoose");

const cancelRequestModel = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CancelRequest = mongoose.model("CancelRequest", cancelRequestModel);

module.exports = CancelRequest;
