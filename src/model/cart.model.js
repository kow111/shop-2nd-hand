const mongoose = require("mongoose");
const Product = require("./product.model");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number },
    },
  ],
});

cartSchema.pre("save", async function (next) {
  try {
    if (!Array.isArray(this.items)) {
      this.items = [];
    }
    for (let item of this.items) {
      const product = await Product.findById(item.product);

      if (product) {
        item.price = product.price * item.quantity;
      } else {
        throw new Error("Product not found");
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

cartSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const query = this.getQuery();
    if (update && update["items.$.quantity"]) {
      const quantityChange = update["items.$.quantity"];
      const productId = query["items.product"];

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found.");
      }
      const newPrice = product.price * quantityChange;

      update.$set = update.$set || {};
      update.$set["items.$.price"] = newPrice;
    }

    this.setUpdate(update);

    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
