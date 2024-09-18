const Cart = require("../model/cart.model");

const getCartItemService = async (userId) => {
  try {
    const rs = await Cart.find({ user: userId });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getCartItemService,
};
