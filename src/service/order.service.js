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

const cancelOrderService = async (orderId, userId) => {
  try {
    let order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Order already cancelled");
    }
    if (order.status !== "PENDING") {
      throw new Error("You can only cancel orders that are pending");
    }
    order.status = "CANCELLED";
    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrderService,
  cancelOrderService,
};
