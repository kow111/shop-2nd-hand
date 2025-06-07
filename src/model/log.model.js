const mongoose = require("mongoose");
//log for update quantity of product
const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    quantity: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      enum: ["ADD", "REMOVE"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);
module.exports = Log;
