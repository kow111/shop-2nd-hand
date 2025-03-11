const mongoose = require("mongoose");

const productchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  quantity: { type: Number, required: true },
  images: { type: [String], default: [] },
  original_price: { type: Number, default: 0 },
  price: { type: Number, required: true },
  color: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
  condition: {
    type: String,
    enum: ["NEW", "LIKENEW", "VERYGOOD", "GOOD", "FAIR", "99%", "98%"],
    required: true,
  },
  stock: [{
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    quantity: { type: Number },
  }]
});

const Product = mongoose.model("Product", productchema);

module.exports = Product;
