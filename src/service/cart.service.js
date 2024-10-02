const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

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
    if (!cart) throw new Error("Cart not found for this user.");

    const product = await Product.findById(data.productId);
    if (data.quantity > product.quantity) {
      throw new Error(
        `The quantity of product ${product.productName} is not enough. The current quantity is ${product.quantity}.`
      );
    }

    if (data.deleteProduct && data.deleteProduct.length > 0) {
      return await removeProductsFromCart(cart, data.deleteProduct);
    }

    const isProductInCart = cart.items.some(
      (item) => item.product.toString() === data.productId
    );

    if (!isProductInCart) {
      return await addProductToCart(cart, data);
    } else {
      return await updateProductQuantityInCart(userId, data);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeProductsFromCart = async (cart, productsToDelete) => {
  cart.items = cart.items.filter(
    (item) => !productsToDelete.includes(item.product.toString())
  );
  return await cart.save();
};

const addProductToCart = async (cart, data) => {
  if (!data.quantity) throw new Error("Quantity is required.");

  cart.items.push({ product: data.productId, quantity: data.quantity });
  return await cart.save({ new: true });
};

const updateProductQuantityInCart = async (userId, data) => {
  if (!data.quantity) throw new Error("Quantity is required.");

  return await Cart.findOneAndUpdate(
    { user: userId, "items.product": data.productId },
    { "items.$.quantity": data.quantity },
    { new: true }
  );
};

module.exports = {
  getCartItemService,
  updateCartItemService,
};
