const mongoose = require("mongoose");

const branchStockSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 0 },
});

const BranchStock = mongoose.model("BranchStock", branchStockSchema);
module.exports = BranchStock;
