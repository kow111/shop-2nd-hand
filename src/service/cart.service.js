const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

const getCartItemService = async (userId) => {
  try {
    // const rs = await Cart.findOne({ user: userId }).populate("items.product");
    //delete the product with quantity = 0 in cart before return and then save the cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    cart.items = cart.items.filter((item) => item.product.quantity > 0);
    const rs = await cart.save();
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCartItemService = async (userId, data) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng");

    if (data.deleteProduct && data.deleteProduct.length > 0) {
      return await removeProductsFromCart(cart, data.deleteProduct);
    }

    const product = await Product.findById(data.productId);
    if (data.quantity > product.quantity) {
      throw new Error(
        `Số lượng sản phẩm ${product.productName} không đủ. Số lượng còn lại là ${product.quantity}.`
      );
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
  if (!data.quantity) throw new Error("Nhập số lượng sản phẩm");

  cart.items.push({ product: data.productId, quantity: data.quantity });
  return await cart.save({ new: true });
};

const updateProductQuantityInCart = async (userId, data) => {
  if (!data.quantity) throw new Error("Nhập số lượng sản phẩm");

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
