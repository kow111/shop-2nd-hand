const Cart = require("../model/cart.model");

const getCartItemService = async (userId) => {
  try {
    const rs = await Cart.findOne({ user: userId }).populate("items.product");
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCartItemService = async (userId, data) => {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found for this user.");
    }

    const isProductInCart = cart.items.find(
      (item) => item.product.toString() === data.productId
    );

    if (data.deleteProduct && data.deleteProduct.length > 0) {
      for (let productId of data.deleteProduct) {
        cart.items = cart.items.filter(
          (item) => item.product.toString() !== productId
        );
      }
      let rs = await cart.save();
      return rs;
    } else if (!isProductInCart) {
      let cart = await Cart.findOne({ user: userId });
      cart.items.push({ product: data.productId, quantity: data.quantity });
      let rs = await cart.save({ new: true });
      return rs;
    } else {
      let rs = await Cart.findOneAndUpdate(
        { user: userId, "items.product": data.productId },
        { "items.$.quantity": data.quantity },
        { new: true }
      );
      return rs;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getCartItemService,
  updateCartItemService,
};
