const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const { getStockByProductService } = require("./branch.stock.service");

const getCartItemService = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // Get branch stock for each product in cart
    for (let item of cart.items) {
      const branchStocks = await getStockByProductService(item.product._id);
      const totalAvailableQuantity = branchStocks.reduce((sum, stock) => sum + stock.quantity, 0);

      if (totalAvailableQuantity === 0) {
        // Remove item if no stock available
        cart.items = cart.items.filter(cartItem => cartItem.product._id.toString() !== item.product._id.toString());
      } else if (item.quantity > totalAvailableQuantity) {
        // Adjust quantity if it exceeds available stock
        item.quantity = totalAvailableQuantity;
      }
    }

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

    const branchStocks = await getStockByProductService(data.productId);
    const totalAvailableQuantity = branchStocks.reduce((sum, stock) => sum + stock.quantity, 0);

    if (data.quantity > totalAvailableQuantity) {
      throw new Error(
        `Số lượng sản phẩm không đủ. Tổng số lượng các chi nhánh còn lại là ${totalAvailableQuantity}.`
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
