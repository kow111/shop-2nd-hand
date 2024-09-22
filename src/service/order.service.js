const Order = require("../model/order.model");

const createOrderService = async (data) => {
  try {
    const { userId, products, totalAmount, paymentMethod, address } = data;
    let rs = await Order.create({
      user: userId,
      products: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod,
      address,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  createOrderService,
};
